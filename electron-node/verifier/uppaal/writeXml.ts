import { writeFileSync } from "fs";
import type { Car } from "../../../src/model/Car";
import type { Model } from "../../../src/model/Model";
import {
  AUTOMATON_PATH,
  DEFINED_PATH,
  END_TRIGGER_PATH,
  FUNCTION_PATH,
  INT16_MAX,
  K,
  LANESECTION_LANE,
  TRANSITION_PATH,
  f,
} from "./constants";
import { GUARD_TYPES } from "../../../src/model/Guard";
import readFile from "../../io/readFile";
import { BEHAVIOR_TYPES, Behavior } from "../../../src/model/Behavior";
import parseXodr from "../xodr/parseXodr";
import writeBuffer from "../xodr/writeBuffer";
import { MapDataContainer } from "../xodr/model/MapDataContainer";
import { Lane } from "../xodr/model/Lane";
import { LaneSection } from "../xodr/model/LaneSection";
import { Road } from "../xodr/model/Road";
import path from "path";

let cars: Car[];
let map: string;
let timeStep: number;
let scenarioEndTrigger: string;

let endId: number;
// car mapping: name -> Index
let carNameIndexMap: Map<string, number>;

// Corresponding XML declaration header
const XML_HEAD = '<?xml version="1.0" encoding="utf-8"?>\n';
const UPPAAL_HEAD =
  "<!DOCTYPE nta PUBLIC '-//Uppaal Team//DTD Flat System 1.1//EN' 'http://www.it.uu.se/research/group/darts/uppaal/flat-1_2.dtd'>\n";

/**
 * 1 Declaration part, that is, the code writing place (note that the function in Uppaal is after the variable)
 * @param _e Event
 * @param wrapper buffer
 */
const _addDeclaration = (_e: any, wrapper: { buffer: string }) => {
  /**
   * 1.1 Add the map data structure that has been defined (including some variable information)
   */
  const _addDefined = () => {
    const definedContent = readFile(_e, path.resolve(__filename, DEFINED_PATH));
    wrapper.buffer += definedContent;
  };

  /**
   * 1.2 Create a statement to declare variables according to the information extracted from JSON
   */
  const _addMap = () => {
    const input = readFile(_e, map);
    try {
      const container = parseXodr(input);
      writeBuffer(container, wrapper);
      _initCarFromMap(container);
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  };

  /**
   * 1.2.4 Update the index of the vehicle according to the map information; in addition, recalculate the laneId through the offset
   * @param container MapDataContainer
   */
  const _initCarFromMap = (container: MapDataContainer) => {
    if (container === null || container === void 0) {
      _e?.sender.send(
        "ui:onOpenNotification",
        "error",
        "Error",
        "An error occurred while paring tha map. Received null."
      );
      return;
    }
    const roads = container.roads;
    const laneSections = container.laneSections;
    const lanes = container.lanes;

    // Map mapping: id -> Road/LaneSection/Lane
    const roadMap = new Map<number, Road>();
    const laneSectionMap = new Map<number, LaneSection>();
    const laneMap = new Map<number, Lane>();

    // Initialize mapping: id -> index, for easy lookup
    for (const road of roads) {
      roadMap.set(road.roadId, road);
    }
    for (const laneSection of laneSections) {
      laneSectionMap.set(laneSection.laneSectionId, laneSection);
    }
    for (const lane of lanes) {
      laneMap.set(lane.singleId, lane);
    }

    for (const car of cars) {
      // 1. Parse laneSectionId and laneSingleId
      let laneSectionId = 0;

      let road: Road;
      if (roadMap.has(car.roadId)) {
        road = roadMap.get(car.roadId) as Road;
        car.roadIndex = roadMap.get(car.roadId)!.index;
      } else {
        _e?.sender.send(
          "ui:onOpenNotification",
          "error",
          "Error",
          `roadId(${car.roadId}) of the car ${car.name} doesn't exist!`
        );
        break;
      }

      for (const laneSection of road.laneSections) {
        if (car.minOffset >= laneSection.startPosition) {
          laneSectionId = laneSection.laneSectionId;
          car.laneSectionId = laneSectionId;
          car.laneSectionIndex = laneSectionMap.get(laneSectionId)!.index;
        } else {
          break;
        }
      }

      const laneSection = laneSectionMap.get(laneSectionId) as LaneSection;
      const currentLanes = laneSection.lanes;
      for (const lane of currentLanes) {
        if (lane.laneId === car.laneId) {
          const singleId = lane.singleId;
          car.laneSingleId = singleId;
          car.laneIndex = laneMap.get(singleId)!.index;
          break;
        }
      }

      // 1. Calculate the offset of laneId relative to the center line
      let totalLateralOffset = 0.0;
      let laneId = car.laneId === 0 ? -1 : car.laneId;
      const direction = -laneId / Math.abs(laneId); // The direction in which the index increases: -1 is left, 1 is right (because the left is parsed first and then the right)
      let centerLaneIndex = 0;
      for (const lane of currentLanes) {
        // Find the index of the center line
        if (lane.laneId === 0) {
          centerLaneIndex = lane.index;
        }
      }
      for (
        let i = centerLaneIndex;
        i < currentLanes.length && i < LANESECTION_LANE;
        i += direction
      ) {
        // lane's singleId and index are the same, and they are stacked on both sides
        if (i !== laneId) {
          totalLateralOffset += currentLanes[i].width;
        } else {
          totalLateralOffset += currentLanes[i].width / 2; // If it corresponds to lane, the actual offset is taken at the center line position
          break;
        }
      }
      // 2. Calculate the offset after lane is calculated through Related Position
      let lateralOffset = totalLateralOffset + car.minLateralOffset;
      // 3. Compare according to the offset to calculate the corresponding lane
      let tempOffset = 0.0;
      for (
        let i = 0;
        i < currentLanes.length && i < LANESECTION_LANE;
        i += direction
      ) {
        if (lateralOffset >= tempOffset) {
          const singleId = currentLanes[i].singleId;
          car.laneId = currentLanes[i].laneId;
          car.laneSingleId = singleId;
          car.laneIndex = laneMap.get(singleId)!.index;
        }
        tempOffset += currentLanes[i].width;
      }
    }
  };

  /**
   * 1.3 Add car declaration
   */
  const _addCar = () => {
    const countOfCar = cars.length;
    wrapper.buffer +=
      "\n//id, width, length, heading, speed, acceleration, maxSpeed, ..., offset\n";
    wrapper.buffer += `int countOfCars = ${countOfCar};\n`;
    wrapper.buffer += `Car cars[${countOfCar}] = {\n`;
    for (let i = 0; i < countOfCar; i++) {
      wrapper.buffer += "{";
      wrapper.buffer += `${i}, `;
      wrapper.buffer += `${f(cars[i].width)}, `;
      wrapper.buffer += `${f(cars[i].length)}, `;
      wrapper.buffer += `${cars[i].heading}, `;
      wrapper.buffer += `${f(cars[i].initSpeed)}, `;
      wrapper.buffer += `0, `;
      wrapper.buffer += `${f(cars[i].maxSpeed)}, `;
      wrapper.buffer += `${cars[i].roadId}, `;
      wrapper.buffer += `${cars[i].laneSectionId}, `;
      wrapper.buffer += `${cars[i].laneId}, `;
      wrapper.buffer += `${cars[i].roadIndex}, `;
      wrapper.buffer += `${cars[i].laneSectionIndex}, `;
      wrapper.buffer += `${cars[i].laneIndex}, `;
      wrapper.buffer += `${f(cars[i].offset)}`;
      wrapper.buffer += "}";

      wrapper.buffer += i !== countOfCar - 1 ? ",\n" : "\n";
    }
    wrapper.buffer += "};\n";
  };

  /**
   * 1.4 Add the well-defined function part: the operation implementation of behavior, map query method, vehicle query method, etc.
   */
  const _addFunction = () => {
    const definedContent = readFile(
      _e,
      path.resolve(__filename, FUNCTION_PATH)
    );
    wrapper.buffer += definedContent;
  };

  wrapper.buffer += "\t<declaration>\n";
  // well-defined data structure and variable information
  _addDefined();
  wrapper.buffer += `const int TIME_STEP = ${f(timeStep)};\n`;
  _addMap();
  // declare car and initialize
  _addCar();
  // well-defined function
  _addFunction();
  wrapper.buffer += "\n\t</declaration>\n";
};

/**
 * 2.0 Timer automaton, used to synchronize time
 * @param _e Event
 * @param wrapper buffer
 */
const _addTimer = (_e: any, wrapper: { buffer: string }) => {
  const definedContent = readFile(_e, path.resolve(__filename, AUTOMATON_PATH));
  wrapper.buffer += definedContent;
};

const _resolveGuard = (_e: any, guard: string) => {
  if (guard === null || guard === "") {
    return "";
  }
  let buffer = "";
  let isMatch = false;
  for (const guardType of Object.values(GUARD_TYPES)) {
    if (guard.match(guardType)) {
      isMatch = true;
      let s = guard;
      for (const name of [...carNameIndexMap.keys()]) {
        s = s.replace(
          new RegExp(name, "gm"),
          `cars[${carNameIndexMap.get(name)}]`
        );
      }
      const numberPattern = /[+-]?\d+.?\d*\)/;
      const result = s.match(numberPattern);
      if (result) {
        const number = result[0].substring(0, result[0].length - 1);
        s = s.replace(
          new RegExp(result[0].replace(new RegExp("\\)", "gm"), "\\\\)"), "gm"),
          f(Number(number)) + ")"
        );
      }
      s = s
        .replace(new RegExp("&", "gm"), "&amp;")
        .replace(new RegExp("<", "gm"), "&gt;")
        .replace(new RegExp(">", "gm"), "&lt;");
      buffer = " &amp;&amp; " + s;
      break;
    }
  }
  if (!isMatch) {
    _e?.sender.send(
      "ui:onOpenNotification",
      "error",
      "Error",
      `Invalid Guard ${guard}.`
    );
  }
  return buffer;
};

/**
 * 2 Corresponding to the template part, that is, the behavior tree of each vehicle
 * @param _e Event
 * @param wrapper buffer
 * @param carIndex number
 */
const _addTemplate = (
  _e: any,
  wrapper: { buffer: string },
  carIndex: number
) => {
  /**
   * 2.1 template name, that is, the name of the vehicle
   */
  const _addName = () => {
    const name = cars[carIndex].name;
    wrapper.buffer += "\t\t<name>";
    wrapper.buffer += name;
    wrapper.buffer += "</name>\n";
  };

  /**
   * 2.2 Declaration of local variables: variables of triple algorithm and self-loop locking algorithm
   */
  const _addLocalDeclaration = () => {
    wrapper.buffer += "\t\t<declaration>\n";
    const definedContent = readFile(
      _e,
      path.resolve(__filename, TRANSITION_PATH)
    );
    wrapper.buffer += definedContent;
    wrapper.buffer += "\t\t</declaration>\n";
  };

  /**
   * 2.3 Each location of the automaton, each state
   */
  const _addLocations = () => {
    // Add an initial state
    wrapper.buffer += '\t\t<location id="id0">\n';
    wrapper.buffer += "\t\t\t<name>Start</name>\n";
    wrapper.buffer += "\t\t\t<committed/>\n";
    wrapper.buffer += "\t\t</location>\n";
    // Add an end state
    endId =
      cars[carIndex].mTree.behaviors.length +
      cars[carIndex].mTree.branchPoints.length +
      1;
    wrapper.buffer += `\t\t<location id="id${endId}">\n`;
    wrapper.buffer += "\t\t\t<name>End</name>\n";
    wrapper.buffer += "\t\t</location>\n";

    const behaviors = cars[carIndex].mTree.behaviors;
    const exist = new Map<number, boolean>();
    for (const behavior of behaviors) {
      if (!exist.has(behavior.id)) {
        exist.set(behavior.id, true);
        const id = `id${behavior.id}`;
        const name = behavior.name;
        wrapper.buffer += `\t\t<location id="${id}">\n`;
        wrapper.buffer += `\t\t\t<name>${name}</name>\n`;
        wrapper.buffer += "\t\t</location>\n";
      }
    }
  };

  /**
   * 2.4 Transition point branch point
   */
  const _addBranchPoints = () => {
    const branchPoints = cars[carIndex].mTree.branchPoints;
    for (const branchPoint of branchPoints) {
      const id = `id${branchPoint.id}`;
      const x = branchPoint.position.x;
      const y = branchPoint.position.y;
      wrapper.buffer += `\t\t<branchpoint id="${id}" x="${x}" y="${y}">\n`;
      wrapper.buffer += "\t\t</branchpoint>\n";
    }
  };

  /**
   * 2.5 Initial node
   */
  const _addInit = () => {
    wrapper.buffer += `\t\t<init ref="id0"/>\n`;
  };

  // 添加guards条件的辅助函数
  /**
   * 2.6.1 Add guards conditions
   * @param guards guards
   * @returns string
   */
  const _addGuard = (guards: string[]) => {
    let buffer = "";
    if (guards === null) {
      return "";
    }
    for (const guard of guards) {
      buffer += _resolveGuard(_e, guard);
    }
    return buffer;
  };

  /**
   * 2.6 Transition
   */
  const _addTransitions = () => {
    const commonTransitions = cars[carIndex].mTree.commonTransitions;
    const probabilityTransitions = cars[carIndex].mTree.probabilityTransitions;

    // Root node of Start to behavior tree
    wrapper.buffer += "\t\t<transition>\n";
    wrapper.buffer += `\t\t\t<source ref="id0"/>\n`;
    wrapper.buffer += `\t\t\t<target ref="id1"/>\n`;
    wrapper.buffer += `\t\t\t<label kind="select">offset:int[${f(
      cars[carIndex].minOffset
    )},${f(cars[carIndex].maxOffset)}]</label>\n`;
    wrapper.buffer += `\t\t\t<label kind="assignment">initCar(cars[${carIndex}], offset), modifyRoadLane(cars[${carIndex}])</label>\n`;
    wrapper.buffer += "\t\t</transition>\n";

    for (const commonTransition of commonTransitions) {
      const from = `id${commonTransition.sourceId}`;
      const to = `id${commonTransition.targetId}`;
      wrapper.buffer += "\t\t<transition>\n";
      wrapper.buffer += `\t\t\t<source ref="${from}"/>\n`;
      wrapper.buffer += `\t\t\t<target ref="${to}"/>\n`;

      // select can be used here, (i,j,k) as the coordinate of the edge in the tree
      wrapper.buffer += `\t\t\t<label kind="select">i: int[${commonTransition.level},${commonTransition.level}], j:int[${commonTransition.group},${commonTransition.group}], k:int[${commonTransition.number},${commonTransition.number}]</label>\n`;

      // guard needs to compare whether the edge is connected (coordinate corresponding) before comparing other conditions
      wrapper.buffer += `\t\t\t<label kind="guard">level == i &amp;&amp; group == j &amp;&amp; !lock${_addGuard(
        commonTransition.guard
      )}</label>\n`;

      // sync simple transition also needs signals, otherwise it may not be able to transition during verification
      wrapper.buffer += `\t\t\t<label kind="synchronisation">update?</label>\n`;

      // update/assignment update the coordinates of the edge first, and then update other information
      wrapper.buffer += `\t\t\t<label kind="assignment">level = level+1, group = (group-1)*N+k, number=k, lock=true, t=0</label>\n`;
      wrapper.buffer += "\t\t</transition>\n";
    }

    for (const probabilityTransition of probabilityTransitions) {
      const from = `id${probabilityTransition.sourceId}`;
      const to = `id${probabilityTransition.targetId}`;
      wrapper.buffer += "\t\t<transition>\n";
      wrapper.buffer += `\t\t\t<source ref="${from}"/>\n`;
      wrapper.buffer += `\t\t\t<target ref="${to}"/>\n`;

      // select can be used here, (i,j,k) as the coordinate of the edge in the tree
      wrapper.buffer += `\t\t\t<label kind="select">i: int[${probabilityTransition.level},${probabilityTransition.level}], j:int[${probabilityTransition.group},${probabilityTransition.group}], k:int[${probabilityTransition.number},${probabilityTransition.number}]</label>\n`;

      // sync simple transition also needs signals, otherwise it may not be able to transition during verification
      // wrapper.buffer += `\t\t\t<label kind="synchronisation">update?</label>\n`;

      // update/assignment update the coordinates of the edge first, and then update other information
      wrapper.buffer += `\t\t\t<label kind="assignment">level = level+1, group = (group-1)*N+k, number=k</label>\n`;
      wrapper.buffer += `\t\t\t<label kind="probability">${probabilityTransition.weight}</label>\n`;
      wrapper.buffer += "\t\t</transition>\n";
    }
  };

  /**
   * 2.7 Self-looping edges
   * keep: Self-looping, when "the clock reaches duration" jump out
   * accelerate: Self-looping, when "the clock reaches duration" or "the speed reaches targetSpeed" exit
   * turnLeft: instantaneous action, turn left after completion
   * turnRight: same as above
   * changeLeft: same as above
   * changeRight: same as above
   */
  const _addSelfTransitions = () => {
    /**
     * 2.7.1 Operation execution: self-looping edges do not need k or update group and level
     * @param behavior Behavior
     */
    const _resolveBehavior = (behavior: Behavior) => {
      const from = `id${behavior.id}`;
      const to = `id${behavior.id}`;
      wrapper.buffer += "\t\t<transition>\n";
      wrapper.buffer += `\t\t\t<source ref="${from}"/>\n`;
      wrapper.buffer += `\t\t\t<target ref="${to}"/>\n`;

      // select can be used here, (i,j,k) as the coordinate of the edge in the tree
      wrapper.buffer += `\t\t\t<label kind="select">i: int[${behavior.level},${behavior.level}], j:int[${behavior.group},${behavior.group}]</label>\n`;

      // guard needs to compare whether the edge is connected (coordinate corresponding) before comparing other conditions
      wrapper.buffer += `\t\t\t<label kind="guard">level == i &amp;&amp; group == j &amp;&amp; lock</label>\n`;
      wrapper.buffer += `\t\t\t<label kind="synchronisation">update?</label>\n`;

      // update/assignment update the coordinates of the edge first, and then update other information
      wrapper.buffer += `\t\t\t<label kind="assignment">t=t+TIME_STEP${_operate(
        behavior
      )}</label>\n`;
      wrapper.buffer += "\t\t</transition>\n";
    };

    /**
     * 2.7.2 Update part, change according to behavior type
     * @param behavior Behavior
     */
    const _operate = (behavior: Behavior) => {
      let buffer = "";

      const params = behavior.params as any;
      if (params === null) {
        return "";
      }

      // If it does not exist, set it to the maximum value
      let targetSpeed = params.targetSpeed ?? INT16_MAX / K;
      targetSpeed = targetSpeed === null ? INT16_MAX / K : targetSpeed;
      let acceleration = params.acceleration ?? 0;
      acceleration = acceleration === null ? 0 : acceleration;
      let duration = params.duration ?? INT16_MAX / K;
      duration = duration === null ? INT16_MAX / K : duration;

      if (behavior.name === BEHAVIOR_TYPES.ACCELERATE) {
        // *acceleration, *target speed, duration
        buffer += `, cars[${carIndex}].acceleration = ${f(acceleration)}`;
        buffer += `, speedUp(cars[${carIndex}],${f(targetSpeed)})`;
        const lock = _nextGuardAndNot(behavior);
        if (lock === null) {
          buffer += `, lock = (t<${f(duration)} && cars[${carIndex}].speed<${f(
            targetSpeed
          )})`;
        } else {
          buffer += `, lock = ${lock}`;
        }
      } else if (behavior.name === BEHAVIOR_TYPES.DECELERATE) {
        // *acceleration, *target speed, duration
        buffer += `, cars[${carIndex}].acceleration = ${f(acceleration)}`;
        buffer += `, speedDown(cars[${carIndex}],${f(targetSpeed)})`;
        const lock = _nextGuardAndNot(behavior);
        if (lock === null) {
          buffer += `, lock = (t<${f(duration)} && cars[${carIndex}].speed>${f(
            targetSpeed
          )})`;
        } else {
          buffer += `, lock = ${lock}`;
        }
      } else if (behavior.name === BEHAVIOR_TYPES.KEEP) {
        // duration
        // , keep(cars[0])
        //, lock=(t<5)
        buffer += `, keep(cars[${carIndex}])`;
        const lock = _nextGuardAndNot(behavior);
        if (lock === null) {
          buffer += `, lock = (t<${f(duration)})`;
        } else {
          buffer += `, lock = ${lock}`;
        }
      } else if (behavior.name === BEHAVIOR_TYPES.TURN_LEFT) {
        // *acceleration, *target speed
        buffer += `, cars[${carIndex}].acceleration = ${f(acceleration)}`;
        buffer += `, turnLeft(cars[${carIndex}])`;
        // buffer += `, lock = (cars[${carIndex}].speed<${f(targetSpeed)})`;
        buffer += `, lock = false`;
      } else if (behavior.name === BEHAVIOR_TYPES.TURN_RIGHT) {
        // *acceleration, *target speed
        buffer += `, cars[${carIndex}].acceleration = ${f(acceleration)}`;
        buffer += `, turnRight(cars[${carIndex}])`;
        // buffer += `, lock = (cars[${carIndex}].speed<${f(targetSpeed)})`;
        buffer += `, lock = false`;
      } else if (behavior.name === BEHAVIOR_TYPES.CHANGE_LEFT) {
        // acceleration, target speed
        targetSpeed = targetSpeed === INT16_MAX / K ? -1 / K : targetSpeed;
        buffer += `, cars[${carIndex}].acceleration = ${f(acceleration)}`;
        buffer += `, changeLeft(cars[${carIndex}], ${f(targetSpeed)})`;
        // buffer += `, lock = (cars[${carIndex}].speed<${f(targetSpeed)})`;
        buffer += `, lock = false`;
      } else if (behavior.name === BEHAVIOR_TYPES.CHANGE_RIGHT) {
        // acceleration, target speed
        targetSpeed = targetSpeed === INT16_MAX / K ? -1 / K : targetSpeed;
        buffer += `, cars[${carIndex}].acceleration = ${f(acceleration)}`;
        buffer += `, changeRight(cars[${carIndex}], ${f(targetSpeed)})`;
        // buffer += `, lock = (cars[${carIndex}].speed<${f(targetSpeed)})`;
        buffer += `, lock = false`;
      } else if (behavior.name === BEHAVIOR_TYPES.IDLE) {
        // duration
        buffer += `, cars[${carIndex}].speed = 0)`;
        // buffer += `, lock = (cars[${carIndex}].speed<${f(targetSpeed)})`;
        buffer += `, lock = (t<${f(duration)})`;
      } else if (behavior.name === BEHAVIOR_TYPES.LANE_OFFSET) {
        // *offset, acceleration, target speed, duration
        buffer += `, lock = false`;
      }
      return buffer;
    };

    /**
     * 2.7.3 The AND NOT of the guard condition behind; return null if there is no condition
     * @param behavior Behavior
     */
    const _nextGuardAndNot = (behavior: Behavior) => {
      const level = behavior.level;
      const group = behavior.group;
      let existGuard = false;

      const commonTransitions = behavior.nextTransitions;

      if (commonTransitions.length === 0) {
        return "true";
      }

      let buffer = "!(true";
      for (const commonTransition of commonTransitions) {
        // Find all the transitions behind and perform "&&" operation
        if (
          level === commonTransition.level &&
          group === commonTransition.group
        ) {
          if (commonTransition.guard !== null) {
            existGuard = true;
            buffer += _addGuard(commonTransition.guard);
          }
        }
      }

      buffer += ")";

      if (!existGuard) {
        return null;
      }

      return buffer;
    };

    const behaviors = cars[carIndex].mTree.behaviors;
    for (const behavior of behaviors) {
      _resolveBehavior(behavior);
    }
  };

  /**
   * 2.8 Transition to End, receive an End signal, and end when an error occurs
   */
  const _addTransitionToEnd = () => {
    const behaviorMap = new Map<number, number>();
    for (const behavior of cars[carIndex].mTree.behaviors) {
      if (behaviorMap.has(behavior.id)) {
        continue;
      }
      behaviorMap.set(behavior.id, 1);
      wrapper.buffer += "\t\t<transition>\n";
      wrapper.buffer += `\t\t\t<source ref="id${behavior.id}"/>\n`;
      wrapper.buffer += `\t\t\t<target ref="id${endId}"/>\n`;
      wrapper.buffer += `\t\t\t<label kind="synchronisation">${scenarioEndTrigger}?</label>\n`;
      wrapper.buffer += "\t\t</transition>\n";
    }
  };

  wrapper.buffer += "\t<template>\n";

  _addName();
  _addLocalDeclaration();
  _addLocations();
  _addBranchPoints();
  _addInit();
  _addTransitions();
  _addSelfTransitions();
  _addTransitionToEnd();

  wrapper.buffer += "\t</template>\n";
};

/**
 * EndTrigger automaton, used to detect safety
 * @param _e Event
 * @param wrapper buffer
 */
const _addEndTrigger = (_e: any, wrapper: { buffer: string }) => {
  const definedContent = readFile(
    _e,
    path.resolve(__filename, END_TRIGGER_PATH)
  );
  let endGuard = _resolveGuard(_e, scenarioEndTrigger);
  if (endGuard === "") {
    endGuard = "false";
  } else {
    endGuard = "(true " + endGuard + ")";
  }
  wrapper.buffer += definedContent.replace(
    new RegExp("%placeholder%", "gm"),
    endGuard
  );
};

/**
 * 3 Corresponding to the system part, that is, the system template declaration
 * @param _e Event
 * @param wrapper buffer
 */
const _addSystem = (_e: any, wrapper: { buffer: string }) => {
  wrapper.buffer += "\t<system>\n";
  wrapper.buffer += "system Timer";
  for (const car of cars) {
    wrapper.buffer += `, ${car.name}`;
  }
  wrapper.buffer += ", EndTrigger;\n";
  wrapper.buffer += "\t</system>\n";
};

/**
 * 4 Corresponding to the queries part, that is, the property specification
 * @param _e Event
 * @param wrapper buffer
 */
const _addQueries = (_e: any, wrapper: { buffer: string }) => {
  /**
   * 4.1 Add a query
   */
  const _addQuery = () => {
    wrapper.buffer += "\t\t<query>\n";
    wrapper.buffer += "\t\t\t<formula>";
    // This is the content of formula
    wrapper.buffer += "</formula>\n";
    wrapper.buffer += "\t\t\t<comment>";
    // This is the content of comment
    wrapper.buffer += "</comment>\n";
    wrapper.buffer += "\t\t</query>\n";
  };

  wrapper.buffer += "\t<queries>\n";
  _addQuery();
  wrapper.buffer += "\t</queries>\n";
};

/**
 * Corresponding to a whole part of nta, the XML header is followed by this big block, covering parts 1234
 * @param _e Event
 * @param buffer buffer
 * @returns buffer
 */
const addNta = (_e: any, buffer: string) => {
  let wrapper = {
    buffer: buffer + "<nta>\n",
  };
  _addDeclaration(_e, wrapper);
  _addTimer(_e, wrapper);
  for (let i = 0; i < cars.length; i++) {
    _addTemplate(_e, wrapper, i);
  }
  _addEndTrigger(_e, wrapper);
  _addSystem(_e, wrapper);
  _addQueries(_e, wrapper);
  wrapper.buffer += "</nta>\n";
  return wrapper.buffer;
};

const initModel = (model: Model) => {
  cars = model.cars;
  map = model.map;
  timeStep = model.timeStep;
  scenarioEndTrigger = model.scenarioEndTrigger;
  carNameIndexMap = new Map<string, number>();
  for (let i = 0; i < cars.length; i++) {
    carNameIndexMap.set(cars[i].name, i);
  }
};

const writeXml = (_e: any, model: Model, outputPath: string) => {
  initModel(model);
  try {
    let buffer = "";
    buffer += XML_HEAD;
    buffer += UPPAAL_HEAD;
    buffer = addNta(_e, buffer);
    writeFileSync(outputPath, buffer);
  } catch (error: any) {
    _e?.sender.send("ui:onOpenNotification", "error", "Error", error.message);
  }
};

export default writeXml;
