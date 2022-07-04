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
exports.simulateTxn = void 0;
//simulate transaction
const ethers_1 = require("ethers");
const ganache_1 = require("ganache");
const config_1 = require("../config");
const ethHelpers_1 = require("./ethHelpers");
function createForkedWeb3() {
    //@ts-ignore
    return new ethers_1.providers.Web3Provider((0, ganache_1.provider)({ fork: config_1.MAINNET_RPC_URL }));
}
function signTxn(forkedWeb3, tx, signer) {
    return __awaiter(this, void 0, void 0, function* () {
        const signedtxn = yield signer.signTransaction(tx);
        return signedtxn;
    });
}
function buildTxn(txn, forkedWeb3) {
    return __awaiter(this, void 0, void 0, function* () {
        const blockNumber = yield forkedWeb3.getBlockNumber();
        const block = yield forkedWeb3.getBlock(blockNumber);
        const feeData = yield forkedWeb3.getFeeData();
        return Object.assign(Object.assign({}, txn), { value: ethers_1.utils.parseEther(txn.value), gasLimit: block.gasLimit, gasPrice: 23610503242 });
    });
}
function simulateTxn(txn) {
    return __awaiter(this, void 0, void 0, function* () {
        const forkedWeb3 = createForkedWeb3();
        const wallet = yield (0, ethHelpers_1.getWallet)(config_1.MAINNET_RPC_URL);
        const tx = yield buildTxn(txn, forkedWeb3);
        //@ts-ignore
        const signedTxn = yield signTxn(forkedWeb3, tx, wallet);
        const initialBalance = yield forkedWeb3.getBalance(wallet.address);
        const sentTx = yield forkedWeb3.sendTransaction(signedTxn);
        try {
            yield sentTx.wait();
            const finalBalnce = yield forkedWeb3.getBalance(wallet.address);
            const profit = finalBalnce.sub(initialBalance);
            return { success: true, profit: profit };
        }
        catch (error) {
            return { success: false, profit: error.reason };
        }
    });
}
exports.simulateTxn = simulateTxn;
