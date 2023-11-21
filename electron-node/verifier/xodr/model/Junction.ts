import { Connection } from "./Connection";

export class Junction {
  /**
   * Junction type = 4
   */
  elementType: number;
  /**
   * Unique id of the Junction
   */
  junctionId: number;
  connectionsIndex: number[];
  /**
   * Connection structure array indicating the information of the incoming Road and the connecting Road of the current Junction
   */
  connections: Connection[];
  index: number;
}