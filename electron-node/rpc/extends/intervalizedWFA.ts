import "@hprose/rpc-node";
import { Client } from "@hprose/rpc-core";

async function intervalizedWFA(
  _e: any,
  csvPath: string,
  rnnPath: string,
  pklPath: string,
  port = "20225",
  host = "127.0.0.1"
) {
  const client = new Client(`http://${host}:${port}/RPC`);
  return await client.invoke("intervalizedWFA", [[csvPath, rnnPath, pklPath]]);
}

export default intervalizedWFA;
