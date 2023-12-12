export class Junction {
  id: number;
  name: string;
  connections: Connection[] = [];

  addConnection(connection: Connection) {
    this.connections.push(connection);
  }
}

export class Connection {
  id: number;
  incomingRoad: number;
  connectingRoad: number;
  contactPoint: string;
  laneLinks: LaneLink[] = [];

  addLaneLink(laneLink: LaneLink) {
    this.laneLinks.push(laneLink);
  }
}

export class LaneLink {
  from: number;
  to: number;
}
