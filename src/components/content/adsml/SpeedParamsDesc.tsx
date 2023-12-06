import { ReactElement } from "react";
import { SPEED_PARAMS } from "../../../model/params/ParamSpeed";
import { Descriptions } from "antd";

interface SpeedParamsDescProps {
  params: SPEED_PARAMS;
  title: string,
}

function SpeedParamsDesc(props: SpeedParamsDescProps): ReactElement {
  return (
    <>
      <Descriptions
        title={props.title}
        column={2}
        items={Object.keys(props.params).map((k) => ({
          label: k,
          key: k,
          children: props.params[k as keyof SPEED_PARAMS],
        }))}
      />
    </>
  );
}

export default SpeedParamsDesc;
