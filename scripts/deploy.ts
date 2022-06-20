import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import { ethers } from "hardhat";

async function deployForwarder() {
  const contract = await ethers.getContractFactory("Forwarder");
  const forwarder = await contract.deploy();
  await forwarder.deployed();
  return forwarder;
}

async function deployRegistry(forwarderAddr: string) {
  const contract = await ethers.getContractFactory("Registry");
  const registry = await contract.deploy(forwarderAddr);
  await registry.deployed();
  return registry;
}

(async function main() {
  const forwarder = await deployForwarder();
  const register = await deployRegistry(forwarder.address);
  await forwarder.setReputation();
})();
