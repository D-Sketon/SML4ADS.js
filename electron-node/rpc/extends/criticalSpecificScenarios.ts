import "@hprose/rpc-node";
import { Client } from "@hprose/rpc-core";

async function criticalSpecificScenarios(
  _e: any,
  carlaPort: number,
  modelPath: string,
  outputPath: string,
  port = "20225",
  host = "127.0.0.1"
) {
  const client = new Client(`http://${host}:${port}/RPC`);
  return await client.invoke("criticalSpecificScenarios", [
    [carlaPort, modelPath, outputPath],
  ]);
}

export default criticalSpecificScenarios;
