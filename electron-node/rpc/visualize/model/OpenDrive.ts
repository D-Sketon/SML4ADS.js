import { Junction } from "./Junction";
import { Road } from "./Road";

export class OpenDrive {
  roads: Road[] = [];
  junctions: Junction[] = [];

  getRoad(id: number) {
    return this.roads.find((road) => road.id === id);
  }

  getJunction(id: number) {
    return this.junctions.find((junction) => junction.id === id);
  }
}
