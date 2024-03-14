import { Environment } from "../../../../../model/Environment";
import {
  _assertNumber,
  _assertNumberGE,
  _assertNumberLE,
  _assertArrayLength,
  _assertRequired
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

  if (atmospherePressure != null) {
    _assertArrayLength(atmospherePressure, 2, "atmospherePressure should have length of 2");
    for (const ap of atmospherePressure) {
      _assertNumberGE(ap, 0, "atmospherePressure should >= 0");
    }
  }

  if (temperature != null) {
    _assertArrayLength(temperature, 2, "temperature should have length of 2");
    for (const t of temperature) {
      _assertRequired(t, "temperature is required");
      _assertNumber(t, "temperature should be number");
    }
  }

  if (visibility != null) {
    _assertArrayLength(visibility, 2, "visibility should have length of 2");
    for (const v of visibility) {
      _assertNumberGE(v, 0, "visibility should >= 0");
    }
  }

  if(sunProperty) {
    const { sunAzimuth, sunElevation } = sunProperty;

    if (sunAzimuth != null) {
      _assertArrayLength(sunAzimuth, 2, "sunAzimuth should have length of 2");
      for (const sa of sunAzimuth) {
        _assertRequired(sa, "sunAzimuth is required");
        _assertNumber(sa, "sunAzimuth should be number");
      }
    }

    if (sunElevation != null) {
      _assertArrayLength(sunElevation, 2, "sunElevation should have length of 2");
      for (const se of sunElevation) {
        _assertRequired(se, "sunElevation is required");
        _assertNumber(se, "sunElevation should be number");
      }
    }
  }

  if(illumination) {
    const { lightingIntensity } = illumination;

    if (lightingIntensity != null) {
      _assertArrayLength(lightingIntensity, 2, "lightingIntensity should have length of 2");
      for (const li of lightingIntensity) {
        _assertNumberGE(li, 0, "lightingIntensity should >= 0");
      }
    }
  }

  if(weather) {
    const { cloud, snowfall, rainfall, wind } = weather;

    if (cloud) {
      const { cloudinessLevel } = cloud;

      if (cloudinessLevel != null) {
        _assertArrayLength(cloudinessLevel, 2, "cloudinessLevel should have length of 2");
        for (const cl of cloudinessLevel) {
          _assertNumberGE(cl, 0, "cloudinessLevel should >= 0");
          _assertNumberLE(cl, 8, "cloudinessLevel should <= 8");
        }
      }
    }

    if (snowfall) {
      const { snowfallIntensity } = snowfall;

      if (snowfallIntensity != null) {
        _assertArrayLength(snowfallIntensity, 2, "snowfallIntensity should have length of 2");
        for (const si of snowfallIntensity) {
          _assertNumberGE(si, 0, "snowfallIntensity should >= 0");
        }
      }
    }

    if (rainfall) {
      const { precipitationIntensity } = rainfall;

      if (precipitationIntensity != null) {
        _assertArrayLength(precipitationIntensity, 2, "precipitationIntensity should have length of 2");
        for (const pi of precipitationIntensity) {
          _assertNumberGE(pi, 0, "precipitationIntensity should >= 0");
        }
      }
    }

    if (wind) {
      const { windSpeed } = wind;

      if (windSpeed != null) {
        _assertArrayLength(windSpeed, 2, "windSpeed should have length of 2");
        for (const ws of windSpeed) {
          _assertNumberGE(ws, 0, "windSpeed should >= 0");
        }
      }
    }
  }
};
