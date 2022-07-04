import express from "express";
import { json, urlencoded } from "body-parser";
import cors from "cors";
import AsyncLock from "async-lock";
import {
  ENDPOINT,
  FEE,
  MAINNET_DISALLOWED_RECIPIENTS,
  MIN_TX_PROFIT,
  PORT,
  TESTNET_RPC_URL,
} from "./config";
import { forwardCall, setRegisteryLocator } from "./workers/relayer";
import { getRelayerFee, getWallet } from "./workers/ethHelpers";
import { simulateTxn } from "./workers/simulatetx";
import { utils } from "ethers";

const app = express();
const lock = new AsyncLock();

const nonceKey = `nonce`;

app.use(cors());
app.use(json());

//get fee fof relayer
app.get("/fee", async function (req, res) {
  res.status(200).send({
    fee: FEE,
  });
});

app.post("/submitTxn", async function (req, res) {
  try {
    //validate request
    const contractAddr = String(req.body.to);
    const callData = String(req.body.data);
    const value = String(req.body.value);
    console.log(
      `Relaying transaction request 
      to: ${contractAddr} , 
      value:${value}, 
      data: ${callData}`
    );
    if (MAINNET_DISALLOWED_RECIPIENTS.includes(contractAddr)) {
      res.status(403).send({
        msg: "Can't relay transaction to " + contractAddr,
      });
    }

    // TODO;simulate transaction and get profit
    const { success, profit } = await simulateTxn({
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
    if (
      Number(MIN_TX_PROFIT) &&
      Number(utils.formatEther(profit)) < Number(MIN_TX_PROFIT)
    ) {
      console.log(
        "Refusing to relay transaction.Doesn't meet profit requirements"
      );
      return res.status(400).send({
        msg: `Fee too low for relayer.Please increase fee by ${
          Number(MIN_TX_PROFIT) - Number(utils.formatEther(profit))
        }`,
      });
    }

    //relay transaction
    const hash = await lock.acquire(nonceKey, async () => {
      return await forwardCall(contractAddr, callData, value);
    });

    console.log("Successfully relayed transaction with hash " + hash);

    return res.status(200).send({
      msg: hash,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      msg: "An error occured relaying transaction",
    });
  }
});

app.listen(PORT || 3000, async () => {
  console.log("Server started on port " + PORT);
});
