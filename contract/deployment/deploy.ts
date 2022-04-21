import { TezosToolkit } from "@taquito/taquito";
import { InMemorySigner } from "@taquito/signer";


const TEZOS_RPC_URL='https://hangzhounet.smartpy.io'
const DEPLOYER_PRIVATE_KEY='edskRxyMAF9gvR21Eiu4qU5sBgWeycuYmwjDcHAZ8dqsSsDRgfTiL9LKNjyRAt6TeKqf1WpmzhXQeYGWQgYsDui8Ar1bgojaGs'


const deploy = async () => {
  console.log(TEZOS_RPC_URL, DEPLOYER_PRIVATE_KEY, '----------ENV----------')

  const signer = await InMemorySigner.fromSecretKey(DEPLOYER_PRIVATE_KEY);
  const Tezos = new TezosToolkit(TEZOS_RPC_URL);
  Tezos.setProvider({ signer: signer });

  try {
    const { hash, contractAddress } = await Tezos.contract.originate({
      code: require("../build/fa2_nft_tokens.json"),
      init: require("../build/fa2_nft_tokens_storage.json"),
    });

    console.log("Successfully deployed contract");
    console.log(`>> Transaction hash: ${hash}`);
    console.log(`>> Contract address: ${contractAddress}`);
  } catch (error) {
    console.log(error);
  }
};

deploy();