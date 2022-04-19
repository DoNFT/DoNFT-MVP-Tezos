import * as dotenv from "dotenv";
import { TezosToolkit } from "@taquito/taquito";
import { InMemorySigner } from "@taquito/signer";

console.log(dotenv, '----------dotenv----------')

const TEZOS_RPC_URL='https://hangzhounet.smartpy.io/'
const DEPLOYER_PRIVATE_KEY='edskRxyMAF9gvR21Eiu4qU5sBgWeycuYmwjDcHAZ8dqsSsDRgfTiL9LKNjyRAt6TeKqf1WpmzhXQeYGWQgYsDui8Ar1bgojaGs'


const deploy = async () => {
  dotenv.config({path: '../.env'}); /* This loads the variables in your .env file to process.env */
  console.log(TEZOS_RPC_URL, DEPLOYER_PRIVATE_KEY, '----------ENV----------')

  const signer = await InMemorySigner.fromSecretKey(DEPLOYER_PRIVATE_KEY);
  const Tezos = new TezosToolkit(TEZOS_RPC_URL);
  Tezos.setProvider({ signer: signer });

  try {
    const { hash, contractAddress } = await Tezos.contract.originate({
      code: require("../build/counter.json"),
      init: require("../build/counter_storage.json"),
    });

    console.log("Successfully deployed contract");
    console.log(`>> Transaction hash: ${hash}`);
    console.log(`>> Contract address: ${contractAddress}`);
  } catch (error) {
    console.log(error);
  }
};

deploy();