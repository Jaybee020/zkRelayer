//simulate transaction
import { providers, Signer, utils } from "ethers";
import { provider } from "ganache";
import { TESTNET_RPC_URL } from "../config";
import { getWallet, Txn } from "./ethHelpers";

function createForkedWeb3() {
  //@ts-ignore
  return new providers.Web3Provider(provider({ fork: TESTNET_RPC_URL }));
}

async function signTxn(
  forkedWeb3: providers.Web3Provider,
  tx: Txn,
  signer: Signer
) {
  const signedtxn = await signer.signTransaction(tx);
  return signedtxn;
}

async function buildTxn(txn: Txn, forkedWeb3: providers.Web3Provider) {
  const blockNumber = await forkedWeb3.getBlockNumber();
  const block = await forkedWeb3.getBlock(blockNumber);
  const feeData = await forkedWeb3.getFeeData();
  return {
    ...txn,
    value: utils.parseEther(txn.value),
    gasLimit: block.gasLimit,
    gasPrice: 23610503242,
  };
}

export async function simulateTxn(txn: Txn) {
  const forkedWeb3 = createForkedWeb3();
  const wallet = await getWallet(TESTNET_RPC_URL);
  const tx = await buildTxn(txn, forkedWeb3);
  //@ts-ignore
  const signedTxn = await signTxn(forkedWeb3, tx, wallet);

  const initialBalance = await forkedWeb3.getBalance(wallet.address);
  await forkedWeb3.sendTransaction(signedTxn);
  const finalBalnce = await forkedWeb3.getBalance(wallet.address);
  const profit = finalBalnce.sub(initialBalance);
  return profit;
}
