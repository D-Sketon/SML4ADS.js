export class Lane {
  /**
   * Lane type = 3
   */
  elementType: number;
  /**
   * The Road id of the current Lane
   */
  roadId: number;
  /**
   * Index of the Road of the current Lane
   */
  roadIndex: number;
  /**
   * Index of the LaneSection of the current Lane
   */
  laneSectionIndex: number;
  /**
   * The relative position of the current Lane in the LaneSection    
   * The center line is 0, the left side of the road id decreases one by one, and the right side of the road id increases one by one
   */
  laneId: number;
  /**
   * Indicates what type of Lane the current Lane is
   * 1 means driving
   * 0 means nothing
   */
  type: number;
  /**
   * Index of the predecessor Lane
   * default -1
   */
  predecessorIndex: number = -1;
  /**
   * Index of the successor Lane
   * default -1
   */
  successorIndex: number = -1;
  /**
   * Indicates whether the current Lane is allowed to change lanes    
   * -1 means unknown    
   * 1 means allowed to change lanes to the left    
   * 2 means allowed to change lanes to the right    
   * 3 means allowed to change lanes on both sides    
   * 4 means not allowed to change lanes on both sides    
   */
  laneChange: LANE_CHANGE_TYPES;

  laneSectionId: number;
  /**
   * Different from laneId, singleId is the real unique id, which represents the identifier
   */
  singleId: number;
  index: number;
  /**
   * The relative position of the predecessor Lane   
   * 0 means no predecessor Lane
   */
  predecessorLaneId: number;
  /**
   * The unique id of the predecessor Lane    
   * default -1
   */
  predecessorSingleId: number = -1;
  successorLaneId: number;
  /**
   * The unique id of the successor Lane    
   * default -1
   */
  successorSingleId: number = -1;
  /**
   * The width of the Lane, calculated by width and offset
   */
  width: number;
}

export enum LANE_CHANGE_TYPES {
  INCREASE = 1,
  DECREASE = 2,
  BOTH = 3,
  NONE = 4,
}