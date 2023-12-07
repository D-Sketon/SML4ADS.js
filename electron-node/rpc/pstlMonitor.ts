import "@hprose/rpc-node";
import { Client } from "@hprose/rpc-core";

async function pstlMonitor(
  _e: any,
  signalPath: string,
  stlData: string,
  isBase64: boolean,
  port = "20225",
  host = "127.0.0.1"
) {
  try {
    const client = new Client(`http://${host}:${port}/RPC`);
    return await client.invoke("pstl", [[signalPath, stlData, isBase64]]);
  } catch (error: any) {
    console.error(error);
    _e?.sender.send("ui:onOpenNotification", "error", "Error", error.message);
  }
}

export default pstlMonitor;
