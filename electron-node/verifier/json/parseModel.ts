import readFile from "../../io/readFile";
import getAbsolutePath from "../../io/getAbsolutePath";
import { MAP_TYPES, type Model } from "../../../src/model/Model";
import { LOCATION_TYPES } from "../../../src/model/params/ParamLocation";
import type { Tree } from "../../../src/model/Tree";
import { type Car } from "../../../src/model/Car";
import type { Behavior } from "../../../src/model/Behavior";
import type { BranchPoint } from "../../../src/model/BranchPoint";
import type { CommonTransition } from "../../../src/model/CommonTransition";
import type { ProbabilityTransition } from "../../../src/model/ProbabilityTransition";
import path from "path";
import random from "random";

let nameCarMap: Map<string, Car>;

const _initFromRelatedCar = (car: Car) => {
  if (car.locationType === LOCATION_TYPES.RELATED_POSITION) {
    const relatedCar = nameCarMap.get(car.actorRef) as Car;
    car.roadId = relatedCar.roadId;
    car.laneId = relatedCar.laneId;
    car.minOffset = relatedCar.minOffset + car.minOffset;
    car.maxOffset = relatedCar.maxOffset + car.maxOffset;
    car.minLateralOffset = relatedCar.minLateralOffset + car.minLateralOffset;
    car.maxLateralOffset = relatedCar.maxLateralOffset + car.maxLateralOffset;
  }
};

const _initProbabilityTransition = (
  probabilityTransition: ProbabilityTransition
) => {
  if (probabilityTransition.targetBehavior) {
    const targetBehavior = probabilityTransition.targetBehavior;
    // Change the corresponding behavior's triple
    targetBehavior.level = probabilityTransition.level + 1;
    targetBehavior.group =
      (probabilityTransition.group - 1) * 3 + probabilityTransition.number;
    targetBehavior.number = 0;
    _initBehavior(targetBehavior);
  }
};

const _initBranchPoint = (branchPoint: BranchPoint) => {
  let number = 1;
  for (const probabilityTransition of branchPoint.nextTransitions) {
    // Change the corresponding edge's triple
    probabilityTransition.level = branchPoint.level;
    probabilityTransition.group = branchPoint.group;
    probabilityTransition.number = number;
    number++;
    _initProbabilityTransition(probabilityTransition);
  }
};

const _initCommonTransition = (commonTransition: CommonTransition) => {
  if (commonTransition.targetBehavior) {
    const targetBehavior = commonTransition.targetBehavior;
    // Change the corresponding behavior's triple
    targetBehavior.level = commonTransition.level + 1;
    targetBehavior.group =
      (commonTransition.group - 1) * 3 + commonTransition.number;
    targetBehavior.number = 0;
    _initBehavior(targetBehavior);
  } else if (commonTransition.targetBranchPoint) {
    const targetBranchPoint = commonTransition.targetBranchPoint;
    // Change the corresponding branchPoint's triple
    targetBranchPoint.level = commonTransition.level + 1;
    targetBranchPoint.group =
      (commonTransition.group - 1) * 3 + commonTransition.number;
    targetBranchPoint.number = 0;
    _initBranchPoint(targetBranchPoint);
  }
};

const _initBehavior = (sourceBehavior: Behavior) => {
  let number = 1;
  // Init the edges whose source is this behavior
  for (const commonTransition of sourceBehavior.nextTransitions) {
    // Change the corresponding commonTransition's triple
    commonTransition.level = sourceBehavior.level;
    commonTransition.group = sourceBehavior.group;
    commonTransition.number = number;
    number++;
    _initCommonTransition(commonTransition);
  }
};

interface ANY_LOCATION_PARAMS {
  x?: [number, number];
  y?: [number, number];
  roadId?: number;
  laneId?: number;
  actorRef?: string;
  lateralOffset?: [number, number];
  longitudinalOffset?: [number, number];
}

const initLocationParams = (car: Car) => {
  // only support v0.2.0+
  const { locationParams }: { locationParams: ANY_LOCATION_PARAMS } = car;
  if (locationParams.x !== void 0) {
    car.x = random.int(locationParams.x[0], locationParams.x[1]);
  } else {
    car.x = 0;
  }
  if (locationParams.y !== void 0) {
    car.y = random.int(locationParams.y[0], locationParams.y[1]);
  } else {
    car.y = 0;
  }
  car.minOffset = locationParams.longitudinalOffset?.[0] ?? 0;
  car.maxOffset = locationParams.longitudinalOffset?.[1] ?? 0;
  car.minLateralOffset = locationParams.lateralOffset?.[0] ?? 0;
  car.maxLateralOffset = locationParams.lateralOffset?.[1] ?? 0;
  car.roadId = locationParams.roadId ?? 0;
  car.laneId = locationParams.laneId ?? 0;
  car.actorRef = locationParams.actorRef ?? "";
};

const initEdge = (car: Car) => {
  const { mTree } = car;
  const { behaviors, branchPoints, commonTransitions, probabilityTransitions } =
    mTree;

  const idBehaviorMap = new Map<number, Behavior>();
  const idBranchPointMap = new Map<number, BranchPoint>();

  for (const behavior of behaviors) {
    idBehaviorMap.set(behavior.id, behavior);
  }
  for (const branchPoint of branchPoints) {
    idBranchPointMap.set(branchPoint.id, branchPoint);
  }

  for (const behavior of behaviors) {
    behavior.nextBehaviors = [];
    behavior.nextBranchPoints = [];
    behavior.nextTransitions = [];

    for (const commonTransition of commonTransitions) {
      if (behavior.id === commonTransition.sourceId) {
        commonTransition.sourceBehavior = behavior;
        if (idBehaviorMap.has(commonTransition.targetId)) {
          const targetBehavior = idBehaviorMap.get(
            commonTransition.targetId
          ) as Behavior;
          commonTransition.targetBehavior = targetBehavior;
          behavior.nextBehaviors.push(targetBehavior);
        } else {
          const branchPoint = idBranchPointMap.get(
            commonTransition.targetId
          ) as BranchPoint;
          commonTransition.targetBranchPoint = branchPoint;
          behavior.nextBranchPoints.push(branchPoint);
        }
        behavior.nextTransitions.push(commonTransition);
      }
    }

    for (const branchPoint of branchPoints) {
      branchPoint.nextBehaviors = [];
      branchPoint.nextTransitions = [];
      for (const probabilityTransition of probabilityTransitions) {
        if (branchPoint.id === probabilityTransition.sourceId) {
          probabilityTransition.sourceBranchPoint = branchPoint;
          if (idBehaviorMap.has(probabilityTransition.targetId)) {
            const targetBehavior = idBehaviorMap.get(
              probabilityTransition.targetId
            ) as Behavior;
            probabilityTransition.targetBehavior = targetBehavior;
            branchPoint.nextBehaviors.push(targetBehavior);
          }
          branchPoint.nextTransitions.push(probabilityTransition);
        }
      }
    }
  }

  for (const behavior of behaviors) {
    if (behavior.id === mTree.rootId) {
      behavior.level = 1;
      behavior.group = 1;
      behavior.number = 0;
      _initBehavior(behavior);
      break;
    }
  }
};

const modifyId = (car: Car) => {
  let id = 1;
  let locationId = 1;
  const ids = new Map<number, number>();
  const locationIds = new Map<string, number>();

  for (const behavior of car.mTree.behaviors) {
    if (!locationIds.has(behavior.name)) {
      locationIds.set(behavior.name, locationId);
      ids.set(behavior.id, locationId);
      behavior.id = locationId;
      locationId++;
      id++;
    } else {
      const nowId = locationIds.get(behavior.name) as number;
      ids.set(behavior.id, nowId);
      behavior.id = nowId;
    }
  }

  for (const branchPoint of car.mTree.branchPoints) {
    ids.set(branchPoint.id, id);
    branchPoint.id = id++;
  }

  for (const commonTransition of car.mTree.commonTransitions) {
    ids.set(commonTransition.id, id);
    commonTransition.id = id++;
    commonTransition.sourceId = ids.get(commonTransition.sourceId) as number;
    commonTransition.targetId = ids.get(commonTransition.targetId) as number;
  }

  for (const probabilityTransition of car.mTree.probabilityTransitions) {
    ids.set(probabilityTransition.id, id);
    probabilityTransition.id = id++;
    probabilityTransition.sourceId = ids.get(
      probabilityTransition.sourceId
    ) as number;
    probabilityTransition.targetId = ids.get(
      probabilityTransition.targetId
    ) as number;
  }
};

const parseModel = (_e: any, content: string, modelPath: string) => {
  nameCarMap = new Map<string, Car>();
  const model: Model = JSON.parse(content);
  // Change mapPath from relative path to absolute path
  if (model.mapType === MAP_TYPES.CUSTOM) {
    model.map = getAbsolutePath(_e, modelPath, model.map);
  } else {
    model.map = path.resolve(__filename, "../../resources/map/" + model.map);
  }
  // Change weather from string[] to string
  if (Array.isArray(model.weather)) {
    model.weather = model.weather[random.int(0, model.weather.length - 1)];
  }

  const cars: Car[] = [];
  for (const car of model.cars) {
    const absolutePath = getAbsolutePath(_e, modelPath, car.treePath);
    const treeContent = readFile(_e, absolutePath);
    const tree: Tree = JSON.parse(treeContent);
    car.mTree = tree;
    // Change roadDeviation from [number, number] to number
    if (Array.isArray(car.roadDeviation)) {
      car.roadDeviation = random.int(
        car.roadDeviation[0],
        car.roadDeviation[1]
      );
    }
    initLocationParams(car);
    initEdge(car);
    modifyId(car);
    nameCarMap.set(car.name, car);
    cars.push(car);
  }

  for (const car of model.cars) {
    _initFromRelatedCar(car);
  }

  model.cars = cars;
  return model;
};

export default parseModel;
