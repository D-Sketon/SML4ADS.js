export class LaneLink {
  /**
   * The index of the Lane of the current connection Road connecting the Lane of the incoming Road
   */
  from: number;
  /**
   * The index of the Lane of the current connection Road connecting the Lane of the outgoing Road
   */
  to: number;
  /**
   * Indicates the information of the Lane of the current connection Road connecting the Lane of the incoming Road
   */
  index: number;
}