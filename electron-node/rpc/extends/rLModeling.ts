import "@hprose/rpc-node";
import { Client } from "@hprose/rpc-core";

async function rLModeling(
  _e: any,
  csvPath: string,
  port = "20225",
  host = "127.0.0.1"
) {
  try {
    const client = new Client(`http://${host}:${port}/RPC`);
    return await client.invoke("rLModeling", [[csvPath]]);
  } catch (error: any) {
    console.error(error);
    _e?.sender.send("ui:onOpenNotification", "error", "Error", error.message);
  }
}

export default rLModeling;
