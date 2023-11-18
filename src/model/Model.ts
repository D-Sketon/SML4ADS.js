import { MCar } from "./Car";

export type MModel = {
  simulatorType: string;
  mapType: string;
  map: string;
  weather: string;
  timeStep: number;
  simulationTime: number;
  scenarioEndTrigger: string;
  cars: MCar[];
  requirements: string[];
  parametricStls: string[];
  parametrics: string[];
}