describe("Participant", () => {
  const chai = require("chai");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const should = chai.should();

  const evaluateCar =
    require("../../electron-dist/electron-node/evaluate/participant").evaluateCar;
  const evaluatePedestrian =
    require("../../electron-dist/electron-node/evaluate/participant").evaluatePedestrian;

  it("default car", () => {
    const car = {
      maxSpeed: 10,
      minSpeed: 0,
      locationParams: {
        roadId: 0,
        laneId: 0,
        lateralOffset: [0, 20],
        longitudinalOffset: [30, 40],
      },
    };
    console.log(evaluateCar(null, [car]));
  });

  it("default pedestrian", () => {
    const pedestrian = {
      location: [
        {
          locationParams: {
            roadId: 0,
            laneId: 0,
            lateralOffset: [0, 25],
            longitudinalOffset: [30, 40],
          },
        },
        {
          roadId: 0,
          laneId: 0,
          lateralOffset: [40, 55],
          longitudinalOffset: [70, 90],
        },
      ],
    };
    console.log(evaluatePedestrian(null, [pedestrian]));
  });
});
