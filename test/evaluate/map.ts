describe("Map", () => {
  const chai = require("chai");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const should = chai.should();

  const evaluateMap =
    require("../../electron-dist/electron-node/evaluate/map").evaluateMap;

  it("default map", async () => {

    console.log(await evaluateMap(null, 'electron-python/simulate/carla_simulator/Carla/Maps/Town05.xodr'));
  });
});
