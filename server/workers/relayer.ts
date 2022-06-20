import Registry from "../Registry.json";
import Forwarder from "../Forwarder.json";
import { Contract } from "ethers";
import { getProvider, getWallet } from "./ethHelpers";
import {
  FORWARDER_CONTRACT,
  REGISTRY_CONTRACT,
  TESTNET_RPC_URL,
} from "../config";

async function getRegistry() {
  const registery = await new Contract(REGISTRY_CONTRACT, Registry.abi);
  return registery;
}

async function setRegistery() {
  let registry = await getRegistry();
  const wallet = await getWallet(TESTNET_RPC_URL);
  registry = registry.connect(wallet);
  await registry.setRelayerLocator(wallet.address);
}

async function getFeeData(relayerAddr: string) {
  let registry = await getRegistry();
  const provider = await getProvider(TESTNET_RPC_URL);
  registry = registry.connect(provider);
  const wallet = await getWallet(TESTNET_RPC_URL);
  const feeData = registry.relayertoFee(wallet.address);
  return feeData;
}

async function getForwarder() {
  const forwarder = await new Contract(FORWARDER_CONTRACT, Forwarder.abi);
  return forwarder;
}

async function forwardCall(contractAddr: string, callData: string) {
  let forwarder = await getForwarder();
  const wallet = await getWallet(TESTNET_RPC_URL);
  await forwarder.forwardCall(contractAddr, callData);
  return true;
}
