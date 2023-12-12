import "@hprose/rpc-node";
import { Client } from "@hprose/rpc-core";

async function adversarialAttack(
  _e: any,
  csvPath: string,
  rnnPath: string,
  pklPath: string,
  weightPath: string,
  port = "20225",
  host = "127.0.0.1"
) {
  try {
    const client = new Client(`http://${host}:${port}/RPC`);
    return await client.invoke("adversarialAttack", [
      [csvPath, rnnPath, pklPath, weightPath],
    ]);
  } catch (error: any) {
    console.error(error);
    _e?.sender.send("ui:onOpenNotification", "error", "Error", error.message);
  }
}

export default adversarialAttack;
