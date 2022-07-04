"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PORT = exports.MAINNET_DISALLOWED_RECIPIENTS = exports.ENDPOINT = exports.FEE = exports.MIN_TX_PROFIT = exports.FORWARDER_CONTRACT = exports.REGISTRY_CONTRACT = exports.MAINNET_RPC_URL = exports.PRIVATE_KEY = void 0;
const dotenv = __importStar(require("dotenv"));
dotenv.config();
exports.PRIVATE_KEY = `${String(process.env.PRIVATE_KEY)}`;
exports.MAINNET_RPC_URL = String(process.env.MAINNET_RPC_URL);
exports.REGISTRY_CONTRACT = "0x4a0a5D875322De27e170f7c6E3678d47f711A50F";
exports.FORWARDER_CONTRACT = "0xF2E505107bbD79D9eb0C4EF475623A71BcDF6DE1";
exports.MIN_TX_PROFIT = String(process.env.MIN_TX_PROFIT);
exports.FEE = String(process.env.FEE);
exports.ENDPOINT = "relayer-server.herokuapp.com";
exports.MAINNET_DISALLOWED_RECIPIENTS = [""]; //Array of contract addresses not to relay to
exports.PORT = parseInt(String(process.env.PORT));
