import { Connection } from "./Connection";
import { Junction } from "./Junction";
import { Lane } from "./Lane";
import { LaneLink } from "./LaneLink";
import { LaneSection } from "./LaneSection";
import { Road } from "./Road";

export class MapDataContainer {
  roads: Road[];
  junctions: Junction[];
  laneSections: LaneSection[];
  lanes: Lane[];
  connections: Connection[];
  laneLinks: LaneLink[];

  /**
   * Full constructor
   */
  constructor(
    roads: Road[],
    junctions: Junction[],
    laneSections: LaneSection[],
    lanes: Lane[],
    connections: Connection[],
    laneLinks: LaneLink[]
  ) {
    this.roads = roads;
    this.junctions = junctions;
    this.laneSections = laneSections;
    this.lanes = lanes;
    this.connections = connections;
    this.laneLinks = laneLinks;
  }
}
