<template>
  <div class="page">
    <nav-bar :navigation="getNavigation"/>
    <main>
      <h1>Create new NFT</h1>
      <div class="form-nft">
        <uploader @selected="setUploadedImg"/>
        <div class="form-ntf__inputs">
          <span class="form-nft-send__inputs-title">Contract</span>
          <!-- <div class="select-wrap">
            <select v-model="nftObj.contract_id">
              <option v-for="(item, key) in contractsArr" :key="key" :value="item.getter">{{item.name}}</option>
            </select>
          </div> -->
          <span class="form-nft-send__inputs-title">Title</span>
          <input
            type="text"
            placeholder="NFT title"
            class="input form-nft__input"
            v-model="nftObj.name"
          >
          <span class="form-nft-send__inputs-title">Description</span>
          <textarea
            type="text"
            placeholder="NFT description"
            class="input form-nft__input form-nft__textarea"
            v-model="nftObj.description"
          />
          <button
            class="main-btn"
            @click.prevent="createNewNFT"
          >Submit</button>
        </div>
      </div>
      <div
        v-if="[
          StatusType.Approving,
          StatusType.Sending,
          StatusType.Minting,
        ].includes(getStatus)" class="loading-container"
      >
        <spinner :size="92" color="#000" />
        <h2>{{ getStatusText(getStatus) }}</h2>
      </div>

    </main>
  </div>
</template>

<script setup>
import { reactive, computed } from "vue";
// import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { char2Bytes } from "@taquito/utils";
import { notify } from "@kyvg/vue3-notification";
import statusMixin from "@/mixins/StatusMixin";

import NavBar from "@/components/NavBar/NavBar";
import Uploader from "@/components/Uploader/Uploader";
import Spinner from "@/components/Spinner";

const store = useStore();
// const router = useRouter();
const { StatusType } = statusMixin();
const contractAddress = "KT1VbJAzSAHQMvf5HC9zfEVMPbT2UcBvaMXb";

const nftObj = reactive({
  name: "NFT token 2 title",
  description: "NFT token 2 description",
  symbol: "XTZ",
  artifactUri: "",
  displayUri: "",
  creators: null,
  decimals: 0,
  thumbnailUri: "",
  is_transferable: true,
  shouldPreferSymbol: false
});

const getNavigation = [{
  text: "Back to Gallery",
  name: "ChooseNFT",
}];

const getTezosNetworkInstance = computed({
  get() {
    return store.getters["getTezosNetworkInstance"];
  },
});

const getUserAddress = computed({
  get() {
    return store.getters["getUserAddress"];
  },
});

const getNFTdeployResult = computed({
  get() {
    return store.getters["getNFTdeployResult"];
  },
});

const getStatus = computed({
  get() {
    return store.getters["getStatus"];
  },
});

// onMounted(() => {
//   console.log(actions, "actions");
// });
const setUploadedImg = (img) => {
  nftObj.artifactUri = img;
  nftObj.displayUri = img;
  nftObj.thumbnailUri = img;
};

const createNewNFT = async () => {
  console.log(nftObj, "NFT OBJ");
  try {
    nftObj.creators = [getUserAddress.value];
    await store.dispatch("setDeployToIPFS", nftObj);
    const contract = await getTezosNetworkInstance.value.wallet.at(contractAddress);
    const op = await contract.methods
      .mint(char2Bytes(getNFTdeployResult.value), getUserAddress.value)
      .send();

    const newNft = {
      imageHash: getNFTdeployResult.value.image,
      metadataHash: getNFTdeployResult.value,
      opHash: op.opHash
    };
    await op.confirmation();
    console.log(`https://better-call.dev/edo2net/opg/${newNft.opHash}/contents`, "tx nft");
    console.log(getNFTdeployResult.value, "getNFTdeployResult");

  } catch(err) {
    console.log(err, "ERRROR createNewNFT");
    store.dispatch("setStatus", StatusType.ChoosingParameters);
    notify({
      title: "Transaction status",
      type: "error",
      text: `Something wrong, Error: ${err}`,
      duration: 6000,
    });
  }
};

const getStatusText = (status) => {
  const statusData = statusMixin(status);
  console.log(statusData, "statusData");

  return statusData.statusText;
};
</script>
