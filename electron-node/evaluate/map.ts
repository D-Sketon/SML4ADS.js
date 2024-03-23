import fs from "fs";
import { XMLParser } from "fast-xml-parser";

export const evaluateMap = async (_e: any, path: string) => {
  const content = fs.readFileSync(path, "utf-8");
  const [roadArray, junctionArray, controllerArray] = _parseXODR(content);
  let sum = 0;
  sum += roadArray.length;
  sum += controllerArray.length * 1.5;
  junctionArray.forEach((junction) => {
    let connections = junction.connection;
    if (!Array.isArray(connections)) connections = [connections];
    sum += 2 * connections.length;
  });
  return sum;
};

const _parseXODR = (input: string) => {
  const parser = new XMLParser({
    attributeNamePrefix: "@_",
    textNodeName: "#text",
    ignoreAttributes: false,
    parseAttributeValue: true,
    allowBooleanAttributes: true,
  });
  const xodrObj = parser.parse(input);
  const openDriveObj = xodrObj.OpenDRIVE;
  const roadArray = openDriveObj.road
    ? Array.isArray(openDriveObj.road)
      ? openDriveObj.road
      : [openDriveObj.road]
    : [];
  const junctionArray = openDriveObj.junction
    ? Array.isArray(openDriveObj.junction)
      ? openDriveObj.junction
      : [openDriveObj.junction]
    : [];
  const controllerArray = openDriveObj.controller
    ? Array.isArray(openDriveObj.controller)
      ? openDriveObj.controller
      : [openDriveObj.controller]
    : [];

  return [roadArray, junctionArray, controllerArray];
};
