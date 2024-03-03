import type { MModel as AdsmlType } from "../../../src/model/Model";
import type { Environment } from "../../../src/model/Environment";
import type { MCar } from "../../../src/model/Car";
import {
  GLOBAL_POSITION_PARAMS,
  LANE_POSITION_PARAMS,
  LOCATION_TYPES,
  ROAD_POSITION_PARAMS,
} from "../../../src/model/params/ParamLocation";
import { SPEED_TYPES } from "../../../src/model/params/ParamSpeed";
import { PEDESTRIAN_SPEED_TYPES } from "../../../src/model/Pedestrian";

export default function convertAdsml2OpenScenario(_e: any, _adsml: string) {
  const adsml = JSON.parse(_adsml) as AdsmlType;
  let openScenario = "scenario case:";
  openScenario += generateMap(adsml.map).join("\n\t");
  openScenario += generateEnvironment(adsml.environment).join("\n\t");
  const [vehicleActor, warnMsg] = generateVehicle(adsml.cars);
  openScenario += vehicleActor.join("\n\t");
  const [pedestrianActor, pedestrianWarnMsg] = generatePedestrian(
    adsml.pedestrians
  );
  openScenario += pedestrianActor.join("\n\t");
  const [riderActor, riderWarnMsg] = generatePedestrian(adsml.riders);
  openScenario += riderActor.join("\n\t");
  if (
    warnMsg.length > 0 ||
    pedestrianWarnMsg.length > 0 ||
    riderWarnMsg.length > 0
  ) {
    _e?.sender.send(
      "ui:onOpenNotification",
      "warning",
      "Warning",
      [...warnMsg, ...pedestrianWarnMsg, ...riderWarnMsg].join("\n")
    );
  }
  return openScenario;
}

const generateMap = (map: string): string[] => {
  return ["", `map.set_map_file('${map}')`];
};

const generateEnvironment = (environment: Environment): string[] => {
  const environmentActor = ["", "environment: environment"];
  // weather
  if (environment.weather.cloud) {
    environmentActor.push(
      `environment.clouds(${environment.weather.cloud.cloudinessLevel})`
    );
  }
  if (environment.visibility) {
    environmentActor.push(`environment.fog(${environment.visibility}m)`);
  }
  if (environment.weather.wind) {
    let deg = 0;
    const { windSpeed, windDirection } = environment.weather.wind;
    if (windDirection === "N") {
      deg = 0;
    } else if (windDirection === "NE") {
      deg = 45;
    } else if (windDirection === "E") {
      deg = 90;
    } else if (windDirection === "SE") {
      deg = 135;
    } else if (windDirection === "S") {
      deg = 180;
    } else if (windDirection === "SW") {
      deg = 225;
    } else if (windDirection === "W") {
      deg = 270;
    } else if (windDirection === "NW") {
      deg = 315;
    }
    environmentActor.push(`environment.wind(${windSpeed}mps, ${deg}deg)`);
  }
  if (environment.weather.snowfall) {
    environmentActor.push(
      `environment.snow(${environment.weather.snowfall.snowfallIntensity}mmph)`
    );
  }
  if (environment.weather.rainfall) {
    environmentActor.push(
      `environment.rain(${environment.weather.rainfall.precipitationIntensity}mmph)`
    );
  }
  environmentActor.push(
    `environment.air(temperature: ${environment.temperature}celsius, pressure: ${environment.atmospherePressure}Pa)`
  );
  if (environment.sunProperty) {
    const { sunAzimuth, sunElevation } = environment.sunProperty;
    environmentActor.push(
      `environment.assign_celestial_position(environment.sun, ${sunAzimuth}deg, ${sunElevation}deg)`
    );
  }
  return environmentActor;
};

const generateVehicle = (cars: MCar[]): [string[], string[]] => {
  const vehicleActor: string[] = [""];
  const warnMsg: string[] = [];
  cars.forEach((car) => {
    vehicleActor.push(`${car.name}: vehicle`);
    if (car.locationType === LOCATION_TYPES.GLOBAL_POSITION) {
      const { x, y } = car.locationParams as GLOBAL_POSITION_PARAMS;
      if (x[1] > x[0] || y[1] > y[0]) {
        warnMsg.push(
          `${car.name} has a range of global position. It will be converted to a single position.`
        );
      }
      vehicleActor.push("do:");
      vehicleActor.push(
        `\t${car.name}.assign_position(map.xyz_to_route_point(${x[0]}, ${y[0]}, 0))`
      );
    } else if (car.locationType === LOCATION_TYPES.ROAD_POSITION) {
      const { roadId, lateralOffset, longitudinalOffset } =
        car.locationParams as ROAD_POSITION_PARAMS;
      if (
        lateralOffset[1] > lateralOffset[0] ||
        longitudinalOffset[1] > longitudinalOffset[0]
      ) {
        warnMsg.push(
          `${car.name} has a range of road position. It will be converted to a single position.`
        );
      }
      vehicleActor.push("do:");
      vehicleActor.push(
        `\t${car.name}.assign_position(map.odr_to_route_point(${roadId}, ${lateralOffset[0]}, ${longitudinalOffset[0]}))`
      );
    } else if (car.locationType === LOCATION_TYPES.LANE_POSITION) {
      const { roadId, laneId, lateralOffset, longitudinalOffset } =
        car.locationParams as LANE_POSITION_PARAMS;
      if (
        lateralOffset[1] > lateralOffset[0] ||
        longitudinalOffset[1] > longitudinalOffset[0]
      ) {
        warnMsg.push(
          `${car.name} has a range of lane position. It will be converted to a single position.`
        );
      }
      vehicleActor.push("do:");
      vehicleActor.push(
        `\t${car.name}.assign_position(map.odr_to_route_point(${roadId}, ${laneId}, ${lateralOffset[0]}, ${longitudinalOffset[0]}))`
      );
    }
    if (car.locationType === LOCATION_TYPES.RELATED_POSITION) {
      vehicleActor.push("do:");
    }
    if (car.speedType === SPEED_TYPES.MANUAL) {
      vehicleActor.push(
        `\t${car.name}.assign_speed(${(car.speedParams as any).initValue}mps)`
      );
    } else {
      warnMsg.push(
        `${car.name} has a speed type of ${car.speedType}. It is not supported in OpenSCENARIO.`
      );
    }
    if (car.accelerationType === SPEED_TYPES.MANUAL) {
      vehicleActor.push(
        `\t${car.name}.assign_acceleration(${
          (car.accelerationParams as any).initValue
        }mps2)`
      );
    } else {
      warnMsg.push(
        `${car.name} has an acceleration type of ${car.accelerationType}. It is not supported in OpenSCENARIO.`
      );
    }
  });
  return [vehicleActor, warnMsg];
};

const generatePedestrian = (pedestrians: any[]): [string[], string[]] => {
  const pedestrianActor: string[] = [""];
  const warnMsg: string[] = [];
  pedestrians.forEach((pedestrian) => {
    pedestrianActor.push(`${pedestrian.name}: person`);
    if (
      pedestrian.location[0].locationType === LOCATION_TYPES.GLOBAL_POSITION
    ) {
      const { x, y } = pedestrian.location[0]
        .locationParams as GLOBAL_POSITION_PARAMS;
      if (x[1] > x[0] || y[1] > y[0]) {
        warnMsg.push(
          `${pedestrian.name} has a range of global position. It will be converted to a single position.`
        );
      }
      pedestrianActor.push("do:");
      pedestrianActor.push(
        `\t${pedestrian.name}.assign_position(map.xyz_to_route_point(${x[0]}, ${y[0]}, 0))`
      );
    } else if (
      pedestrian.location[0].locationType === LOCATION_TYPES.ROAD_POSITION
    ) {
      const { roadId, lateralOffset, longitudinalOffset } = pedestrian
        .location[0].locationParams as ROAD_POSITION_PARAMS;
      if (
        lateralOffset[1] > lateralOffset[0] ||
        longitudinalOffset[1] > longitudinalOffset[0]
      ) {
        warnMsg.push(
          `${pedestrian.name} has a range of road position. It will be converted to a single position.`
        );
      }
      pedestrianActor.push("do:");
      pedestrianActor.push(
        `\t${pedestrian.name}.assign_position(map.odr_to_route_point(${roadId}, ${lateralOffset[0]}, ${longitudinalOffset[0]}))`
      );
    } else if (
      pedestrian.location[0].locationType === LOCATION_TYPES.LANE_POSITION
    ) {
      const { roadId, laneId, lateralOffset, longitudinalOffset } = pedestrian
        .location[0].locationParams as LANE_POSITION_PARAMS;
      if (
        lateralOffset[1] > lateralOffset[0] ||
        longitudinalOffset[1] > longitudinalOffset[0]
      ) {
        warnMsg.push(
          `${pedestrian.name} has a range of lane position. It will be converted to a single position.`
        );
      }
      pedestrianActor.push("do:");
      pedestrianActor.push(
        `\t${pedestrian.name}.assign_position(map.odr_to_route_point(${roadId}, ${laneId}, ${lateralOffset[0]}, ${longitudinalOffset[0]}))`
      );
    }
    if (
      pedestrian.location[0].locationType === LOCATION_TYPES.RELATED_POSITION
    ) {
      pedestrianActor.push("do:");
    }
    if (pedestrian.location.length > 0) {
      if (pedestrian.location[1].speed) {
        pedestrianActor.push(
          `\t${pedestrian.name}.assign_speed(${pedestrian.location[1].speed}mps)`
        );
      } else if (
        pedestrian.location[1].speedType === PEDESTRIAN_SPEED_TYPES.WALK
      ) {
        pedestrianActor.push(`\t${pedestrian.name}.assign_speed(1.4mps)`);
      } else if (
        pedestrian.location[1].speedType === PEDESTRIAN_SPEED_TYPES.RUN
      ) {
        pedestrianActor.push(`\t${pedestrian.name}.assign_speed(3.1mps)`);
      } else {
        pedestrianActor.push(
          `\t${pedestrian.name}.assign_speed(${pedestrian.location[1].speedParams.speed}mps)`
        );
      }
    }
  });

  return [pedestrianActor, warnMsg];
};
