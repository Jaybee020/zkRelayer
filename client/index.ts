import Registry from "./Registry.json";
import { Contract, providers } from "ethers";
import axios from "axios";

const REGISTRY_CONTRACT = "0x4a0a5D875322De27e170f7c6E3678d47f711A50F"; //registry contract address

export interface Txn {
  to: string;
  value: string;
  data: string;
}

function getRelayTxRoute(locator: string) {
  return `${locator}/submitTxn`;
}

//class representing a single relayer client
export class RegistryClient {
  provider: providers.JsonRpcProvider;
  registryAddr: string;
  protocol: string;

  constructor(provider: providers.JsonRpcProvider, protocol = "https") {
    this.provider = provider;
    this.registryAddr = REGISTRY_CONTRACT;
    this.protocol = protocol;
  }

  async getRelayers(numRelayers = 1) {
    const registry = new Contract(
      REGISTRY_CONTRACT,
      Registry.abi,
      this.provider
    );

    const totalRelayers = (await registry.getRelayersCount()).toNumber(); //get relayer count
    const addresses = [];
    for (var idx = 0; idx < totalRelayers; idx++) {
      const relayerAddr: string = await registry.getRelayerByIdx(idx);
      addresses.push(relayerAddr);
    }

    // No registered relayers in the registry contract!
    if (addresses.length === 0) {
      return [];
    }

    //not enough registered relayers in contract
    if (addresses.length < numRelayers) {
      return addresses;
    }
    return addresses.slice(0, numRelayers);
  }

  async getRelayerLocator(relayerAddr: string) {
    const registry = new Contract(
      REGISTRY_CONTRACT,
      Registry.abi,
      this.provider
    );
    const locator = await registry.relayertoLocator(relayerAddr);
    return locator;
  }

  //get average fee
  async getRelayerFee(relayerAddr: string) {
    const registry = new Contract(
      REGISTRY_CONTRACT,
      Registry.abi,
      this.provider
    );

    const { sum, count } = await registry.relayertoFee(relayerAddr);
    return { sum, count };
  }

  async submitTx(relayerLocator: string, txnData: Txn) {
    const resp = await axios.post(
      `${this.protocol}://${getRelayTxRoute(relayerLocator)}`,
      {
        to: txnData.to,
        value: txnData.value,
        data: txnData.data,
      }
    );

    if (resp.status !== 200) {
      console.log(` error submitting tx to relayer ${relayerLocator}`);
    }

    return resp.data;
  }
}
