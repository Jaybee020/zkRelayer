import * as dotenv from "dotenv";

dotenv.config();

export const PRIVATE_KEY = String(process.env.PRIVATE_KEY);
export const TESTNET_RPC_URL = String(process.env.TESTNET_RPC_URL);
export const REGISTRY_CONTRACT = String(process.env.REGISTRY_CONTRACT);
export const FORWARDER_CONTRACT = String(process.env.REGISTRY_CONTRACT);
export const MIN_TX_PROFIT = String(process.env.MIN_TX_PROFIT);
export const FEE = String(process.env.FEE);
export const ENDPOINT = String(process.env.ENDPOINT);
// const MAINNET_ALLOWED_RECIPIENTS=String(process.env.
//@ts-ignore
export const PORT = parseInt(String(process.env.PORT));
