import { LaneSection } from "./LaneSection";

export class Road {
  /**
   * Road type = 1
   */
  elementType: number;
  /**
   * Unique id of the Road
   */
  roadId: number;
  /**
   * Index used to index in the junction array
   */
  junctionIndex: number;
  /**
   * Id of the Junction of the current Road, showing that the current Road is a connection road in which junction
   * -1 means not a connection road, not part of any junction
   */
  junctionId: number;
  /**
   * Total length of the Road
   */
  length: number;
  /**
   * Predecessor type of the current Road
   */
  predecessorElementType: number;
  /**
   * Index of the predecessor Road or Junction
   * -1 means empty
   */
  predecessorIndex: number;
  /**
   * Successor type of the current Road
   */
  successorElementType: number;
  /**
   * Index of the successor Road or Junction
   * -1 means empty
   */
  successorIndex: number;
  /**
   * Maximum speed of the Road
   */
  maxSpeed: number;
  /**
   * LaneSection index array of the current Road
   */
  laneSectionsIndex: number[];

  /**
   * Indicates the LaneSection structure array of the current Road
   * The order of the LaneSection in the array is the order of the LaneSection in the Road
   * There are many different Lanes in the LaneSection
   */
  laneSections: LaneSection[];
  successorId: number;
  predecessorId: number;
  index: number;
}
