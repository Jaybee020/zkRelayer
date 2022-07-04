import Registry from "../../Registry.json";
import Forwarder from "../../Forwarder.json";
import { Contract, ethers } from "ethers";
import { getProvider, getWallet } from "./ethHelpers";
import {
  FORWARDER_CONTRACT,
  REGISTRY_CONTRACT,
  TESTNET_RPC_URL,
} from "../config";

async function getRegistry() {
  const wallet = await getWallet(TESTNET_RPC_URL);
  const registery = await new Contract(REGISTRY_CONTRACT, Registry.abi, wallet);
  return registery;
}

async function getForwarder() {
  const wallet = await getWallet(TESTNET_RPC_URL);
  const forwarder = await new Contract(
    FORWARDER_CONTRACT,
    Forwarder.abi,
    wallet
  );
  return forwarder;
}

export async function setRegisteryLocator(domain: string) {
  let registry = await getRegistry();
  const wallet = await getWallet(TESTNET_RPC_URL);
  await registry.setRelayerLocator(wallet.address, domain);
  return registry;
}

export async function forwardCall(
  contractAddr: string,
  callData: string,
  value: string
) {
  let forwarder = await getForwarder();
  const txReceipt = await forwarder.forwardCall(contractAddr, callData, {
    value: value,
    gasLimit: 1500000,
  });
  return txReceipt.hash;
}
