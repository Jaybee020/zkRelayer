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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forwardCall = exports.setRegisteryLocator = void 0;
const Registry_json_1 = __importDefault(require("../../Registry.json"));
const Forwarder_json_1 = __importDefault(require("../../Forwarder.json"));
const ethers_1 = require("ethers");
const ethHelpers_1 = require("./ethHelpers");
const config_1 = require("../config");
function getRegistry() {
    return __awaiter(this, void 0, void 0, function* () {
        const wallet = yield (0, ethHelpers_1.getWallet)(config_1.TESTNET_RPC_URL);
        const registery = yield new ethers_1.Contract(config_1.REGISTRY_CONTRACT, Registry_json_1.default.abi, wallet);
        return registery;
    });
}
function getForwarder() {
    return __awaiter(this, void 0, void 0, function* () {
        const wallet = yield (0, ethHelpers_1.getWallet)(config_1.TESTNET_RPC_URL);
        const forwarder = yield new ethers_1.Contract(config_1.FORWARDER_CONTRACT, Forwarder_json_1.default.abi, wallet);
        return forwarder;
    });
}
function setRegisteryLocator(domain) {
    return __awaiter(this, void 0, void 0, function* () {
        let registry = yield getRegistry();
        const wallet = yield (0, ethHelpers_1.getWallet)(config_1.TESTNET_RPC_URL);
        yield registry.setRelayerLocator(wallet.address, domain);
        return registry;
    });
}
exports.setRegisteryLocator = setRegisteryLocator;
function forwardCall(contractAddr, callData, value) {
    return __awaiter(this, void 0, void 0, function* () {
        let forwarder = yield getForwarder();
        const txReceipt = yield forwarder.forwardCall(contractAddr, callData, {
            value: value,
            gasLimit: 1500000,
        });
        return txReceipt.hash;
    });
}
exports.forwardCall = forwardCall;
