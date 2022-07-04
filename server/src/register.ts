import { ethers } from "ethers";
import { setRegisteryLocator } from "./workers/relayer";
import { ENDPOINT, MAINNET_RPC_URL } from "./config";
(async function run() {
  const registry = await setRegisteryLocator(ENDPOINT); //input a domain name where users can communicate with this server
  registry.on("RelayerLocatorSet", function (_relayer: string) {
    console.log("Locator for " + _relayer + " set");
  });
})();
