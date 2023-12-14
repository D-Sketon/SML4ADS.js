import "@hprose/rpc-node";
import { Client } from "@hprose/rpc-core";

async function simulationTest(
  _e: any,
  csvPath: string,
  scenario: string,
  metrics: string[],
  port = "20225",
  host = "127.0.0.1"
) {
  const client = new Client(`http://${host}:${port}/RPC`);
  return await client.invoke("simulationTest", [[csvPath, scenario, metrics]]);
}
export default simulationTest;
