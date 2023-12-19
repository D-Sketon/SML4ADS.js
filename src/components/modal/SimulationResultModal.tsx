import { ReactElement } from "react";
import { BaseModalProps } from "./types";
import { Modal } from "antd";
import ReactEChartsCore from "echarts-for-react/lib/core";
import * as echarts from "echarts/core";
import { LineChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
  DataZoomComponent,
  DataZoomInsideComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  DataZoomInsideComponent,
  LineChart,
  CanvasRenderer,
]);

export default function SimulationResultModal({
  isModalOpen,
  handleCancel = () => {},
  extraInfo,
}: BaseModalProps & {
  extraInfo: {
    acc: number[];
    vel: number[];
  };
}): ReactElement {
  const acclerationOptions = {
    title: {
      text: "Acceleration",
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: extraInfo.acc.map((_, index) => index),
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        symbol: "none",
        data: extraInfo.acc,
        type: "line",
        smooth: true,
      },
    ],
    dataZoom: [
      {
        type: "inside",
        xAxisIndex: [0],
        filterMode: "filter",
      },
    ],
  };

  const velocityOptions = {
    title: {
      text: "Velocity",
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: extraInfo.vel.map((_, index) => index),
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        symbol: "none",
        data: extraInfo.vel,
        type: "line",
        smooth: true,
        itemStyle: {
          normal: {
            color: "#91cc75",
            lineStyle: {
              color: "#91cc75",
            },
          },
        },
      },
    ],
    dataZoom: [
      {
        type: "inside",
        xAxisIndex: [0],
        filterMode: "filter",
      },
    ],
  };

  return (
    <Modal
      title="Simulation Result"
      open={isModalOpen}
      onOk={handleCancel}
      onCancel={handleCancel}
      width={900}
    >
      <div className="flex justify-center">
        <ReactEChartsCore
          echarts={echarts}
          option={acclerationOptions}
          notMerge={true}
          lazyUpdate={true}
          style={{ width: "400px" }}
        />
        <ReactEChartsCore
          echarts={echarts}
          option={velocityOptions}
          notMerge={true}
          lazyUpdate={true}
          style={{ width: "400px" }}
        />
      </div>
    </Modal>
  );
}
