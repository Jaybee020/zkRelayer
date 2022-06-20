import "@nomiclabs/hardhat-ethers";
import { ethers, waffle } from "hardhat";
import { expect } from "chai";
import { BigNumber, Contract, providers } from "ethers";

describe("Forwarder and Registry", async function () {
  let registry: Contract;
  let forwarder: Contract;
  let wallet: Contract;
  async function createForwarder(): Promise<Contract> {
    const Forwarder = await ethers.getContractFactory("Forwarder");
    const forwarder = await Forwarder.deploy();
    await forwarder.deployed();
    return forwarder;
  }

  async function createRegistry(forwarderAddr: string): Promise<Contract> {
    const Registry = await ethers.getContractFactory("Registry");
    const registry = await Registry.deploy(forwarderAddr);
    await registry.deployed();
    return registry;
  }

  async function createWallet(): Promise<Contract> {
    const Wallet = await ethers.getContractFactory("Wallet");
    const wallet = await Wallet.deploy();
    await wallet.deployed();
    return wallet;
  }

  async function checkRelayers(expected: string[]) {
    let relayerCount = await registry.getRelayerCount();
    expect(relayerCount.length).to.equal(expected.length);

    for (let i = 0; i < relayerCount; i++) {
      let relayer = await registry.getRelayerByIdx(i);
      expect(relayer).to.equal(expected[i]);
    }
  }

  beforeEach(async () => {
    forwarder = await createForwarder();
    registry = await createRegistry(forwarder.address);
    wallet = await createWallet();
  });

  it("Registry fails at setting locator for other address", async () => {
    let e;
    try {
      const accounts = await ethers.getSigners();
      await registry.setRelayerLocator(accounts[2].address, "0.0. 0.0 ");
    } catch (error) {
      e = error;
    }
  });

  it("Registry should set locator for self and update list", async () => {
    const accounts = await ethers.getSigners();
    await registry.setRelayerLocator(accounts[0].address, "0.0. 0.0");
    const locator = await registry.relayertoLocator(accounts[0].address);
    expect("0.0. 0.0").to.equal(locator);
    checkRelayers([accounts[0].address]);
  });

  it("Registry should not log relay due to incorrect forwarder contract", async () => {
    let e;
    try {
      const accounts = await ethers.getSigners();
      await registry.logRelay(accounts[0].address, 0.05e17);
    } catch (error) {
      e = error;
    }
  });

  it("Forwarder should fail due to regitry not set", async () => {
    let e;
    try {
      let abiencoded = await wallet.withdrawPayload();
      await forwarder.forwardCall(wallet.address, abiencoded);
    } catch (error) {
      e = error;
    }
  });

  describe("Forwarder with registry set", async () => {
    let prevrelayerBalance: BigNumber;
    let accounts;
    let abiencoded: any;
    beforeEach(async () => {
      accounts = await ethers.getSigners();
      await wallet.connect(accounts[1]).deposit({
        from: accounts[1].address,
        value: ethers.utils.parseEther("5"),
      });
      prevrelayerBalance = await waffle.provider.getBalance(
        accounts[0].address
      );
      await forwarder.setReputation(registry.address);
      abiencoded = await wallet.withdrawPayload();
      console.log(abiencoded);
    });
    it("should call application contract and pay relayer", async () => {
      accounts = await ethers.getSigners();
      // const walletBalance=await waffle.provider.getBalance(wallet.address)
      let txReceipt = await forwarder.forwardCall(wallet.address, abiencoded);
      let currentBalance = await waffle.provider.getBalance(
        accounts[0].address
      );
      let difference = currentBalance.sub(prevrelayerBalance).div(BigInt(1e18));
      expect(difference.toNumber()).to.be.greaterThan(0); //making sure forwarder balance is higher than initial
    });

    it("should log fee", async () => {
      accounts = await ethers.getSigners();
      let txReceipt = await forwarder.forwardCall(wallet.address, abiencoded);
      const fee = await registry.relayertoFee(accounts[0].address);
      expect(fee.count).to.equal(1);
      expect(fee.sum.div(BigInt(1e18))).to.equal(2);
    });
  });
});
