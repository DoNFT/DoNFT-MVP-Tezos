import { createStore } from "vuex";
import { bytes2Char } from "@taquito/utils";

import {
  deployNFTtoIPFS,
  getImageForTokenByURI,
} from "@/tezos_utilities";

import {getIPFS} from "@/utilities";

const contractAddress = "KT1VbJAzSAHQMvf5HC9zfEVMPbT2UcBvaMXb";
export default createStore({
  state: {
    ipfs: null,
    userAddress: null,
    tezosWalletInstance: null,
    tezosNetworkInstance: null,
    deployedNFT: null,
    allUserNFTs: null,
    currentNFT: null,
    currentNFTdata: null,
  },
  mutations: {
    setIpfs (state, ipfsInstance) {
      state.ipfs = ipfsInstance;
    },
    setUserAddress (state, data) {
      state.userAddress = data;
    },
    setWalletInstance (state, data) {
      state.tezosWalletInstance = data;
    },
    setTezosInstance (state, data) {
      state.tezosNetworkInstance = data;
    },
    // for single NFT pages, extra info about NFT
    setCurrentNFTdata(state, payload) {
      state.currentNFTdata = payload;
    },
    setCurrentNFT(state, payload) {
      state.currentNFT = payload;
    },
    SET_USER_NFTS(state, payload) {
      state.allUserNFTs = payload;
    },
    SET_DEPLOYED_NFT(state, payload) {
      state.deployedNFT = payload;
    },
  },
  actions: {
    async setIpfs ({commit}) {
      const ipfs = await getIPFS();
      commit("setIpfs", await ipfs.create());
    },
    // solana storage a little different with NEAR
    // data of NFT storing link to IPFS with extra data, where are METAPLEX fields stored with image
    // after loading METAPLEX data, we can get real image address
    async setTokenImage ({getters}, token) {
      console.log("setTokenImage");
      let url = token.ipfsHash;
      let data = null;

      if (getters.getIpfs) {
        data = await getImageForTokenByURI(getters.getIpfs, url);
        console.log(data, "GET DATA");
      }

      return data;
    },
    async setDeployToIPFS ({commit, getters}, meta) {
      // dispatch('setStatus', StatusType.DeployingToIPFS)
      console.log(meta, "META");
      commit("SET_DEPLOYED_NFT", await deployNFTtoIPFS(getters.getIpfs, meta));
    },
    async getUserNFTs({commit, getters}) {
      const contract = await getters.getTezosNetworkInstance.wallet.at(contractAddress);
      console.log(contract, "contract");
      const nftStorage = await contract.storage();
      console.log(nftStorage, "nftStorage");
      const getTokenIds = await nftStorage.reverse_ledger.get(getters.getUserAddress);
      let userNFTs = [];
      console.log(getTokenIds, "getTokenIds");

      if (getTokenIds) {
        userNFTs = await Promise.all([
          ...getTokenIds.map(async id => {
            const tokenId = id.toNumber();
            const metadata = await nftStorage.token_metadata.get(tokenId);
            console.log(metadata, "meta");
            const tokenInfoBytes = metadata.token_info.get("");
            const tokenInfo = bytes2Char(tokenInfoBytes);
            console.log(tokenInfo, "tokenInfo");
            return {
              tokenId,
              ipfsHash: tokenInfo,
            };
          })
        ]);
      }

      console.log(userNFTs, "userNFTs");
      commit("SET_USER_NFTS", userNFTs);
    }
  },
  getters: {
    getIpfs: state => state.ipfs,
    getUserAddress: state => state.userAddress,
    getTezosWalletInstance: state => state.tezosWalletInstance,
    getTezosNetworkInstance: state => state.tezosNetworkInstance,
    getNFTdeployResult: state => state.deployedNFT,
    getAllNFTs: state => state.allUserNFTs,
    getCurrentNFT: state => state.currentNFT,
  },
});
