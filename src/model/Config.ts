export type MConfig = {
  simulationPort: number;
}

export const defaultConfig: () => MConfig = () => ({
  simulationPort: 20225
});