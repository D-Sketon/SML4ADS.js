export type Environment = {
  atmospherePressure?: [number, number];
  temperature?: [number, number];
  visibility?: [number, number];  // m
  sunProperty?: {
    sunAzimuth?: [number, number];
    sunElevation?: [number, number];
  };
  // particulates
  particulates?: {
    type?: ENVIRONMENT_PARTICULATES[];
  };
  // illumination
  illumination: {
    type?: ENVIRONMENT_ILLUMINATION[];
    lightingIntensity?: [number, number]; // Lux
  };
  // weather
  weather: {
    // cloud
    cloud?: {
      type?: ENVIRONMENT_CLOUD[];
      cloudinessLevel?: [number, number]; // Okta
    };
    // snowfall
    snowfall?: {
      type?: ENVIRONMENT_SNOWFALL[];
      snowfallIntensity?: [number, number]; // mm/h
    };
    // rainfall
    rainfall?: {
      type?: ENVIRONMENT_RAINFALL[];
      precipitationIntensity?: [number, number]; // mm/h
    };
    // wind
    wind?: {
      type?: ENVIRONMENT_WIND[];
      windDirection?: string;
      windSpeed?: [number, number];
    };
  };
  // connectivity
  connectivity?: {
    communication?: ENVIRONMENT_COMMUNICATION;
    positioning?: ENVIRONMENT_POSITIONING;
  };
};

export enum ENVIRONMENT_PARTICULATES {
  NONE = "None",
  FOGGY = "Foggy",
  MARINE = "Marine",
  SAND = "Sand",
  SMOKE = "SmokeAndDust",
}

export enum ENVIRONMENT_ILLUMINATION {
  ARTIFICIAL = "ArtificialLighting",
  DAY = "DayLighting",
  NIGHT = "NightLighting",
}

export enum ENVIRONMENT_CLOUD {
  CLEAR = "Clear",
  FEW_CLOUDS = "FewClouds",
  SCATTERED_CLOUDS = "ScatteredClouds",
  BROKEN_CLOUDS = "BrokenClouds",
  OVERCAST = "Overcast",
}

export enum ENVIRONMENT_SNOWFALL {
  LIGHT_SNOW = "LightSnow",
  MODERATE_SNOW = "ModerateSnow",
  HEAVY_SNOW = "HeavySnow",
}

export enum ENVIRONMENT_RAINFALL {
  LIGHT_RAIN = "LightRain",
  MODERATE_RAIN = "ModerateRain",
  HEAVY_RAIN = "HeavyRain",
  VIOLENT_RAIN = "ViolentRain",
  CLOUDBURST = "Cloudburst",
}

export enum ENVIRONMENT_WIND {
  CALM_WIND = "CalmWind",
  LIGHT_AIR = "LightAir",
  LIGHT_BREEZE = "LightBreeze",
  GENTLE_BREEZE = "GentleBreeze",
  MODERATE_BREEZE = "ModerateBreeze",
  FRESH_BREEZE = "FreshBreeze",
  STRONG_BREEZE = "StrongBreeze",
  NEAR_GALE = "NearGale",
  GALE = "Gale",
  STRONG_GALE = "StrongGale",
  STORM = "Storm",
  VIOLENT_STORM = "ViolentStorm",
  HURRICANE = "Hurricane",
}

export enum ENVIRONMENT_COMMUNICATION {
  V2I = "V2I",
  V2V = "V2V",
}

export enum ENVIRONMENT_POSITIONING {
  GALILEO = "Galileo",
  GLONASS = "GLONASS",
  GPS = "GPS",
  BDS = "BDS",
}

export const defaultEnvironment: () => Environment = () => ({
  atmospherePressure: [101325, 101325],
  temperature: [25, 25],
  visibility: [1000, 1000],
  sunProperty: {
    sunAzimuth: [180, 180],
    sunElevation: [45, 45],
  },
  particulates: {
    type: [ENVIRONMENT_PARTICULATES.NONE],
  },
  illumination: {
    type: [ENVIRONMENT_ILLUMINATION.DAY],
    lightingIntensity: [10000, 1000],
  },
  weather: {
    cloud: {
      type: [ENVIRONMENT_CLOUD.CLEAR],
      cloudinessLevel: [0, 0],
    },
    snowfall: {
      type: [ENVIRONMENT_SNOWFALL.LIGHT_SNOW],
      snowfallIntensity: [0, 0],
    },
    rainfall: {
      type: [ENVIRONMENT_RAINFALL.LIGHT_RAIN],
      precipitationIntensity: [0, 0],
    },
    wind: {
      type: [ENVIRONMENT_WIND.CALM_WIND],
      windDirection: "N",
      windSpeed: [0, 0],
    },
  },
  connectivity: {
    communication: ENVIRONMENT_COMMUNICATION.V2I,
    positioning: ENVIRONMENT_POSITIONING.GPS,
  },
});
