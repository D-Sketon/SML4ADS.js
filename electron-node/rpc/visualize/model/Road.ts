import { Junction } from "./Junction";
import { ElevationProfile } from "./RoadElevationProfile";
import { Lanes } from "./RoadLanes";
import { LateralProfile } from "./RoadLateralProfile";
import { Link } from "./RoadLink";
import { PlanView } from "./RoadPlanView";
import { RoadType } from "./RoadType";

export class Road {
  id: number;
  name: string;
  junction: Junction | undefined;
  length: number;
  link: Link = new Link();
  types: RoadType[] = [];
  planView: PlanView = new PlanView();
  elevationProfile: ElevationProfile = new ElevationProfile();
  lateralProfile: LateralProfile = new LateralProfile();
  lanes: Lanes = new Lanes();
}
