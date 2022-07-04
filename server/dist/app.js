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
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const cors_1 = __importDefault(require("cors"));
const async_lock_1 = __importDefault(require("async-lock"));
const config_1 = require("./config");
const relayer_1 = require("./workers/relayer");
const simulatetx_1 = require("./workers/simulatetx");
const ethers_1 = require("ethers");
const app = (0, express_1.default)();
const lock = new async_lock_1.default();
const nonceKey = `nonce`;
app.use((0, cors_1.default)());
app.use((0, body_parser_1.json)());
//get fee fof relayer
app.get("/fee", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.status(200).send({
            fee: config_1.FEE,
        });
    });
});
app.post("/submitTxn", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //validate request
            const contractAddr = String(req.body.to);
            const callData = String(req.body.data);
            const value = String(req.body.value);
            console.log(`Relaying transaction request 
      to: ${contractAddr} , 
      value:${value}, 
      data: ${callData}`);
            if (config_1.MAINNET_DISALLOWED_RECIPIENTS.includes(contractAddr)) {
                res.status(403).send({
                    msg: "Can't relay transaction to" + contractAddr,
                });
            }
            // TODO;simulate transaction and get profit
            const { success, profit } = yield (0, simulatetx_1.simulateTxn)({
                to: contractAddr,
                value: value,
                data: callData,
            });
            //check if relay can be successfully completed
            if (!success) {
                console.log("Could not recreate transaction locally." + profit);
                return res.status(400).send({
                    msg: "Could not recreate transaction locally." + profit,
                });
            }
            //check if profit is greater than minimum profit
            if (Number(config_1.MIN_TX_PROFIT) &&
                Number(ethers_1.utils.formatEther(profit)) < Number(config_1.MIN_TX_PROFIT)) {
                console.log("Refusing to relay transaction.Doesn't meet profit requirements");
                return res.status(400).send({
                    msg: `Fee too low for relayer.Please increase fee by ${Number(config_1.MIN_TX_PROFIT) - Number(ethers_1.utils.formatEther(profit))}`,
                });
            }
            //relay transaction
            const hash = yield lock.acquire(nonceKey, () => __awaiter(this, void 0, void 0, function* () {
                return yield (0, relayer_1.forwardCall)(contractAddr, callData, value);
            }));
            console.log("Successfully relayed transaction with hash " + hash);
            return res.status(200).send({
                msg: hash,
            });
        }
        catch (error) {
            console.log(error);
            res.status(400).send({
                msg: "An error occured relaying transaction",
            });
        }
    });
});
app.listen(config_1.PORT || 3000, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Server started on port " + config_1.PORT);
}));
