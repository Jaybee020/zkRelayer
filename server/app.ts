import express from "express";
import { json, urlencoded } from "body-parser";
import cors from "cors";

const app = express();

app.use(cors());
app.use(json());

app.get("/address", async function (req, res) {});

//get fee fof relayer
app.get("/fee", async function (req, res) {
  res.status(200).send({
    fee: "fee",
  });
});

//validate req.body
app.post("/submitTxn", async function (req, res) {});
