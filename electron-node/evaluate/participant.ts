import { MCar } from "../../src/model/Car";
import { MPedestrian } from "../../src/model/Pedestrian";
import { MRider } from "../../src/model/Rider";
import T from "./zip";

export const evaluateCar = (_e: any, cars: MCar[]) => {
  let sum = 0;
  cars.forEach((car) => {
    const speedDiff = car.maxSpeed - (car.minSpeed ?? 0);
    sum += T(speedDiff) + 1;
    let paramSum = 0;
    let paramCount = 0;
    for (const params in car.locationParams) {
      if (Array.isArray(car.locationParams[params])) {
        paramCount++;
        const paramDiff =
          car.locationParams[params][1] - car.locationParams[params][0];
        paramSum += T(paramDiff) + 1;
      }
    }
    if (paramCount > 0) {
      sum += paramSum / paramCount;
    }
  });
  return sum;
};

export const evaluatePedestrian = (_e: any, pedestrians: MPedestrian[]) => {
  let sum = 0;
  pedestrians.forEach((pedestrian) => {
    pedestrian.location.forEach((loc) => {
      let paramSum = 0;
      let paramCount = 0;
      for (const params in loc.locationParams) {
        if (Array.isArray(loc.locationParams[params])) {
          paramCount++;
          const paramDiff =
            loc.locationParams[params][1] - loc.locationParams[params][0];
          paramSum += T(paramDiff) + 1;
        }
      }
      if (paramCount > 0) {
        sum += paramSum / paramCount;
      }
    });
  });
  return sum;
};

export const evaluateRider = (_e: any, riders: MRider[]) => {
  let sum = 0;
  riders.forEach((rider) => {
    rider.location.forEach((loc) => {
      let paramSum = 0;
      let paramCount = 0;
      for (const params in loc.locationParams) {
        if (Array.isArray(loc.locationParams[params])) {
          paramCount++;
          const paramDiff =
            loc.locationParams[params][1] - loc.locationParams[params][0];
          paramSum += T(paramDiff) + 1;
        }
      }
      sum += paramSum / paramCount;
    });
  });
  return sum;
};
