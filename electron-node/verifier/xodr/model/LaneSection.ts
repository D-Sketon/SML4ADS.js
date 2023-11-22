import { Lane } from "./Lane";

export class LaneSection {
  /**
   * LaneSection type = 2
   */
  elementType: number;
  /**
   * Index of the Road of the current LaneSection    
   * Can be found in the roads array
   */
  roadIndex: number;
  /**
   * The Road id of the current LaneSection
   */
  roadId: number;
  /**
   * Unique id of the LaneSection
   */
  laneSectionId: number;
  /**
   * The relative position of the current LaneSection in the Road
   */
  startPosition: number;
  lanesIndex: number[];
  /**
   * @Deprecated    
   * Just use startPosition
   */
  length: number;
  /**
   * The Lane structure array of the current LaneSection
   */
  lanes: Lane[];
  index: number;
}