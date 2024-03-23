import { Environment } from "../../src/model/Environment";

export const evaluateEnvironment = (_e: any, environment: Environment) => {
  let sum = 0;
  if (environment.atmospherePressure) {
    const atmospherePressureDiff =
      environment.atmospherePressure[1] - environment.atmospherePressure[0];
    sum += atmospherePressureDiff / 101325 + 1;
  }
  if (environment.temperature) {
    const temperatureDiff =
      environment.temperature[1] - environment.temperature[0];
    sum += temperatureDiff / 25 + 1;
  }
  if (environment.visibility) {
    const visibilityDiff =
      environment.visibility[1] - environment.visibility[0];
    sum += (3 * visibilityDiff) / 1000 + 1;
  }
  if (environment.sunProperty) {
    if (environment.sunProperty.sunAzimuth) {
      const sunAzimuthDiff =
        environment.sunProperty.sunAzimuth[1] -
        environment.sunProperty.sunAzimuth[0];
      sum += sunAzimuthDiff / 180 + 1;
    }
    if (environment.sunProperty.sunElevation) {
      const sunElevationDiff =
        environment.sunProperty.sunElevation[1] -
        environment.sunProperty.sunElevation[0];
      sum += sunElevationDiff / 45 + 1;
    }
  }
  if (environment.weather) {
    if (environment.weather.cloud) {
      if (environment.weather.cloud.cloudinessLevel) {
        const cloudinessLevelDiff =
          environment.weather.cloud.cloudinessLevel[1] -
          environment.weather.cloud.cloudinessLevel[0];
        sum += cloudinessLevelDiff / 4 + 1;
      }
    }
    if (environment.weather.snowfall) {
      if (environment.weather.snowfall.snowfallIntensity) {
        const snowfallIntensityDiff =
          environment.weather.snowfall.snowfallIntensity[1] -
          environment.weather.snowfall.snowfallIntensity[0];
        sum += (3 * snowfallIntensityDiff) / 5 + 1;
      }
    }
    if (environment.weather.rainfall) {
      if (environment.weather.rainfall.precipitationIntensity) {
        const precipitationIntensityDiff =
          environment.weather.rainfall.precipitationIntensity[1] -
          environment.weather.rainfall.precipitationIntensity[0];
        sum += (3 * precipitationIntensityDiff) / 5 + 1;
      }
    }
    if (environment.weather.wind) {
      if (environment.weather.wind.windSpeed) {
        const windSpeedDiff =
          environment.weather.wind.windSpeed[1] -
          environment.weather.wind.windSpeed[0];
        sum += (3 * windSpeedDiff) / 10 + 1;
      }
    }
  }
  return sum;
};
