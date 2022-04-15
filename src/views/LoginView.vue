<template>
  <div class="home-text">
    <div class="home-text__inner">
      <div class="home-text__inner__header">
        <h2>Welcome to DoNFT demo on Tezos</h2>
        <img src="@/assets/tezos-logo.png" />
      </div>
      <p class="home-text__inner__subtext">
        Use power of neural network algorithms to create new unique combinations
        of digital art
      </p>
      <p
        style="text-align: center; margin-top: 2.5em"
      >
        <button
          class="main-btn"
          @click="connectTemple"
        >Connect</button>
      </p>
      {{userAddress}}
    </div>
    <img class="home-text__logo" src="@/assets/home_img.jpg" style="height: 30%; border-radius: 20%" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { NetworkType } from "@airgap/beacon-sdk";
import { useRouter } from "vue-router";

const walletOptions = {
  name: "Illic et Numquam",
  preferredNetwork: NetworkType.HANGZHOUNET
};
const rpcUrl = "https://hangzhounet.api.tez.ie";

let wallet = ref(null);
let Tezos = ref(null);
let userAddress = ref(null);
const router = useRouter();

// onMounted(async () => {
//   Tezos.value = new TezosToolkit(rpcUrl);
//   wallet.value = new BeaconWallet(walletOptions);
//   Tezos.value.setPackerProvider(new MichelCodecPacker());

//   if (await wallet.value.client.getActiveAccount()) {
//     userAddress.value = await wallet.value.getPKH();
//     Tezos.value.setWalletProvider(wallet);
//   }

//   console.log(userAddress.value, "dres");
//   console.log(router, "router");

//   if (userAddress.value) {
//     router.push({ name: "ChooseNFT" });
//   }
// });

const connectTemple = async () => {
  if (!wallet.value) {
    wallet = new BeaconWallet(walletOptions);
  }

  try {
    console.log(wallet, "wallet");
    console.log(Tezos, "Tezos.value");
    await wallet.value.requestPermissions({
      network: {
        type: NetworkType.HANGZHOUNET,
        rpcUrl
      }
    });
    userAddress.value = await wallet.value.getPKH();
    Tezos.value.setWalletProvider(wallet);
    router.push({ name: "ChooseNFT" });
    // await getUserNfts(userAddress);
  } catch (err) {
    console.error(err);
  }
};
</script>

<style lang="scss" scoped>
.home-text {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  min-height: 60vh;
}

.home-text__inner {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 50%;
}

.home-text__inner__header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  img {
    height: 130px;
    margin-left: 40px;
  }
}

.home-text__logo {
  width: 30%;
  margin-left: 20px;
}
</style>
