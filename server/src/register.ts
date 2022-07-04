import { ethers } from "ethers";
import { setRegisteryLocator } from "./workers/relayer";
import { ENDPOINT } from "./config";
(async function run() {
  const registry = await setRegisteryLocator(ENDPOINT); //input a domain name where users can communicate with this server
  registry.on("RelayerLocatorSet", function (_relayer) {
    console.log("Locator for " + _relayer + " set");
  });
})();
