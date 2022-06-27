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
      `Relaying transaction request to: ${contractAddr} , value:${value} data: ${callData}`
    );
    if (MAINNET_DISALLOWED_RECIPIENTS.includes(contractAddr)) {
      res.status(403).send({
        msg: "Can't relay transaction to" + contractAddr,
      });
    }

    // TODO;simulate transaction and get profit
    const profit = await simulateTxn({
      to: contractAddr,
      value: value,
      data: callData,
    });

    // console.log(profit);

    //check if profit is greater than minimum profit
    if (parseInt(MIN_TX_PROFIT) && profit < utils.parseEther(MIN_TX_PROFIT)) {
      return res.status(400).send({
        msg: `Fee too low.Please increase fee by ${utils
          .parseEther(MIN_TX_PROFIT)
          .sub(profit)
          .toNumber()}`,
      });
    }

    //relay transaction
    const hash = await lock.acquire(nonceKey, async () => {
      return await forwardCall(contractAddr, callData, value);
    });

    res.status(200).send({
      receiptHash: hash,
    });

    console.log("Successfully relayed transaction with hash" + hash);
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
