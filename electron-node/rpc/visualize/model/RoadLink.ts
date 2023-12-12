export class Link {
  id_: number;
  predecessor: Predecessor;
  successor: Successor;
  neighbors: Neighbor[] = [];
}

export class Predecessor {
  elementType: string;
  element_id: number;
  contactPoint: string;

  constructor(elementType: string, elementId: number | string, contactPoint: string) {
    this.elementType = elementType;
    this.element_id = Number(elementId);
    this.contactPoint = contactPoint;
  }
}

export class Successor extends Predecessor {}

export class Neighbor {
  side: string;
  element_id: number;
  direction: string;

  constructor(side: string, elementId: number | string, direction: string) {
    this.side = side;
    this.element_id = Number(elementId);
    this.direction = direction;
  }
}
