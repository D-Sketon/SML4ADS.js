import "@hprose/rpc-node";
import { Client } from "@hprose/rpc-core";

async function simulate(
  _e: any,
  params: any,
  port: number,
  host = "127.0.0.1"
) {
  try {
    const client = new Client(`http://${host}:${port}/RPC`);
    client.keepAlive = false;
    await client.invoke("run", [params]);
  } catch (error: any) {
    console.error(error);
    _e?.sender.send("ui:onOpenNotification", "error", "Error", error.message);
  }
}

export default simulate;
