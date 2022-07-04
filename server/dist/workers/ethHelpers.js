"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRelayerFee = exports.getWallet = exports.getProvider = void 0;
const ethers_1 = require("ethers");
const config_1 = require("../config");
function getProvider(networkUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        return new ethers_1.providers.JsonRpcProvider(networkUrl);
    });
}
exports.getProvider = getProvider;
function getWallet(networkUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = yield getProvider(networkUrl);
        return new ethers_1.Wallet(config_1.PRIVATE_KEY, provider);
    });
}
exports.getWallet = getWallet;
//gets the fee of relayer node
function getRelayerFee(networkUrl, txnData) {
    return __awaiter(this, void 0, void 0, function* () {
        const wallet = yield getWallet(config_1.MAINNET_RPC_URL);
        const provider = yield getProvider(config_1.MAINNET_RPC_URL);
        const gasPrice = yield provider.getGasPrice();
        const estimateGasUsed = yield provider.estimateGas({
            to: txnData.to,
            from: wallet.address,
            data: txnData.data,
            value: ethers_1.utils.parseEther(txnData.value),
        });
        const gasCost = gasPrice.mul(estimateGasUsed);
        const fee = gasCost.add(BigInt(config_1.MIN_TX_PROFIT));
        return fee;
    });
}
exports.getRelayerFee = getRelayerFee;
