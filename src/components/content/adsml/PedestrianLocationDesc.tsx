import { ReactElement } from "react";
import {
  PEDESTRIAN_SPEED_PARAMS,
  PedestrianLocation,
} from "../../../model/Pedestrian";
import { Card, Descriptions } from "antd";
import LocationParamsDesc from "./LocationParamsDesc";

interface PedestrianLocationDescProps {
  location: PedestrianLocation[];
}

export default function PedestrianLocationDesc({
  location,
}: PedestrianLocationDescProps): ReactElement {
  return (
    <>
      {location.map((l) => {
        return (
          <Card
            hoverable
            title="Location Point"
            className="box-border mt-2 mb-2"
          >
            <Descriptions
              column={2}
              items={[
                {
                  label: "locationType",
                  key: "locationType",
                  children: l.locationType,
                  span: 2,
                },
                {
                  key: "locationParams",
                  children: <LocationParamsDesc params={l.locationParams} />,
                  span: 2,
                },
                {
                  label: "speedType",
                  key: "speedType",
                  children: l.speedType,
                  span: 2,
                },
                {
                  key: "speedParams",
                  children: (
                    <Descriptions
                      title="Speed Params"
                      column={2}
                      items={Object.keys(l.speedParams).map((k) => ({
                        label: k,
                        key: k,
                        children:
                          l.speedParams[k as keyof PEDESTRIAN_SPEED_PARAMS],
                      }))}
                    />
                  ),
                  span: 2,
                },
              ]}
            />
          </Card>
        );
      })}
    </>
  );
}
