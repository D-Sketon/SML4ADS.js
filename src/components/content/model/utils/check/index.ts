import { MCar } from "../../../../../model/Car";
import { MModel } from "../../../../../model/Model";
import {
  _assertRequired,
  _assertNumberGE,
  _assertNumberLE,
  _assertNumber,
  _assertArrayLength,
} from "../../../../../utils/assert";
import { checkEnvironmentParams } from "./checkEnvironmentParams";
import { checkLocationParams } from "./checkLocationParams";
import { checkSpeedParams } from "./checkSpeedParams";

export const checkModel = (model: MModel) => {
  const { map, timeStep, simulationTime, cars, environment } = model;
  _assertRequired(map, "MapType is required");

  _assertRequired(timeStep, "TimeStep is required");
  _assertNumberGE(timeStep, 0.1, "TimeStep should be >=0.1");
  _assertNumberLE(timeStep, 10, "TimeStep should be <=10");

  _assertRequired(simulationTime, "SimulationTime is required");
  _assertNumberGE(simulationTime, 0, "SimulationTime should be >=0");
  _assertNumberLE(simulationTime, 40, "SimulationTime should be <=40");
  // simulationTime should be a multiple of timeStep
  if (
    Number(simulationTime) / Number(timeStep) !==
    Math.floor(Number(simulationTime) / Number(timeStep))
  ) {
    throw new Error("SimulationTime should be a multiple of timeStep");
  }

  if(environment) {
    checkEnvironmentParams(environment);
  }

  checkCars(cars);
};

export const checkCars = (cars: MCar[]) => {
  for (const car of cars) {
    const {
      name,
      speedType,
      speedParams,
      accelerationType,
      accelerationParams,
      roadDeviation,
      treePath,
      maxSpeed,
      minSpeed,
      maxAcceleration,
      minAcceleration,
    } = car;
    _assertRequired(name, "Car name is required");

    _assertRequired(maxSpeed, "Car maxSpeed is required");
    _assertNumberGE(maxSpeed, 0, "Car maxSpeed should >= 0");

    if (minSpeed !== null && minSpeed !== void 0) {
      _assertNumberGE(minSpeed, 0, "Car minSpeed should >= 0");
    }

    _assertArrayLength(
      roadDeviation,
      2,
      "Car roadDeviation should have length of 2"
    );

    for (const rd of roadDeviation) {
      _assertRequired(rd, "Car roadDeviation is required");
      _assertNumber(rd, "Car roadDeviation should be number");
    }

    _assertNumberGE(
      roadDeviation[1],
      roadDeviation[0],
      "Car roadDeviation[1] should >= roadDeviation[0]"
    );

    checkSpeedParams(speedType, speedParams, maxSpeed, minSpeed);
    checkSpeedParams(
      accelerationType,
      accelerationParams,
      maxAcceleration,
      minAcceleration
    );

    checkLocationParams(car.locationType, car.locationParams);

    _assertRequired(treePath, "Car treePath is required");
  }
};
