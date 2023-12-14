import "@hprose/rpc-node";
import { Client } from "@hprose/rpc-core";

async function rLModeling(
  _e: any,
  csvPath: string,
  port = "20225",
  host = "127.0.0.1"
) {
  const client = new Client(`http://${host}:${port}/RPC`);
  return await client.invoke("rLModeling", [[csvPath]]);
}

export default rLModeling;
