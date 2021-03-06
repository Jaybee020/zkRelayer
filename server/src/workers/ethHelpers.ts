import { providers, Wallet, utils } from "ethers";
import { MIN_TX_PROFIT, PRIVATE_KEY, MAINNET_RPC_URL } from "../config";

export interface Txn {
  to: string;
  value: string;
  data: string;
}

export async function getProvider(networkUrl: string) {
  return new providers.JsonRpcProvider(networkUrl);
}

export async function getWallet(networkUrl: string) {
  const provider = await getProvider(networkUrl);
  return new Wallet(PRIVATE_KEY, provider);
}

//gets the fee of relayer node
export async function getRelayerFee(networkUrl: string, txnData: Txn) {
  const wallet = await getWallet(MAINNET_RPC_URL);
  const provider = await getProvider(MAINNET_RPC_URL);

  const gasPrice = await provider.getGasPrice();
  const estimateGasUsed = await provider.estimateGas({
    to: txnData.to,
    from: wallet.address,
    data: txnData.data,
    value: utils.parseEther(txnData.value),
  });

  const gasCost = gasPrice.mul(estimateGasUsed);
  const fee = gasCost.add(BigInt(MIN_TX_PROFIT));
  return fee;
}
