import "@hprose/rpc-node";
import { Client } from "@hprose/rpc-core";

async function simulate(
  _e: any,
  params: any,
  port: number,
  host = "127.0.0.1"
) {
  const client = new Client(`http://${host}:${port}/RPC`);
  client.timeout = 180000;
  return await client.invoke("simulate", [params]);
}

export default simulate;
