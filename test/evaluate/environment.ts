describe("Environment", () => {
  const chai = require("chai");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const should = chai.should();

  const evaluateEnvironment =
    require("../../electron-dist/electron-node/evaluate/environment").evaluateEnvironment;

  it("default environment", () => {
    const env = {
      atmospherePressure: [101325, 101325],
      temperature: [-30, 25],
      visibility: [1000, 1000],
      sunProperty: {
        sunAzimuth: [180, 180],
        sunElevation: [45, 45],
      },
      illumination: {
        lightingIntensity: [10000, 1000],
      },
      weather: {
        cloud: {
          cloudinessLevel: [0, 5],
        },
        snowfall: {
          snowfallIntensity: [0, 5],
        },
        rainfall: {
          precipitationIntensity: [0, 2],
        },
        wind: {
          windDirection: "N",
          windSpeed: [0, 0],
        },
      },
    };

    console.log(evaluateEnvironment(null, env));
  });
});
