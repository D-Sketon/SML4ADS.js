import "@hprose/rpc-node";
import { Client } from "@hprose/rpc-core";

async function onlineMonitor(
  _e: any,
  signalPath: string,
  stlData: string,
  isBase64: boolean,
  port = "20225",
  host = "127.0.0.1"
) {
  const client = new Client(`http://${host}:${port}/RPC`);
  return await client.invoke("onlineMonitor", [
    [signalPath, stlData, isBase64],
  ]);
}

export default onlineMonitor;
