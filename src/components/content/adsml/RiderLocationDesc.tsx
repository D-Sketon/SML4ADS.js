import { ReactElement } from "react";
import { RiderLocation } from "../../../model/Rider";
import { Card, Descriptions } from "antd";
import LocationParamsDesc from "./LocationParamsDesc";

interface RiderLocationDescProps {
  location: RiderLocation[];
}

export default function RiderLocationDesc({
  location,
}: RiderLocationDescProps): ReactElement {
  return (
    <div className="flex flex-col">
      {location.map((l, i) => {
        return (
          <Card
            hoverable
            title="Location Point"
            className="box-border mt-2 mb-2"
            key={i}
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
                  label: "speed",
                  key: "speedType",
                  children: l.speed,
                  span: 2,
                },
              ]}
            />
          </Card>
        );
      })}
    </div>
  );
}
