
/**
 * Uppaal is not friendly to double type calculation, so the calculation is converted to integer calculation.  
 * K is the multiple of the decimal part reserved and enlarged, and 1 more digit is reserved for every 10 times of enlargement;  
 * Here is to keep 1 decimal place, so enlarge 10 times</p>
 */
export const K = 10;

/**
 * Uppaal only supports the calculation of numbers within the range of INT16
 */
export const INT16_MAX = 32767;
export const INT16_MIN = -32768;

/**
 * The path of the file that defines the data structure
 */
export const DEFINED_PATH = "../../resources/uppaal/defined.txt";
export const FUNCTION_PATH = "../../resources/uppaal/function.txt";
export const TRANSITION_PATH = "../../resources/uppaal/transition.txt";
export const AUTOMATON_PATH = "../../resources/uppaal/Timer.txt";
export const END_TRIGGER_PATH = "../../resources/uppaal/EndTrigger.txt";


/**
 * The number of laneSection in the road
 */
export const ROAD_LANESECTION = 10;
/**
 * The number of lane in the laneSection
 */
export const LANESECTION_LANE = 10;
/**
 * The number of connection in the junction
 */
export const JUNCTION_CONNECTION = 10;
/**
 * The number of laneLink in the connection
 */
export const CONNECTION_LANELINK = 10;


export const f = (x: number) => {
  return Math.round(x * K);
}