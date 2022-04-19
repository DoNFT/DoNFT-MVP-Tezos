<template>
  <div class="page">
    <nav-bar :navigation="getNav"/>
    <!-- {{
      [
        statusText.Applying,
        statusText.DeployingToIPFS,
        statusText.DeployedToIPFS,
        statusText.Minting
      ].includes(getStatus)
    }} -->
    <div
      v-if="!NFTComputedData" class="loading-container"
    >
      <spinner :size="92" color="#000" />
    </div>
    <main v-else>
      <div>
        <h1 >Send NFTs</h1>
        <div
          class="form-nft-send form-nft__detail-page"
        >
          <div
            class="nft-cards"
            v-if="NFTComputedData"
          >
            <token-card
              :get-info="true"
              :metadata="NFTComputedData"
              :edit-available="false"
            />
          </div>
          <div class="form-nft-send__inputs">
            <div>
              <span class="form-nft-send__inputs-title">Receipt ID</span>
              <textarea
                v-model="receiver_id"
                type="text"
                placeholder="Receipt ID"
                class="input form-nft__input"
                :resize="false"
              />
            </div>
            <div class="form-nft__bottom">
              <button
                class="main-btn"
                @click="sendNFTHandler"
              >Send</button>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="[
          StatusType.Approving,
          StatusType.Sending,
        ].includes(getStatus)" class="loading-container"
      >
        <spinner :size="92" color="#000" />
        <h2>{{ getStatusText(getStatus) }}</h2>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import statusMixin from "@/mixins/StatusMixin";
import { notify } from "@kyvg/vue3-notification";

import NavBar from "@/components/NavBar/NavBar";
import TokenCard from "@/components/TokenCard/TokenCard";
import Spinner from "@/components/Spinner";

const router = useRouter();
const store = useStore();
const { StatusType } = statusMixin();

// default wallet id, for testing
let receiver_id = ref("8T8zhN7AAR3UBfYhiBvKkzS39ii3AZMARZZz2KjA5UnV");

const getStatus = computed({
  get() {
    return store.getters["getStatus"];
  },
});

const getNav = computed({
  get() {
    return [
      {
        text: "Back to Gallery",
        name: "ChooseNFT",
        params: null,
      },
    ];
  },
});

const getAllNFTs = computed({
  get() {
    return store.getters["getAllNFTs"];
  },
});

const NFTComputedData = computed({
  get() {
    if (getAllNFTs.value && getAllNFTs.value.length) {
      console.log(router, "get router");
      return getAllNFTs.value.find((item) => item.tokenId === Number(router.currentRoute.value.params.id));
    }
    console.log(getAllNFTs.value, "get all nFTS");
    return null;
  },
});

const sendNFTHandler = async () => {
  try {
    console.log("SEMD MFT");
  } catch (err) {
    console.log(err, "ERRROR burnNFTHandler");
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