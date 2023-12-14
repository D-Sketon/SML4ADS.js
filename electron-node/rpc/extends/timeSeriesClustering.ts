import "@hprose/rpc-node";
import { Client } from "@hprose/rpc-core";

async function timeSeriesClustering(
  _e: any,
  npyPath: string,
  k: number,
  port = "20225",
  host = "127.0.0.1"
) {
  const client = new Client(`http://${host}:${port}/RPC`);
  return await client.invoke("timeSeriesClustering", [[npyPath, k]]);
}

export default timeSeriesClustering;
