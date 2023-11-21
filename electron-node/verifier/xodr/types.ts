export type XODRLinkType = {
  predecessor: {
    "@_elementType": string;
    "@_elementId": number | string;
    "@_contactPoint": string;
  };
  successor: {
    "@_elementType": string;
    "@_elementId": number | string;
    "@_contactPoint": string;
  };
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

export type XODRLaneType = {
  link?: {
    predecessor: {
      "@_id": number | string;
    };
    successor: {
      "@_id": number | string;
    };
  };
  width?: {
    "@_sOffset": string;
    "@_a": string;
    "@_b": string;
    "@_c": string;
    "@_d": string;
  };
  roadMark?: {
    "@_sOffset": string;
    "@_type": string;
    "@_material": string;
    "@_color": string;
    "@_width": number | string;
    "@_laneChange": string;
  };
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
};

export type XODRRoadType = {
  link: XODRLinkType;
  type: XODRTypeType;
  planView: any;
  elevationProfile: any;
  lateralProfile: any;
  lanes: {
    laneOffset: XODRLaneOffsetType;
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
}

export type XODRConnectionType = {
  laneLink: XODRLaneLinkType | XODRLaneLinkType[];
  "@_id": number | string;
  "@_incomingRoad": number | string;
  "@_connectingRoad": number | string;
  "@_contactPoint": string;
};

export type XODRJunctionType = {
  connection: XODRConnectionType | XODRConnectionType[];
  controller: any;
  "@_id": number | string;
  "@_name": string;
};
