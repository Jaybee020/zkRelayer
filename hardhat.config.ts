import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
module.exports = {
  solidity: "0.8.0",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    // mainnet: {
    //   url: "https://api.harmony.one", //url link for mainnet
    //   accounts: [`YOUR PRIVATE KEY`],
    // },
    testnet: {
      url: `https://api.s0.ps.hmny.io`, //link for rpcUrl of devnet
      accounts: [
        ``, //input your private key
      ],
    },
  },
};
