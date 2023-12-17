import { ReactElement } from "react";
import { Descriptions } from "antd";
import { LOCATION_PARAMS } from "../../../model/params/ParamLocation";

interface LocationParamsDescProps {
  params: LOCATION_PARAMS;
}

export default function LocationParamsDesc({
  params,
}: LocationParamsDescProps): ReactElement {
  return (
    <>
      <Descriptions
        title="Location Params"
        column={2}
        items={Object.keys(params).map((k) => ({
          label: k,
          key: k,
          children: Array.isArray(params[k as keyof LOCATION_PARAMS])
            ? JSON.stringify(params[k as keyof LOCATION_PARAMS])
            : params[k as keyof LOCATION_PARAMS],
        }))}
      />
    </>
  );
}
