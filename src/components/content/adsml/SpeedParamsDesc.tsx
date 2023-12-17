import { ReactElement } from "react";
import { SPEED_PARAMS } from "../../../model/params/ParamSpeed";
import { Descriptions } from "antd";

interface SpeedParamsDescProps {
  params: SPEED_PARAMS;
  title: string;
}

export default function SpeedParamsDesc({
  params,
  title,
}: SpeedParamsDescProps): ReactElement {
  return (
    <>
      <Descriptions
        title={title}
        column={2}
        items={Object.keys(params).map((k) => ({
          label: k,
          key: k,
          children: params[k as keyof SPEED_PARAMS],
        }))}
      />
    </>
  );
}
