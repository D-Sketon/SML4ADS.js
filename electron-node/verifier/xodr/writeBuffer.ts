import { Connection } from "./model/Connection";
import { Junction } from "./model/Junction";
import { Lane } from "./model/Lane";
import { LaneLink } from "./model/LaneLink";
import { LaneSection } from "./model/LaneSection";
import { MapDataContainer } from "./model/MapDataContainer";
import { Road } from "./model/Road";

let roads: Road[];
let junctions: Junction[];
let laneSections: LaneSection[];
let lanes: Lane[];
let connections: Connection[];
let laneLinks: LaneLink[];

const init = (container: MapDataContainer) => {
  roads = container.roads;
  junctions = container.junctions;
  laneSections = container.laneSections;
  lanes = container.lanes;
  connections = container.connections;
  laneLinks = container.laneLinks;
};

const writeBuffer = (container: MapDataContainer, wrapper: { buffer: string }) => {
  init(container);

  addRoad(wrapper);
  addLaneSection(wrapper);
  addLane(wrapper);
  addJunction(wrapper);
  addConnection(wrapper);
  addLaneLink(wrapper);
}

const addRoad = (wrapper: { buffer: string }) => {
  wrapper.buffer += `Road roads[${roads.length}] = {\n`;
  roads.forEach((road, index) => {
    wrapper.buffer += "{";
    wrapper.buffer += `${road.elementType},`;
    wrapper.buffer += `${road.roadId},`;
    wrapper.buffer += `${road.junctionIndex},`;
    wrapper.buffer += `${road.junctionId},`;
    wrapper.buffer += `${road.length},`;
    wrapper.buffer += `${road.predecessorElementType},`;
    wrapper.buffer += `${road.predecessorIndex},`;
    wrapper.buffer += `${road.successorElementType},`;
    wrapper.buffer += `${road.successorIndex},`;
    wrapper.buffer += `${road.maxSpeed},`;
    wrapper.buffer += "{";
    const laneSectionsIndex = road.laneSectionsIndex;
    const countOfLaneSection = Math.min(laneSectionsIndex.length, 2);
    wrapper.buffer += laneSectionsIndex[0];
    for (let i = 1; i < countOfLaneSection; i++) {
      wrapper.buffer += "," + i;
    }
    for (let i = countOfLaneSection; i < 2; i++) {
      wrapper.buffer += "," + (-1);
    }
    wrapper.buffer += "}";
    wrapper.buffer += "}" + (index === roads.length - 1 ? "" : ",") + "\n";
  });
  wrapper.buffer += "};\n";
}

const addLaneSection = (wrapper: { buffer: string }) => {
  wrapper.buffer += `LaneSection laneSections[${laneSections.length}] = {\n`;
  laneSections.forEach((laneSection, index) => {
    wrapper.buffer += "{";
    wrapper.buffer += `${laneSection.elementType},`;
    wrapper.buffer += `${laneSection.roadIndex},`;
    wrapper.buffer += `${laneSection.roadId},`;
    wrapper.buffer += `${laneSection.laneSectionId},`;
    wrapper.buffer += `${laneSection.startPosition},`;
    wrapper.buffer += "{";
    const lanesIndex = laneSection.lanesIndex;
    const countOfLane = Math.min(lanesIndex.length, 3);
    wrapper.buffer += lanesIndex[0];
    for (let i = 1; i < countOfLane; i++) {
      wrapper.buffer += "," + i;
    }
    for (let i = countOfLane; i < 3; i++) {
      wrapper.buffer += "," + (-1);
    }
    wrapper.buffer += "}";
    wrapper.buffer += "," + laneSection.length;
    wrapper.buffer += "}" + (index === laneSections.length - 1 ? "" : ",") + "\n";
  });
  wrapper.buffer += "};\n";
}

const addLane = (wrapper: { buffer: string }) => {
  wrapper.buffer += `Lane lanes[${lanes.length}] = {\n`;
  lanes.forEach((lane, index) => {
    wrapper.buffer += "{";
    wrapper.buffer += `${lane.elementType},`;
    wrapper.buffer += `${lane.roadId},`;
    wrapper.buffer += `${lane.roadIndex},`;
    wrapper.buffer += `${lane.laneSectionIndex},`;
    wrapper.buffer += `${lane.laneId},`;
    wrapper.buffer += `${lane.type},`;
    wrapper.buffer += `${lane.predecessorIndex},`;
    wrapper.buffer += `${lane.successorIndex},`;
    wrapper.buffer += `${lane.laneChange}`;
    wrapper.buffer += "}" + (index === lanes.length - 1 ? "" : ",") + "\n";
  });
  wrapper.buffer += "};\n";
}

const addJunction = (wrapper: { buffer: string }) => {
  if (junctions.length === 0) {
    wrapper.buffer += "Junction junctions[2];\n";
    return;
  }
  wrapper.buffer += `Junction junctions[${junctions.length}] = {\n`;
  junctions.forEach((junction, index) => {
    wrapper.buffer += "{";
    wrapper.buffer += `${junction.elementType},`;
    wrapper.buffer += `${junction.junctionId},`;
    wrapper.buffer += "{";
    const connectionsIndex = junction.connectionsIndex;
    const countOfConnection = Math.min(connectionsIndex.length, 4);
    wrapper.buffer += connectionsIndex[0];
    for (let i = 1; i < countOfConnection; i++) {
      wrapper.buffer += "," + i;
    }
    for (let i = countOfConnection; i < 4; i++) {
      wrapper.buffer += "," + (-1);
    }
    wrapper.buffer += "}";
    wrapper.buffer += "}" + (index === junctions.length - 1 ? "" : ",") + "\n";
  });
  wrapper.buffer += "};\n";
}

const addConnection = (wrapper: { buffer: string }) => {
  if (connections.length === 0) {
    wrapper.buffer += "Connection connections[2];\n";
    return;
  }
  wrapper.buffer += `Connection connections[${connections.length}] = {\n`;
  connections.forEach((connection, index) => {
    wrapper.buffer += "{";
    wrapper.buffer += `${connection.direction},`;
    wrapper.buffer += `${connection.incomingRoadId},`;
    wrapper.buffer += `${connection.connectingRoadId},`;
    wrapper.buffer += `${connection.incomingRoadIndex},`;
    wrapper.buffer += `${connection.connectingRoadIndex},`;
    wrapper.buffer += "{";
    const laneLinksIndex = connection.laneLinksIndex;
    const countOfLaneLink = Math.min(laneLinksIndex.length, 2);
    wrapper.buffer += laneLinksIndex[0];
    for (let i = 1; i < countOfLaneLink; i++) {
      wrapper.buffer += "," + i;
    }
    for (let i = countOfLaneLink; i < 2; i++) {
      wrapper.buffer += "," + (-1);
    }
    wrapper.buffer += "}";
    wrapper.buffer += "}" + (index === connections.length - 1 ? "" : ",") + "\n";
  });
  wrapper.buffer += "};\n";
}

const addLaneLink = (wrapper: { buffer: string }) => {
  if (laneLinks.length === 0) {
    wrapper.buffer += "LaneLink laneLinks[2];\n";
    return;
  }
  wrapper.buffer += `LaneLink laneLinks[${laneLinks.length}] = {\n`;
  laneLinks.forEach((laneLink, index) => {
    wrapper.buffer += "{";
    wrapper.buffer += `${laneLink.from},`;
    wrapper.buffer += `${laneLink.to}`;
    wrapper.buffer += "}" + (index === laneLinks.length - 1 ? "" : ",") + "\n";
  });
  wrapper.buffer += "};\n";
}

export default writeBuffer;
