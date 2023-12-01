import { ReactElement } from "react";
import { Descriptions } from "antd";
import { LOCATION_PARAMS } from "../../../model/params/ParamLocation";

interface LocationParamsDescProps {
  params: LOCATION_PARAMS;
}

function LocationParamsDesc(props: LocationParamsDescProps): ReactElement {
  return (
    <>
      <Descriptions
        title="Location Params"
        items={Object.keys(props.params).map((k) => ({
          label: k,
          key: k,
          children: props.params[k as keyof LOCATION_PARAMS],
        }))}
      />
    </>
  );
}

export default LocationParamsDesc;
