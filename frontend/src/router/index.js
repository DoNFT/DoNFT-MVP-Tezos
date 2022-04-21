import { createRouter, createWebHistory } from "vue-router";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { NetworkType } from "@airgap/beacon-sdk";
import { TezosToolkit, MichelCodecPacker } from "@taquito/taquito";
import store from "@/store";
// import { notify } from "@kyvg/vue3-notification";
// import statusMixin from "@/mixins/StatusMixin";

import CreateNFT from "@/views/CreateNFT";
import SendNFT from "@/views/SendNFT";
import ChooseNFT from "@/views/ChooseNFT";
import NFTDetails from "@/views/NFTDetails";

// const { StatusType } = statusMixin();

const walletOptions = {
  name: "Illic et Numquam",
  preferredNetwork: NetworkType.HANGZHOUNET
};

const rpcUrl = "https://hangzhounet.smartpy.io";

const routes = [
  {
    path: "/",
    name: "home",
    redirect: { name: "ChooseNFT" },
  },
  {
    path: "/login",
    name: "LoginView",
    component: () => import(/* webpackChunkName: "LoginView" */ "@/views/LoginView.vue"),
    meta: { title: "Do[NFT]" },
  },
  {
    path: "/choose_nft",
    name: "ChooseNFT",
    component: ChooseNFT,
    meta: { title: "Do[NFT]", requiresAuth: true },
  },
  {
    path: "/create_nft",
    name: "CreateNFT",
    component: CreateNFT,
    meta: { title: "Do[NFT]", requiresAuth: true }
  },
  {
    path: "/nft_details/:id",
    name: "NFTDetails",
    component: NFTDetails,
    meta: { title: "Do[NFT]", requiresAuth: true }
  },
  {
    path: "/send_nft/:id",
    name: "SendNFT",
    component: SendNFT,
    meta: { title: "Do[NFT]", requiresAuth: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, _from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const Wallet = new BeaconWallet(walletOptions);
  let Tezos = new TezosToolkit(rpcUrl);
  Tezos.setPackerProvider(new MichelCodecPacker());
  let userAddress = null;

  if (await Wallet.client.getActiveAccount()) {
    userAddress = await Wallet.getPKH();
    Tezos.setWalletProvider(Wallet);
    store.commit("setUserAddress", userAddress);
    store.commit("setWalletInstance", Wallet);
    store.commit("setTezosInstance", Tezos);

    // todo: add checking for TOTAL
    store.dispatch("getUserNFTs");
  }

  console.log(userAddress, "userAddres router");

  if (requiresAuth && !userAddress) {
    next("/login");
  } else {
    next();
  }
});

export default router;
