## Client

This is a light weight js module to help integrate your apps with the relayer system.

NOTE:For Harmony devnet install version 1.0.6,while for Harmony Mainnet install latest verion(1.0.7)

### Get Relayer(s) Data

```js
export async function getRelayers(n = 1) {
  const provider = await getProvider("https://api.s0.ps.hmny.io");
  const client = new RegistryClient(provider);
  const relayersAddrs = await client.getRelayers(n);
  const relayersData = Promise.all(
    relayersAddrs.map(async (relayerAddr) => {
      const { count, sum } = await client.getRelayerFee(relayerAddr);
      const locator = await client.getRelayerLocator(relayerAddr);
      return {
        addr: relayerAddr,
        count: count.toNumber(),
        sum: sum.toNumber(),
        locator: locator,
      };
    })
  );
  return relayersData;
}
```

### To submit a transaction using a relayer locator

```js
export async function submitTx(relayerLocator, txn) {
  const provider = await getProvider("https://api.s0.ps.hmny.io");
  const client = new RegistryClient(provider);
  const result = await client.submitTx(relayerLocator, txn);
  return result;
}
```
