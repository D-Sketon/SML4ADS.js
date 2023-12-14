import "@hprose/rpc-node";
import { Client } from "@hprose/rpc-core";

async function criticalScenarios(
  _e: any,
  carlaPort: number,
  mapPath: string,
  modelPath: string,
  port = "20225",
  host = "127.0.0.1"
) {
  const client = new Client(`http://${host}:${port}/RPC`);
  return await client.invoke("criticalScenarios", [
    [carlaPort, mapPath, modelPath],
  ]);
}

export default criticalScenarios;
