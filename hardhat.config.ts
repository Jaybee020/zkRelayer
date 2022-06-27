import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import { PRIVATE_KEY, TESTNET_RPC_URL } from "./server/config";
module.exports = {
  solidity: "0.8.0",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    // testnet: {
    //   url: `https://api.s0.ps.hmny.io`, //link for rpcUrl of devnet
    //   accounts: [
    //     ``, //input your private key
    //   ],
    // },
  },
};
