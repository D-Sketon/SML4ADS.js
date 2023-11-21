import { Connection } from "./model/Connection";
import { ELEMENT_TYPES } from "./model/ElementType";
import { Junction } from "./model/Junction";
import { LANE_CHANGE_TYPES, Lane } from "./model/Lane";
import { LaneLink } from "./model/LaneLink";
import { LaneSection } from "./model/LaneSection";
import { Road } from "./model/Road";
import { XMLParser } from "fast-xml-parser";
import {
  XODRRoadType,
  XODRLaneSectionType,
  XODRLaneType,
  XODRJunctionType,
  XODRConnectionType,
  XODRLaneLinkType,
} from "./types";
import { MapDataContainer } from "./model/MapDataContainer";

// id -> index
let roadMap: Map<number, number>;
let laneSectionMap: Map<number, number>;
let laneMap: Map<number, number>;
let junctionMap: Map<number, number>;

let roadIndex: number = 0;
let laneSectionIndex: number = 0;
let laneIndex: number = 0;
let junctionIndex: number = 0;
let connectionIndex: number = 0;
let laneLinkIndex: number = 0;

let laneSectionId: number = 0;
let laneSingleId: number = 0;

const parseXodr = (input: string) => {
  const roads: Road[] = [];
  const junctions: Junction[] = [];
  const laneSections: LaneSection[] = [];
  const lanes: Lane[] = [];
  const connections: Connection[] = [];
  const laneLinks: LaneLink[] = [];

  roadMap = new Map();
  laneSectionMap = new Map();
  laneMap = new Map();
  junctionMap = new Map();

  laneSectionId = 0;
  laneSingleId = 0;

  roadIndex = 0;
  laneSectionIndex = 0;
  laneIndex = 0;
  junctionIndex = 0;
  connectionIndex = 0;
  laneLinkIndex = 0;

  const parser = new XMLParser({
    preserveOrder: true,
    attributeNamePrefix: "@_",
    textNodeName: "#text",
    ignoreAttributes: false,
    parseAttributeValue: true,
    allowBooleanAttributes: true,
  });
  const xodrObj = parser.parse(input);
  const openDriveObj = xodrObj.OpenDRIVE;
  const roadArray = Array.isArray(openDriveObj.road)
    ? openDriveObj.road
    : [openDriveObj.road];
  const junctionArray = Array.isArray(openDriveObj.junction)
    ? openDriveObj.junction
    : [openDriveObj.junction];
  for (let i = 0; i < roadArray.length; i++) {
    parseRoad(roadArray[i], roads, laneSections, lanes);
  }
  for (let i = 0; i < junctionArray.length; i++) {
    parseJunction(junctionArray[i], junctions, connections, laneLinks);
  }
  initIndex(roads, laneSections, lanes, junctions, connections, laneLinks);
  return new MapDataContainer(roads, junctions, laneSections, lanes, connections, laneLinks);
};

const initIndex = (
  roads: Road[],
  laneSections: LaneSection[],
  lanes: Lane[],
  junctions: Junction[],
  connections: Connection[],
  laneLinks: LaneLink[]
) => {
  initRoad(roads);
  initLane(lanes, laneSections, roads);
  initConnection(connections, junctions, roads);
};

const initRoad = (roads: Road[]) => {
  for (const road of roads) {
    road.junctionIndex = junctionMap.get(road.junctionId) ?? -1;
    if (road.predecessorElementType === ELEMENT_TYPES.ROAD) {
      road.predecessorIndex = roadMap.get(road.predecessorId) ?? -1;
    } else if (road.predecessorElementType === ELEMENT_TYPES.JUNCTION) {
      road.predecessorIndex = junctionMap.get(road.predecessorId) ?? -1;
    } else {
      road.predecessorIndex = -1;
    }
    if (road.successorElementType === ELEMENT_TYPES.ROAD) {
      road.successorIndex = roadMap.get(road.successorId) ?? -1;
    } else if (road.successorElementType === ELEMENT_TYPES.JUNCTION) {
      road.successorIndex = junctionMap.get(road.successorId) ?? -1;
    } else {
      road.successorIndex = -1;
    }
  }
};

const initLane = (
  lanes: Lane[],
  laneSections: LaneSection[],
  roads: Road[]
) => {
  for (const lane of lanes) {
    const currentRoad = roads[lane.roadIndex];
    const currentLaneSection = laneSections[lane.laneSectionIndex];

    /**
     * Predecessor:
     * 1. The current laneSection is not the first lane section of the current road, then
     * - The index-1 of the current laneSection, that is, the previous laneSection, finds the corresponding predecessorLaneId
     * 2. The current laneSection is the first lane section of the current road, then
     * - Find the predecessor road of the current road, and determine whether the predecessorLaneId belongs to the first or last lane section of the predecessor road according to the connection method of the two roads
     */
    if (lane.predecessorLaneId !== 0) {
      let preLaneSection: LaneSection | null = null;
      if (currentLaneSection.startPosition !== 0) {
        // Not the first lane section
        preLaneSection = laneSections[currentLaneSection.index - 1];
      } else {
        // The first lane section
        const preRoadId = currentRoad.predecessorId;
        if (!roadMap.has(preRoadId)) {
          // Map error
          console.error(
            `找不到road(id=${currentRoad.roadId})的前驱road(id=${preRoadId})`
          );
        } else {
          const preRoad = roads[roadMap.get(preRoadId)!]; // If it is Junction?
          const connectType = 0; // TODO: The connection method of the two roads affects whether the previous laneSection is the first or last of preRoad
          if (connectType === 0) {
            // The first
            preLaneSection = preRoad.laneSections[0];
          } else {
            // The last
            const length = preRoad.laneSections.length;
            preLaneSection = preRoad.laneSections[length - 1];
          }
        }
      }
      if (preLaneSection !== null) {
        updatePreLaneIndex(lane, preLaneSection);
      }
    }

    /**
     * Successor:
     * 1. The current laneSection is not the last lane section of the current road, then
     * - The index+1 of the current laneSection, that is, the next laneSection, finds the corresponding successorLaneId
     * 2. The current laneSection is the last lane section of the current road, then
     * - Find the successor road of the current road, and determine whether the successorLaneId belongs to the first or last lane section of the successor road according to the connection method of the two roads
     */
    if (lane.successorLaneId !== 0) {
      let sucLaneSection: LaneSection | null = null;
      // The last lane section
      const lastIndex = currentRoad.laneSections.length - 1;
      const lastLaneSection = currentRoad.laneSections[lastIndex];

      if (currentLaneSection.startPosition !== lastLaneSection.startPosition) {
        // Not the last lane section
        sucLaneSection = laneSections[currentLaneSection.index + 1];
      } else {
        // The last lane section
        const sucRoadId = currentRoad.successorId;
        if (!roadMap.has(sucRoadId)) {
          // Map error
          console.error(
            `找不到road(id=${currentRoad.roadId})的后继road(id=${sucRoadId})`
          );
        } else {
          const sucRoad = roads[roadMap.get(sucRoadId)!];
          const connectType = 0; // TODO: The connection method of the two roads affects whether the previous laneSection is the first or last of preRoad
          if (connectType === 0) {
            // The first
            sucLaneSection = sucRoad.laneSections[0];
          } else {
            // The last
            const length = sucRoad.laneSections.length;
            sucLaneSection = sucRoad.laneSections[length - 1];
          }
        }
      }
      if (sucLaneSection !== null) {
        updateSucLaneIndex(lane, sucLaneSection);
      }
    }
  }
};

const updatePreLaneIndex = (lane: Lane, preLaneSection: LaneSection) => {
  for (const preLane of preLaneSection.lanes) {
    if (preLane.laneId === lane.predecessorLaneId) {
      lane.predecessorSingleId = preLane.singleId;
      lane.predecessorIndex = preLane.index;
      break;
    }
  }
}

const updateSucLaneIndex = (lane: Lane, sucLaneSection: LaneSection) => {
  for (const sucLane of sucLaneSection.lanes) {
    if (sucLane.laneId === lane.successorLaneId) {
      lane.successorSingleId = sucLane.singleId;
      lane.successorIndex = sucLane.index;
      break;
    }
  }
}

const initConnection = (
  connections: Connection[],
  junctions: Junction[],
  roads: Road[]
) => {
  // connection: incomingRoadIndex, connectionRoadIndex
  for (const connection of connections) {
    connection.incomingRoadIndex = roadMap.get(connection.incomingRoadId) ?? -1;
    connection.connectingRoadIndex =
      roadMap.get(connection.connectingRoadId) ?? -1;
  }

  // Set direction
  for (const road of roads) {
    if (road.junctionId !== -1) {
      let direction = 1; // 1 left turn 2 straight 3 right turn, others are not normal and ignored
      for (const junction of junctions) {
        for (const connection of junction.connections) {
          if (connection.connectingRoadId === road.roadId) {
            connection.direction = direction++;
          }
        }
      }
    }
  }
}

const parseRoad = (
  roadElement: XODRRoadType,
  roads: Road[],
  laneSections: LaneSection[],
  lanes: Lane[]
) => {
  const road = new Road();
  //    int elementType;
  road.elementType = ELEMENT_TYPES.ROAD;
  //    int roadId;
  road.roadId = parseInt(roadElement["@_id"] + "");
  road.index = roadIndex;
  roadMap.set(road.roadId, roadIndex++);

  //    int junctionId;
  road.junctionId = parseInt(roadElement["@_junction"] + "");
  //    int length;
  road.length = parseFloat(roadElement["@_length"] + "");
  //    int predecessorElementType;
  //    int successorElementType;
  const link = roadElement.link;

  const predecessor = link.predecessor;
  const elementId = parseInt(predecessor["@_elementId"] + "") ?? -1;
  const elementType = predecessor["@_elementType"];
  road.predecessorElementType =
    elementType.toLowerCase() === "road"
      ? ELEMENT_TYPES.ROAD
      : elementType.toLowerCase() === "junction"
      ? ELEMENT_TYPES.JUNCTION
      : ELEMENT_TYPES.NONE;
  road.predecessorId = elementId;

  const successor = link.successor;
  const successorElementId = parseInt(successor["@_elementId"] + "") ?? -1;
  const successorElementTypeStr = successor["@_elementType"];
  road.successorElementType =
    successorElementTypeStr.toLowerCase() === "road"
      ? ELEMENT_TYPES.ROAD
      : elementType.toLowerCase() === "junction"
      ? ELEMENT_TYPES.JUNCTION
      : ELEMENT_TYPES.NONE;
  road.successorId = successorElementId;

  //    int maxSpeed;
  const type = roadElement.type;
  road.maxSpeed = parseInt(type.speed["@_max"] + "");

  //    laneSections
  const laneSectionList = roadElement.lanes.laneSection;
  parseLaneSection(
    Array.isArray(laneSectionList) ? laneSectionList : [laneSectionList],
    road,
    laneSections,
    lanes
  );

  roads.push(road);
};

const parseLaneSection = (
  laneSectionList: XODRLaneSectionType[],
  road: Road,
  laneSections: LaneSection[],
  lanes: Lane[]
) => {
  const roadLaneSections: LaneSection[] = [];
  const laneSectionsIndex: number[] = [];
  for (let laneSectionElement of laneSectionList) {
    const laneSection = new LaneSection();
    //  private int elementType;
    laneSection.elementType = ELEMENT_TYPES.LANE_SECTION;
    //  private int roadIndex;
    laneSection.roadIndex = road.index;
    //  private int roadId;
    laneSection.roadId = road.roadId;
    //  private int laneSectionId;
    laneSection.laneSectionId = laneSectionId;
    laneSection.index = laneIndex;
    laneSectionsIndex.push(laneSectionIndex);
    laneSectionMap.set(laneSectionId++, laneSectionIndex++);

    //  private int startPosition;
    laneSection.startPosition = parseFloat(laneSectionElement["@_s"] + "");

    //  private int length;
    laneSection.length = 0;

    // lanes
    parseLane(laneSectionElement.left.lane, laneSection, lanes);
    parseLane(laneSectionElement.center.lane, laneSection, lanes);
    parseLane(laneSectionElement.right.lane, laneSection, lanes);

    roadLaneSections.push(laneSection);
    laneSections.push(laneSection);
  }
  road.laneSectionsIndex = laneSectionsIndex;
  road.laneSections = roadLaneSections;
};

const parseLane = (
  _laneList: XODRLaneType | XODRLaneType[],
  laneSection: LaneSection,
  lanes: Lane[]
) => {
  const laneList = Array.isArray(_laneList) ? _laneList : [_laneList];
  const laneSectionLanes: Lane[] = [];
  const lanesIndex: number[] = [];
  for (let laneElement of laneList) {
    const lane = new Lane();
    //  private int elementType;
    lane.elementType = ELEMENT_TYPES.LANE;
    //  private int roadIndex;
    lane.roadIndex = laneSection.roadIndex;
    //  private int roadId;
    lane.roadId = laneSection.roadId;
    //  private int laneSectionIndex;
    lane.laneSectionIndex = laneSection.index;
    //  private int laneSectionId;
    lane.laneSectionId = laneSection.laneSectionId;
    //  private int laneId;
    lane.laneId = parseInt(laneElement["@_id"] + "");

    lane.singleId = laneSingleId;
    lane.index = laneIndex;
    lanesIndex.push(laneIndex);
    laneMap.set(laneSingleId++, laneIndex++);

    //  private int type;
    const type = laneElement["@_type"];
    if (type === "driving") {
      lane.type = 1;
    } else {
      lane.type = 0;
    }

    //  private int predecessorIndex;
    //  private int predecessorLaneId;
    //  private int predecessorId;
    const predecessor = laneElement.link?.predecessor;
    lane.predecessorLaneId = predecessor
      ? parseInt(predecessor["@_id"] + "")
      : 0;

    //  private int successorIndex;
    //  private int successorLaneId;
    //  private int successorId;
    const successor = laneElement.link?.successor;
    lane.successorLaneId = successor ? parseInt(successor["@_id"] + "") : 0;

    //  private int laneChange;
    const laneChange = laneElement.roadMark?.["@_laneChange"];
    lane.laneChange = laneChange ? LANE_CHANGE_TYPES[laneChange] ?? 0 : 0;

    //  width
    const widthElement = laneElement.width?.["@_a"];
    let width = widthElement ? parseFloat(widthElement + "") : 0;
    lane.width = width;

    laneSectionLanes.push(lane);
    lanes.push(lane);
  }
  laneSection.lanesIndex = lanesIndex;
  laneSection.lanes = laneSectionLanes;
};

const parseJunction = (
  junctionElement: XODRJunctionType,
  junctions: Junction[],
  connections: Connection[],
  laneLinks: LaneLink[]
) => {
  const junction = new Junction();
  //  private int elementType;
  junction.elementType = ELEMENT_TYPES.JUNCTION;
  //  private int junctionId;
  junction.junctionId = parseInt(junctionElement["@_id"] + "");
  junction.index = junctionIndex;
  junctionMap.set(junction.junctionId, junctionIndex++);

  //  connections
  const connectionList = junctionElement.connection;
  parseConnection(
    Array.isArray(connectionList) ? connectionList : [connectionList],
    junction,
    connections,
    laneLinks
  );
  junctions.push(junction);
};

const parseConnection = (
  connectionList: XODRConnectionType[],
  junction: Junction,
  connections: Connection[],
  laneLinks: LaneLink[]
) => {
  const junctionConnections: Connection[] = [];
  const connectionsIndex: number[] = [];
  for (let connectionElement of connectionList) {
    const connection = new Connection();

    connection.incomingRoadId = parseInt(
      connectionElement["@_incomingRoad"] + ""
    );
    connection.connectingRoadId = parseInt(
      connectionElement["@_connectingRoad"] + ""
    );

    connection.index = connectionIndex;
    connectionsIndex.push(connectionIndex++);

    const laneLinkList = connectionElement.laneLink;
    parseLaneLink(
      Array.isArray(laneLinkList) ? laneLinkList : [laneLinkList],
      connection,
      laneLinks
    );

    connections.push(connection);
    junctionConnections.push(connection);
  }
  junction.connectionsIndex = connectionsIndex;
  junction.connections = junctionConnections;
};

const parseLaneLink = (
  laneLinkList: XODRLaneLinkType[],
  connection: Connection,
  laneLinks: LaneLink[]
) => {
  const connectionLaneLinks: LaneLink[] = [];
  const laneLinksIndex: number[] = [];
  for (const laneLinkElement of laneLinkList) {
    const laneLink = new LaneLink();

    laneLink.from = parseInt(laneLinkElement["@_from"] + "");
    laneLink.to = parseInt(laneLinkElement["@_to"] + "");

    laneLink.index = laneLinkIndex;
    laneLinksIndex.push(laneLinkIndex++);

    laneLinks.push(laneLink);
    connectionLaneLinks.push(laneLink);
  }
  connection.laneLinksIndex = laneLinksIndex;
  connection.laneLinks = connectionLaneLinks;
};

export default parseXodr;
