import { ReactElement, useEffect, useState } from "react";
import Papa from "papaparse";
import { Card, Tabs, TabsProps } from "antd";
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

function calMax(arr: number[]) {
  const max = Math.max.apply(null, arr);
  const maxint = Math.ceil(max / 5);
  const maxval = maxint * 5 + 5;
  return maxval;
}
function calMin(arr: number[]) {
  const min = Math.min.apply(null, arr);
  const minint = Math.floor(min / 1);
  const minval = minint * 1 - 5;
  return minval;
}

interface SimulationResultChartProps {
  path?: string;
}

function Charts({ data }: { data: string[][] }): ReactElement {
  const velocityOptions = {
    title: {
      text: "Velocity",
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: data.map((_, index) => index),
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        symbol: "none",
        data: data.map((d) => d[3]),
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

  const accelerationOptions = {
    title: {
      text: "Acceleration",
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: data.map((_, index) => index),
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        symbol: "none",
        data: data.map((d) => d[4]),
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

  const x = data.map((d) => Number(d[1]));
  const y = data.map((d) => Number(d[2]));

  const maxX = calMax(x);
  const maxY = calMax(y);
  const minX = calMin(x);
  const minY = calMin(y);

  const locationOptions = {
    title: {
      text: "Location",
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: data.map((_, index) => index),
    },
    yAxis: [
      {
        type: "value",
        name: "x",
        nameTextStyle: {
          padding: [0, 0, -55, -150],
        },
        min: minX,
        max: maxX,
        splitNumber: 6,
        interval: (maxX - minX) / 6,
        axisLabel: {
          formatter: (v: number) => v.toFixed(1),
        },
      },
      {
        type: "value",
        name: "y",
        nameTextStyle: {
          padding: [0, 50, -50, 200],
        },
        min: minY,
        max: maxY,
        splitNumber: 6,
        interval: (maxY - minY) / 6,
        axisLabel: {
          formatter: (v: number) => v.toFixed(1),
        },
      },
    ],
    series: [
      {
        name: "x",
        symbol: "none",
        data: x,
        type: "line",
        smooth: true,
      },
      {
        name: "y",
        symbol: "none",
        data: y,
        type: "line",
        smooth: true,
        yAxisIndex: 1,
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

  const forward = data.map((d) => {
    const m = d[5].match(/-?\d+\.\d+/g);
    return {
      x: m![0],
      y: m![1],
      z: m![2],
    };
  });

  const forwardOptions = {
    title: {
      text: "Forward",
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: data.map((_, index) => index),
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "x",
        symbol: "none",
        data: forward.map((d) => d.x),
        type: "line",
        smooth: true,
      },
      {
        name: "y",
        symbol: "none",
        data: forward.map((d) => d.y),
        type: "line",
        smooth: true,
      },
      {
        name: "z",
        symbol: "none",
        data: forward.map((d) => d.z),
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

  return (
    <>
      <ReactEChartsCore
        echarts={echarts}
        option={velocityOptions}
        notMerge={true}
        lazyUpdate={true}
        style={{ width: "100%" }}
      />
      <ReactEChartsCore
        echarts={echarts}
        option={accelerationOptions}
        notMerge={true}
        lazyUpdate={true}
        style={{ width: "100%" }}
      />
      <ReactEChartsCore
        echarts={echarts}
        option={locationOptions}
        notMerge={true}
        lazyUpdate={true}
        style={{ width: "100%" }}
      />
      <ReactEChartsCore
        echarts={echarts}
        option={forwardOptions}
        notMerge={true}
        lazyUpdate={true}
        style={{ width: "100%" }}
      />
    </>
  );
}

export default function SimulationResultChart({
  path,
}: SimulationResultChartProps): ReactElement {
  const [csvMap, setCsvMap] = useState<Map<string, string[][]>>(new Map());

  useEffect(() => {
    const asyncFn = async () => {
      if (!path) return;
      const csvText = await window.electronAPI.readFile(
        path.replace(/\\/g, "/") + "/data.csv"
      );
      const csvArray = Papa.parse(csvText).data as string[][];
      const map: Map<string, string[][]> = new Map();
      csvArray.slice(1).forEach((line) => {
        const carName = line[0].trim();
        if (carName.length === 0) return;
        if (map.has(carName)) {
          map.get(carName)!.push(line);
        } else {
          map.set(carName, [line]);
        }
      });
      setCsvMap(map);
    };
    asyncFn();
  }, [path]);

  const items: TabsProps["items"] = [...csvMap.entries()].map(([k, v]) => {
    return {
      key: k,
      label: k,
      children: <Charts data={v} />,
    };
  });

  return (
    <Card className="box-border m-2 ml-0 mt-0 w-full">
      <Tabs items={items} />
    </Card>
  );
}
