interface MModel {
  simulatorType: string;
  mapType: string;
  map: string;
  weather: string;
  timeStep: number;
  simulationTime: number;
  scenarioEndTrigger: string;
  cars: Array<any>;
  requirements: Array<string>;
  parametricStls: Array<string>;
  parametrics: Array<string>;
}

export default MModel;