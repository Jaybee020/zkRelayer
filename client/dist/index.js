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
exports.RegistryClient = void 0;
const Registry_json_1 = __importDefault(require("./Registry.json"));
const ethers_1 = require("ethers");
const axios_1 = __importDefault(require("axios"));
const REGISTRY_CONTRACT = "0x4a0a5D875322De27e170f7c6E3678d47f711A50F"; //registry contract address
function getRelayTxRoute(locator) {
    return `${locator}/submitTxn`;
}
//class representing a single relayer client
class RegistryClient {
    constructor(provider, protocol = "https") {
        this.provider = provider;
        this.registryAddr = REGISTRY_CONTRACT;
        this.protocol = protocol;
    }
    getRelayers(numRelayers = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            const registry = new ethers_1.Contract(REGISTRY_CONTRACT, Registry_json_1.default.abi, this.provider);
            const totalRelayers = (yield registry.getRelayersCount()).toNumber(); //get relayer count
            const addresses = [];
            for (var idx = 0; idx < totalRelayers; idx++) {
                const relayerAddr = yield registry.getRelayerByIdx(idx);
                addresses.push(relayerAddr);
            }
            // No registered relayers in the registry contract!
            if (addresses.length === 0) {
                return [];
            }
            //not enough registered relayers in contract
            if (addresses.length < numRelayers) {
                return addresses;
            }
            return addresses.slice(0, numRelayers);
        });
    }
    getRelayerLocator(relayerAddr) {
        return __awaiter(this, void 0, void 0, function* () {
            const registry = new ethers_1.Contract(REGISTRY_CONTRACT, Registry_json_1.default.abi, this.provider);
            const locator = yield registry.relayertoLocator(relayerAddr);
            return locator;
        });
    }
    //get average fee
    getRelayerFee(relayerAddr) {
        return __awaiter(this, void 0, void 0, function* () {
            const registry = new ethers_1.Contract(REGISTRY_CONTRACT, Registry_json_1.default.abi, this.provider);
            const { sum, count } = yield registry.relayertoFee(relayerAddr);
            return { sum, count };
        });
    }
    submitTx(relayerLocator, txnData) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield axios_1.default.post(`${this.protocol}://${getRelayTxRoute(relayerLocator)}`, {
                to: txnData.to,
                value: txnData.value,
                data: txnData.data,
            });
            if (resp.status !== 200) {
                console.log(` error submitting tx to relayer ${relayerLocator}`);
            }
            return resp.data;
        });
    }
}
exports.RegistryClient = RegistryClient;
