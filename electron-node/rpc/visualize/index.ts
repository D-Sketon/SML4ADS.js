import "@hprose/rpc-node";
import { Client } from "@hprose/rpc-core";
import { XMLParser } from "fast-xml-parser";
import {
  XODRElevationProfileType,
  XODRGeometryType,
  XODRJunctionType,
  XODRLaneOffsetType,
  XODRLaneSectionType,
  XODRLateralProfileType,
  XODRLinkType,
  XODRRoadType,
  XODRTypeType,
} from "../../XODRTypes";
import { Road } from "./model/Road";
import { OpenDrive } from "./model/OpenDrive";
import { Neighbor, Predecessor, Successor } from "./model/RoadLink";
import { RoadType, Speed } from "./model/RoadType";
import { ElevationRecord } from "./model/RoadElevationProfile";
import { Crossfall, Shape, Superelevation } from "./model/RoadLateralProfile";
import {
  Lane,
  LaneBorder,
  LaneOffset,
  LaneSection,
  LaneWidth,
} from "./model/RoadLanes";
import { Connection, Junction, LaneLink } from "./model/Junction";
import readFile from "../../io/readFile";

async function visualize(
  _e: any,
  path: string,
  cars: any,
  port: number,
  host = "127.0.0.1"
) {
  try {
    // const content = readFile(_e, path);
    // const _parseRes = _parseXODR(content);
    // convertGettersToPlainObject(_parseRes);
    const client = new Client(`http://${host}:${port}/RPC`);
    return await client.invoke("visualization", [[path, cars]]);
  } catch (error: any) {
    console.error(error);
    _e?.sender.send("ui:onOpenNotification", "error", "Error", error.message);
  }
}

export default visualize;

function convertGettersToPlainObject(obj, seenObjects = new WeakSet()) {
  if (typeof obj !== "object" || obj === null) {
    return;
  }
  if (seenObjects.has(obj)) return;

  if (Array.isArray(obj)) {
    obj.map((item) => convertGettersToPlainObject(item, seenObjects));
    seenObjects.add(obj);
    return;
  }
  seenObjects.add(obj);
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const descriptor = Object.getOwnPropertyDescriptor(obj, key);

      if (descriptor && typeof descriptor.get === "function") {
        const tp = (() => descriptor.get.call(obj))();
        delete obj[key];
        obj[key] = tp;
      } else if(typeof obj[key] === 'object') {
        convertGettersToPlainObject(obj[key], seenObjects);
      }
    }
  }
}

function _parseXODR(input: string): OpenDrive {
  const openDrive = new OpenDrive();

  const parser = new XMLParser({
    attributeNamePrefix: "@_",
    textNodeName: "#text",
    ignoreAttributes: false,
    parseAttributeValue: true,
    allowBooleanAttributes: true,
  });
  const xodrObj = parser.parse(input);
  const openDriveObj = xodrObj.OpenDRIVE;
  const roadArray = openDriveObj.road
    ? Array.isArray(openDriveObj.road)
      ? openDriveObj.road
      : [openDriveObj.road]
    : [];
  const junctionArray = openDriveObj.junction
    ? Array.isArray(openDriveObj.junction)
      ? openDriveObj.junction
      : [openDriveObj.junction]
    : [];

  for (let i = 0; i < junctionArray.length; i++) {
    _parseJunction(junctionArray[i], openDrive);
  }
  for (let i = 0; i < roadArray.length; i++) {
    _parseRoad(roadArray[i], openDrive);
  }
  return openDrive;
}

function _parseRoad(roadNode: XODRRoadType, openDrive: OpenDrive) {
  const road = new Road();

  road.id = Number(roadNode["@_id"]);
  road.name = roadNode["@_name"];

  const junctionId = Number(roadNode["@_junction"]);
  if (junctionId !== -1) {
    road.junction = openDrive.getJunction(junctionId);
  }
  road.length = Number(roadNode["@_length"]);

  // Link
  const roadLink = roadNode.link;
  if (roadLink) {
    _parseRoadLink(road, roadLink);
  }

  // Type
  let types = roadNode.type;
  if (types) {
    if (!Array.isArray(types)) types = [types];
    for (const roadType of types) {
      _parseRoadType(road, roadType);
    }
  }

  // Plan view
  let geometries = roadNode.planView.geometry;
  if (!Array.isArray(geometries)) geometries = [geometries];
  for (const roadGeometry of geometries) {
    _parseRoadGeometry(road, roadGeometry);
  }

  // Elevation profile
  const roadElevationProfile = roadNode.elevationProfile;
  if (roadElevationProfile) {
    _parseRoadElevationProfile(road, roadElevationProfile);
  }

  // Lateral profile
  const roadLateralProfile = roadNode.lateralProfile;
  if (roadLateralProfile) {
    _parseRoadLateralProfile(road, roadLateralProfile);
  }

  // Lane offset
  let laneOffset = roadNode.lanes.laneOffset;
  if (!Array.isArray(laneOffset)) laneOffset = [laneOffset];
  for (const roadLaneOffset of laneOffset) {
    _parseRoadLaneOffset(road, roadLaneOffset);
  }

  // Lane sections
  let laneSection = roadNode.lanes.laneSection;
  if (!Array.isArray(laneSection)) laneSection = [laneSection];
  for (let i = 0; i < laneSection.length; i++) {
    _parseRoadLaneSection(road, i, laneSection[i]);
  }

  _calculateLaneSectionLengths(road);
  openDrive.roads.push(road);
}

function _parseRoadLink(road: Road, roadLink: XODRLinkType) {
  const predecessor = roadLink.predecessor;
  if (predecessor) {
    road.link.predecessor = new Predecessor(
      predecessor["@_elementType"],
      predecessor["@_elementId"],
      predecessor["@_contactPoint"]
    );
  }
  const successor = roadLink.successor;
  if (successor) {
    road.link.successor = new Successor(
      successor["@_elementType"],
      successor["@_elementId"],
      successor["@_contactPoint"]
    );
  }
  const neighbor = roadLink.neighbor;
  if (neighbor) {
    for (const n of neighbor) {
      road.link.neighbors.push(
        new Neighbor(n["@_side"], n["@_elementId"], n["@_direction"])
      );
    }
  }
}

function _parseRoadType(road: Road, roadType: XODRTypeType) {
  let speed;
  if (roadType.speed) {
    speed = new Speed(roadType.speed["@_max"], roadType.speed["@_unit"]);
  }
  road.types.push(new RoadType(roadType["@_s"], roadType["@_type"], speed));
}

function _parseRoadGeometry(road: Road, roadGeometry: XODRGeometryType) {
  const startCoord = [Number(roadGeometry["@_x"]), Number(roadGeometry["@_y"])];
  if (roadGeometry.line) {
    road.planView.addLine(
      startCoord,
      Number(roadGeometry["@_hdg"]),
      Number(roadGeometry["@_length"])
    );
  } else if (roadGeometry.spiral) {
    road.planView.addSpiral(
      startCoord,
      Number(roadGeometry["@_hdg"]),
      Number(roadGeometry["@_length"]),
      Number(roadGeometry.spiral!["@_curvStart"]),
      Number(roadGeometry.spiral!["@_curvEnd"])
    );
  } else if (roadGeometry.arc) {
    road.planView.addArc(
      startCoord,
      Number(roadGeometry["@_hdg"]),
      Number(roadGeometry["@_length"]),
      Number(roadGeometry.arc!["@_curvature"])
    );
  } else if (roadGeometry.poly3) {
    road.planView.addPoly3(
      startCoord,
      Number(roadGeometry["@_hdg"]),
      Number(roadGeometry["@_length"]),
      Number(roadGeometry.poly3!["@_a"]),
      Number(roadGeometry.poly3!["@_b"]),
      Number(roadGeometry.poly3!["@_c"]),
      Number(roadGeometry.poly3!["@_d"])
    );
  } else if (roadGeometry.paramPoly3) {
    let pMax: number | undefined = undefined;
    if (roadGeometry.paramPoly3!["@_pRange"]) {
      if (roadGeometry.paramPoly3!["@_pRange"] === "arcLength") {
        pMax = Number(roadGeometry["@_length"]);
      }
    }
    road.planView.addParamPoly3(
      startCoord,
      Number(roadGeometry["@_hdg"]),
      Number(roadGeometry["@_length"]),
      Number(roadGeometry.paramPoly3!["@_aU"]),
      Number(roadGeometry.paramPoly3!["@_bU"]),
      Number(roadGeometry.paramPoly3!["@_cU"]),
      Number(roadGeometry.paramPoly3!["@_dU"]),
      Number(roadGeometry.paramPoly3!["@_aV"]),
      Number(roadGeometry.paramPoly3!["@_bV"]),
      Number(roadGeometry.paramPoly3!["@_cV"]),
      Number(roadGeometry.paramPoly3!["@_dV"]),
      pMax
    );
  }
}

function _parseRoadElevationProfile(
  road: Road,
  roadElevationProfile: XODRElevationProfileType
) {
  let elevation = roadElevationProfile.elevation;
  if (!Array.isArray(elevation)) elevation = [elevation];
  for (const e of elevation) {
    road.elevationProfile.elevations.push(
      new ElevationRecord(
        [
          Number(e["@_s"]),
          Number(e["@_a"]),
          Number(e["@_b"]),
          Number(e["@_c"]),
          Number(e["@_d"]),
        ],
        Number(e["@_s"])
      )
    );
  }
}

function _parseRoadLateralProfile(
  road: Road,
  roadLateralProfile: XODRLateralProfileType
) {
  let superElevation = roadLateralProfile.superelevation;
  if (superElevation) {
    if (!Array.isArray(superElevation)) superElevation = [superElevation];
    for (const s of superElevation) {
      road.lateralProfile.superelevations.push(
        new Superelevation(
          [
            Number(s["@_s"]),
            Number(s["@_a"]),
            Number(s["@_b"]),
            Number(s["@_c"]),
            Number(s["@_d"]),
          ],
          Number(s["@_s"])
        )
      );
    }
  }
  let crossfall = roadLateralProfile.crossfall;
  if (crossfall) {
    if (!Array.isArray(crossfall)) crossfall = [crossfall];
    for (const c of crossfall) {
      road.lateralProfile.crossfalls.push(
        new Crossfall(
          [
            Number(c["@_s"]),
            Number(c["@_a"]),
            Number(c["@_b"]),
            Number(c["@_c"]),
            Number(c["@_d"]),
          ],
          Number(c["@_s"]),
          c["@_side"] as "left" | "right" | "both"
        )
      );
    }
  }
  let shape = roadLateralProfile.shape;
  if (shape) {
    if (!Array.isArray(shape)) shape = [shape];
    for (const s of shape) {
      road.lateralProfile.shapes.push(
        new Shape(
          [
            Number(s["@_s"]),
            Number(s["@_a"]),
            Number(s["@_b"]),
            Number(s["@_c"]),
            Number(s["@_d"]),
          ],
          Number(s["@_s"]),
          Number(s["@_t"])
        )
      );
    }
  }
}

function _parseRoadLaneOffset(road: Road, roadLaneOffset: XODRLaneOffsetType) {
  road.lanes.laneOffsets.push(
    new LaneOffset(
      [
        Number(roadLaneOffset["@_a"]),
        Number(roadLaneOffset["@_b"]),
        Number(roadLaneOffset["@_c"]),
        Number(roadLaneOffset["@_d"]),
      ],
      Number(roadLaneOffset["@_s"])
    )
  );
}

function _parseRoadLaneSection(
  road: Road,
  laneSectionIndex: number,
  roadLaneSection: XODRLaneSectionType
) {
  const newLaneSection = new LaneSection(road);
  newLaneSection.idx = laneSectionIndex;
  newLaneSection.sPos = Number(roadLaneSection["@_s"]);
  newLaneSection.singleSide =
    typeof roadLaneSection["@_singleSide"] === "boolean"
      ? roadLaneSection["@_singleSide"]
      : roadLaneSection["@_singleSide"] === "true"
      ? true
      : false;

  const sides = {
    left: newLaneSection.leftLanes,
    center: newLaneSection.centerLanes,
    right: newLaneSection.rightLanes,
  };
  for (let sideTag in sides) {
    const newSideLanes = sides[sideTag] as Lane[];
    let lanes = roadLaneSection[sideTag as "left" | "center" | "right"]?.lane;
    if (!lanes) continue;
    if (!Array.isArray(lanes)) lanes = [lanes];
    for (const lane of lanes) {
      const newLane = new Lane(road, newLaneSection);
      newLane.id = Number(lane["@_id"]);
      newLane.type = lane["@_type"] as any;
      newLane.level = [1, "1", "true", true].includes(lane["@_level"])
        ? true
        : false;

      // Lane Links
      if (lane.link) {
        if (lane.link.predecessor) {
          newLane.link.predecessorId = Number(lane.link.predecessor["@_id"]);
        }
        if (lane.link.successor) {
          newLane.link.successorId = Number(lane.link.successor["@_id"]);
        }
      }

      // Width
      if (lane.width) {
        let widths = lane.width;
        if (!Array.isArray(widths)) widths = [widths];
        for (let i = 0; i < widths.length; i++) {
          const width = widths[i];
          newLane.widths.push(
            new LaneWidth(
              [
                Number(width["@_a"]),
                Number(width["@_b"]),
                Number(width["@_c"]),
                Number(width["@_d"]),
              ],
              i,
              Number(width["@_sOffset"])
            )
          );
        }
      }

      // Border
      if (lane.border) {
        let borders = lane.border;
        if (!Array.isArray(borders)) borders = [borders];
        for (let i = 0; i < borders.length; i++) {
          const border = borders[i];
          newLane.borders.push(
            new LaneBorder(
              [
                Number(border["@_a"]),
                Number(border["@_b"]),
                Number(border["@_c"]),
                Number(border["@_d"]),
              ],
              i,
              Number(border["@_sOffset"])
            )
          );
        }
      }

      if (lane.width && !lane.border) {
        newLane.widths = newLane.borders;
        newLane.hasBorderRecord = true;
      }

      newSideLanes.push(newLane);
    }
  }
  road.lanes.lane_sections.push(newLaneSection);
}

function _calculateLaneSectionLengths(road: Road) {
  for (const laneSection of road.lanes.lane_sections) {
    if (laneSection.idx + 1 >= road.lanes.lane_sections.length) {
      laneSection.length = road.planView.length - laneSection.sPos;
    } else {
      laneSection.length =
        road.lanes.lane_sections[laneSection.idx + 1].sPos - laneSection.sPos;
    }
  }
  for (const laneSection of road.lanes.lane_sections) {
    for (const lane of laneSection.allLanes) {
      const widthsPoses = [
        ...lane.widths.map((x) => x.start_pos!),
        laneSection.length,
      ];

      const widthsLengths = widthsPoses
        .slice(1)
        .map((pos, idx) => pos - widthsPoses[idx]);

      for (let widthIdx = 0; widthIdx < lane.widths.length; widthIdx++) {
        lane.widths[widthIdx].length = widthsLengths[widthIdx];
      }
    }
  }
}

function _parseJunction(junctionNode: XODRJunctionType, openDrive: OpenDrive) {
  const newJunction = new Junction();
  newJunction.id = Number(junctionNode["@_id"]);
  newJunction.name = junctionNode["@_name"];

  let connections = junctionNode.connection;
  if (!Array.isArray(connections)) connections = [connections];
  for (const connection of connections) {
    const newConnection = new Connection();
    newConnection.id = Number(connection["@_id"]);
    newConnection.incomingRoad = Number(connection["@_incomingRoad"]);
    newConnection.connectingRoad = Number(connection["@_connectingRoad"]);
    newConnection.contactPoint = connection["@_contactPoint"];

    let laneLinks = connection.laneLink;
    if (!Array.isArray(laneLinks)) laneLinks = [laneLinks];
    for (const laneLink of laneLinks) {
      const newLaneLink = new LaneLink();
      newLaneLink.from = Number(laneLink["@_from"]);
      newLaneLink.to = Number(laneLink["@_to"]);
      newConnection.addLaneLink(newLaneLink);
    }
    newJunction.connections.push(newConnection);
  }
  openDrive.junctions.push(newJunction);
}
