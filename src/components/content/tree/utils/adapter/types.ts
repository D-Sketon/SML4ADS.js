import { MarkerType } from "reactflow";

export type CustomNode = {
  id: string;
  type: string;
  data: any;
  position: { x: number; y: number };
};

export type CustomEdge = {
  id: string;
  source: string;
  target: string;
  type: string;
  label: string;
  markerEnd: { type: MarkerType };
};
