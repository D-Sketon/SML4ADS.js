export type XODRLinkType = {
  predecessor?: {
    "@_elementType": string;
    "@_elementId": number | string;
    "@_contactPoint": string;
  };
  successor?: {
    "@_elementType": string;
    "@_elementId": number | string;
    "@_contactPoint": string;
  };
  neighbor?: {
    "@_side": string;
    "@_elementId": number | string;
    "@_direction": string;
  }[];
};

export type XODRTypeType = {
  speed: {
    "@_max": number | string;
    "@_unit": string;
  };
  "@_s": string;
  "@_type": string;
};

export type XODRLaneOffsetType = {
  "@_s": string;
  "@_a": string;
  "@_b": string;
  "@_c": string;
  "@_d": string;
};

export type XODRLaneWidthType = {
  "@_sOffset": string;
  "@_a": string;
  "@_b": string;
  "@_c": string;
  "@_d": string;
};

export type XODRLaneRoadMarkType = {
  "@_sOffset": string;
  "@_type": string;
  "@_material": string;
  "@_color": string;
  "@_width": number | string;
  "@_laneChange": string;
  "@_height": number | string;
  "@_weight": number | string;
};

export type XODRLaneMaterialType = {
  "@_sOffset": number;
  "@_surface": string;
  "@_friction": number;
  "@_roughness": number;
};

export type XODRLaneBorderType = {
  "@_sOffset": string;
  "@_a": string;
  "@_b": string;
  "@_c": string;
  "@_d": string;
};

export type XODRLaneVisibilityType = {
  "@_sOffset": string;
  "@_forward": boolean | string;
  "@_back": boolean | string;
  "@_left": boolean | string;
  "@_right": boolean | string;
};

export type XODRLaneSpeedType = {
  "@_sOffset": string;
  "@_max": string;
  "@_unit": string;
};

export type XODRLaneAccessType = {
  "@_sOffset": string;
  "@_restriction": string;
};

export type XODRLaneHeightType = {
  "@_sOffset": string;
  "@_inner": string;
  "@_outer": string;
};

export type XODRLaneRuleType = {
  "@_sOffset": string;
  "@_value": string;
};

export type XODRLaneType = {
  link?: {
    predecessor?: {
      "@_id": number | string;
    };
    successor?: {
      "@_id": number | string;
    };
  };
  width?: XODRLaneWidthType | XODRLaneWidthType[];
  roadMark?: XODRLaneRoadMarkType | XODRLaneRoadMarkType[];
  material?: XODRLaneMaterialType | XODRLaneMaterialType[];
  border?: XODRLaneBorderType | XODRLaneBorderType[];
  visibility?: XODRLaneVisibilityType | XODRLaneVisibilityType[];
  speed?: XODRLaneSpeedType | XODRLaneSpeedType[];
  access?: XODRLaneAccessType | XODRLaneAccessType[];
  height?: XODRLaneHeightType | XODRLaneHeightType[];
  rule?: XODRLaneRuleType | XODRLaneRuleType[];
  userData?: any;
  "@_id": number | string;
  "@_type": string;
  "@_level": boolean | string;
};

export type XODRLaneSectionType = {
  left: {
    lane: XODRLaneType | XODRLaneType[];
  };
  center: {
    lane: XODRLaneType | XODRLaneType[];
  };
  right: {
    lane: XODRLaneType | XODRLaneType[];
  };
  "@_s": string;
  "@_singleSide": boolean | string;
};

export type XODRGeometryType = {
  "@_s": string;
  "@_x": string;
  "@_y": string;
  "@_hdg": string;
  "@_length": string;
  line?: {};
  spiral?: {
    "@_curvStart": string;
    "@_curvEnd": string;
  };
  arc?: {
    "@_curvature": string;
  };
  poly3?: {
    "@_a": string;
    "@_b": string;
    "@_c": string;
    "@_d": string;
  };
  paramPoly3?: {
    "@_aU": string;
    "@_bU": string;
    "@_cU": string;
    "@_dU": string;
    "@_aV": string;
    "@_bV": string;
    "@_cV": string;
    "@_dV": string;
    "@_pRange": string;
  };
};

export type XODRPlanViewType = {
  geometry: XODRGeometryType | XODRGeometryType[];
};

export type XODRElevationProfileType = {
  elevation:
    | {
        "@_s": string;
        "@_a": string;
        "@_b": string;
        "@_c": string;
        "@_d": string;
      }
    | {
        "@_s": string;
        "@_a": string;
        "@_b": string;
        "@_c": string;
        "@_d": string;
      }[];
};

export type XODRLateralProfileType = {
  superelevation?:
    | {
        "@_s": string;
        "@_a": string;
        "@_b": string;
        "@_c": string;
        "@_d": string;
      }
    | {
        "@_s": string;
        "@_a": string;
        "@_b": string;
        "@_c": string;
        "@_d": string;
      }[];
  crossfall?:
    | {
        "@_side": string;
        "@_s": string;
        "@_a": string;
        "@_b": string;
        "@_c": string;
        "@_d": string;
      }
    | {
        "@_side": string;
        "@_s": string;
        "@_a": string;
        "@_b": string;
        "@_c": string;
        "@_d": string;
      }[];
  shape?:
    | {
        "@_s": string;
        "@_t": string;
        "@_a": string;
        "@_b": string;
        "@_c": string;
        "@_d": string;
      }
    | {
        "@_s": string;
        "@_t": string;
        "@_a": string;
        "@_b": string;
        "@_c": string;
        "@_d": string;
      }[];
};

export type XODRSignalType = {
  "@_s": string;
  "@_t": string;
  "@_id": string;
  "@_name": string;
  "@_dynamic": boolean | string;
  "@_orientation": string;
  "@_zOffset": string;
  "@_country": string;
  "@_type": string;
  "@_subtype": string;
  "@_value": string;
  "@_unit": string;
  "@_height": string;
  "@_width": string;
  "@_text": string;
  "@_hOffset": string;
  "@_pitch": string;
  "@_roll": string;
  "@_yaw": string;
  validity?:
    | {
        "@_fromLane": number | string;
        "@_toLane": number | string;
      }
    | {
        "@_fromLane": number | string;
        "@_toLane": number | string;
      }[];
  dependency?:
    | {
        "@_id": number | string;
        "@_type": string;
      }
    | {
        "@_id": number | string;
        "@_type": string;
      }[];
};

export type XODRSignalReferenceType = {
  "@_s": string;
  "@_t": string;
  "@_id": string;
  "@_orientation": string;
  validity?:
    | {
        "@_fromLane": number | string;
        "@_toLane": number | string;
      }
    | {
        "@_fromLane": number | string;
        "@_toLane": number | string;
      }[];
};

export type XODRRoadType = {
  link: XODRLinkType;
  type?: XODRTypeType | XODRTypeType[];
  planView: XODRPlanViewType;
  elevationProfile: XODRElevationProfileType;
  lateralProfile: XODRLateralProfileType;
  signals?: {
    signal: XODRSignalType | XODRSignalType[];
    signalReference: XODRSignalReferenceType | XODRSignalReferenceType[];
  };
  lanes: {
    laneOffset: XODRLaneOffsetType | XODRLaneOffsetType[];
    laneSection: XODRLaneSectionType | XODRLaneSectionType[];
  };
  "@_name": string;
  "@_length": string;
  "@_id": string | number;
  "@_junction": string | number;
};

export type XODRLaneLinkType = {
  "@_from": number | string;
  "@_to": number | string;
};

export type XODRJunctionConnectionType = {
  laneLink: XODRLaneLinkType | XODRLaneLinkType[];
  "@_id": number | string;
  "@_incomingRoad": number | string;
  "@_connectingRoad": number | string;
  "@_contactPoint": string;
};

export type XODRJunctionControllerType = {
  "@_id": number | string;
  "@_type": string;
  "@_sequence": string;
  param: {
    "@_name": string;
    "@_value": string;
  };
};

export type XODRJunctionPriorityType = {
  "@_high": number | string;
  "@_low": number | string;
};

export type XODRJunctionType = {
  connection: XODRJunctionConnectionType | XODRJunctionConnectionType[];
  controller?: XODRJunctionControllerType | XODRJunctionControllerType[];
  priority?: XODRJunctionPriorityType | XODRJunctionPriorityType[];
  "@_id": number | string;
  "@_name": string;
};

export type XODRControllerType = {
  "@_id": number | string;
  "@_name": string;
  "@_sequence": string;
  control:
    | {
        "@_type": string;
        "@_signalId": string;
      }
    | {
        "@_type": string;
        "@_signalId": string;
      }[];
};

export type XODRJunctionGroupType = {
  "@_name": string;
  "@_id": string;
  "@_type": string;
  junctionReference:
    | {
        "@_junction": string;
      }
    | {
        "@_junction": string;
      }[];
};
