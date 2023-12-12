import "@hprose/rpc-node";
import { Client } from "@hprose/rpc-core";

async function causalInference(
  _e: any,
  csvPath: string,
  params: Record<string, any>,
  port = "20225",
  host = "127.0.0.1"
) {
  try {
    const client = new Client(`http://${host}:${port}/RPC`);
    return await client.invoke("causalInference", [[csvPath, params]]);
  } catch (error: any) {
    console.error(error);
    _e?.sender.send("ui:onOpenNotification", "error", "Error", error.message);
  }
}

export default causalInference;
