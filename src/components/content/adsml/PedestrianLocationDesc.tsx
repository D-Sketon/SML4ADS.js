import { ReactElement } from "react";
import {
  PEDESTRIAN_SPEED_PARAMS,
  PedestrianLocation,
} from "../../../model/Pedestrian";
import { Card, Descriptions, DescriptionsProps } from "antd";
import LocationParamsDesc from "./LocationParamsDesc";

interface PedestrianLocationDescProps {
  location: PedestrianLocation[];
}

export default function PedestrianLocationDesc({
  location,
}: PedestrianLocationDescProps): ReactElement {
  return (
    <div className="flex flex-col">
      {location.map((l, i) => {
        const items: DescriptionsProps["items"] = [
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
        ];
        if (i > 0) {
          items.push({
            label: "speedType",
            key: "speedType",
            children: l.speedType!,
            span: 2,
          });
          items.push({
            key: "speedParams",
            children: (
              <Descriptions
                title="Speed Params"
                column={2}
                items={Object.keys(l.speedParams!).map((k) => ({
                  label: k,
                  key: k,
                  children: l.speedParams![k as keyof PEDESTRIAN_SPEED_PARAMS],
                }))}
              />
            ),
            span: 2,
          });
        }
        return (
          <Card
            hoverable
            title="Location Point"
            className="box-border mt-2 mb-2"
            key={i}
          >
            <Descriptions column={2} items={items} />
          </Card>
        );
      })}
    </div>
  );
}
