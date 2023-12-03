import { LaneLink } from "./LaneLink";

export class Connection {
  direction: number;
  /**
   * The Road id of the incoming Road
   */
  incomingRoadId: number;
  /**
   * The Road id of the Road connecting the current Road
   */
  connectingRoadId: number;
  /**
   * Index of the Road connecting the incoming Road
   */
  incomingRoadIndex: number;
  //  索引值 表示当前Connection连接Road
  /**
   * Index of the Road connecting the current Road
   */
  connectingRoadIndex: number;
  laneLinksIndex: number[];
  /**
   * LaneLink structure array indicating the information of the Lane of the current connection Road connecting the Lane of the incoming Road
   */
  laneLinks: LaneLink[];
  index: number;
}
