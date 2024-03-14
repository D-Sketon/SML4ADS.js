import "@hprose/rpc-node";
import { Client } from "@hprose/rpc-core";

async function extendRPC(
  _e: any,
  funcName: string,
  host: string,
  port: string | number,
  ...args: any[]
) {
  const client = new Client(`http://${host}:${port}/RPC`);
  return await client.invoke(funcName, [args]);
}

export default extendRPC;
