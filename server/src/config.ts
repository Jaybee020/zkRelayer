import * as dotenv from "dotenv";

dotenv.config();

export const PRIVATE_KEY = `${String(process.env.PRIVATE_KEY)}`;
export const TESTNET_RPC_URL = String(process.env.TESTNET_RPC_URL);
export const REGISTRY_CONTRACT = "0x4a0a5D875322De27e170f7c6E3678d47f711A50F";
export const FORWARDER_CONTRACT = "0xF2E505107bbD79D9eb0C4EF475623A71BcDF6DE1";
export const MIN_TX_PROFIT = String(process.env.MIN_TX_PROFIT);
export const FEE = String(process.env.FEE);
export const ENDPOINT = "relayer-server.herokuapp.com";
export const MAINNET_DISALLOWED_RECIPIENTS = [""]; //Array of contract addresses not to relay to
export const PORT = parseInt(String(process.env.PORT));
