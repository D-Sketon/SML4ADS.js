import { Environment } from "../../../../../model/Environment";
import {
  _assertNumber,
  _assertNumberGE,
  _assertNumberLE,
} from "../../../../../utils/assert";

export const checkEnvironmentParams = (environment: Environment) => {
  const {
    atmospherePressure,
    temperature,
    visibility,
    sunProperty,
    illumination,
    weather,
  } = environment;

  if (atmospherePressure !== null && atmospherePressure !== void 0) {
    _assertNumberGE(atmospherePressure, 0, "atmospherePressure should >= 0");
  }

  if (temperature !== null && temperature !== void 0) {
    _assertNumber(temperature, "temperature should be number");
  }

  if (visibility !== null && visibility !== void 0) {
    _assertNumberGE(visibility, 0, "visibility should >= 0");
  }

  if (sunProperty) {
    const { sunAzimuth, sunElevation } = sunProperty;

    if (sunAzimuth !== null && sunAzimuth !== void 0) {
      _assertNumber(sunAzimuth, "sunAzimuth should be number");
    }

    if (sunElevation !== null && sunElevation !== void 0) {
      _assertNumber(sunElevation, "sunElevation should be number");
    }
  }

  if (illumination) {
    const { lightningIntensity } = illumination;

    if (lightningIntensity !== null && lightningIntensity !== void 0) {
      _assertNumberGE(lightningIntensity, 0, "lightningIntensity should >= 0");
    }
  }

  if(weather) {
    const { cloud, snowfall, rainfall, wind } = weather;

    if (cloud) {
      const { cloudinessLevel } = cloud;

      if (cloudinessLevel !== null && cloudinessLevel !== void 0) {
        _assertNumberGE(cloudinessLevel, 0, "cloudinessLevel should >= 0");
        _assertNumberLE(cloudinessLevel, 8, "cloudinessLevel should <= 8");
      }
    }

    if (snowfall) {
      const { snowfallIntensity } = snowfall;

      if (snowfallIntensity !== null && snowfallIntensity !== void 0) {
        _assertNumberGE(snowfallIntensity, 0, "snowfallIntensity should >= 0");
      }
    }

    if (rainfall) {
      const { precipitationIntensity } = rainfall;

      if (precipitationIntensity !== null && precipitationIntensity !== void 0) {
        _assertNumberGE(precipitationIntensity, 0, "precipitationIntensity should >= 0");
      }
    }

    if (wind) {
      const { windSpeed } = wind;

      if (windSpeed !== null && windSpeed !== void 0) {
        _assertNumberGE(windSpeed, 0, "windSpeed should >= 0");
      }
    }
  }
};
