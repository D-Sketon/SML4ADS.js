import { Row, Col, InputNumber, Cascader } from "antd";
import React, { ReactElement } from "react";
import { Edge } from "reactflow";
import {
  BERNOULLI_DISTRIBUTION_WEIGHT_PARAMS,
  BINOMIAL_DISTRIBUTION_WEIGHT_PARAMS,
  CHI_SQUARED_DISTRIBUTION_WEIGHT_PARAMS,
  MANUAL_WEIGHT_PARAMS,
  NORMAL_DISTRIBUTION_WEIGHT_PARAMS,
  POISSON_DISTRIBUTION_WEIGHT_PARAMS,
  UNIFORM_DISTRIBUTION_WEIGHT_PARAMS,
  WEIGHT_PARAMS,
  WEIGHT_TYPES,
  defaultManualWeightParams,
  defaultWeightParams,
} from "../../../../model/params/ParamWeight";

interface WeightDrawerProps {
  selectedEdge: Edge | null;
  setEdges: (edge: React.SetStateAction<Edge[]>) => void;
}

function WeightDrawer(props: WeightDrawerProps): ReactElement {
  const { selectedEdge, setEdges } = props;

  const weight: {
    type: WEIGHT_TYPES;
    params: WEIGHT_PARAMS;
  } = JSON.parse(
    selectedEdge?.label?.toString() ??
      JSON.stringify({
        type: WEIGHT_TYPES.MANUAL,
        params: defaultManualWeightParams(),
      })
  );

  const cascaderOptions = [
    {
      label: WEIGHT_TYPES.MANUAL,
      value: WEIGHT_TYPES.MANUAL,
    },
    {
      label: WEIGHT_TYPES.PROBABILISTIC,
      value: WEIGHT_TYPES.PROBABILISTIC,
      children: [
        {
          label: WEIGHT_TYPES.UNIFORM_DISTRIBUTION,
          value: WEIGHT_TYPES.UNIFORM_DISTRIBUTION,
        },
        {
          label: WEIGHT_TYPES.NORMAL_DISTRIBUTION,
          value: WEIGHT_TYPES.NORMAL_DISTRIBUTION,
        },
        {
          label: WEIGHT_TYPES.BERNOULLI_DISTRIBUTION,
          value: WEIGHT_TYPES.BERNOULLI_DISTRIBUTION,
        },
        {
          label: WEIGHT_TYPES.BINOMIAL_DISTRIBUTION,
          value: WEIGHT_TYPES.BINOMIAL_DISTRIBUTION,
        },
        {
          label: WEIGHT_TYPES.POISSON_DISTRIBUTION,
          value: WEIGHT_TYPES.POISSON_DISTRIBUTION,
        },
        {
          label: WEIGHT_TYPES.CHI_SQUARED_DISTRIBUTION,
          value: WEIGHT_TYPES.CHI_SQUARED_DISTRIBUTION,
        },
      ],
    },
  ];

  // Just show the latest item.
  const displayRender = (labels: string[]) => labels[labels.length - 1];

  function manualSpeed(): ReactElement {
    return (
      <>
        <Row
          style={{ display: "flex", alignItems: "center", margin: "10px 0" }}
        >
          <Col span={6}>weight:</Col>
          <Col span={18}>
            <InputNumber
              min={0}
              value={(weight.params as MANUAL_WEIGHT_PARAMS).weight}
              onChange={(e) => simpleSetWeightParams("weight", e)}
            />
          </Col>
        </Row>
      </>
    );
  }

  function uniformDistributionSpeed(): ReactElement {
    return (
      <>
        <Row
          style={{ display: "flex", alignItems: "center", margin: "10px 0" }}
        >
          <Col span={6}>min:</Col>
          <Col span={18}>
            <InputNumber
              min={0}
              value={(weight.params as UNIFORM_DISTRIBUTION_WEIGHT_PARAMS).a}
              onChange={(e) => simpleSetWeightParams("a", e)}
            />
          </Col>
        </Row>
        <Row
          style={{ display: "flex", alignItems: "center", margin: "10px 0" }}
        >
          <Col span={6}>max:</Col>
          <Col span={18}>
            <InputNumber
              min={0}
              value={(weight.params as UNIFORM_DISTRIBUTION_WEIGHT_PARAMS).b}
              onChange={(e) => simpleSetWeightParams("b", e)}
            />
          </Col>
        </Row>
      </>
    );
  }

  function normalDistributionSpeed(): ReactElement {
    return (
      <>
        <Row
          style={{ display: "flex", alignItems: "center", margin: "10px 0" }}
        >
          <Col span={6}>mean:</Col>
          <Col span={18}>
            <InputNumber
              min={0}
              value={(weight.params as NORMAL_DISTRIBUTION_WEIGHT_PARAMS).mean}
              onChange={(e) => simpleSetWeightParams("mean", e)}
            />
          </Col>
        </Row>
        <Row
          style={{ display: "flex", alignItems: "center", margin: "10px 0" }}
        >
          <Col span={6}>std:</Col>
          <Col span={18}>
            <InputNumber
              min={0}
              value={(weight.params as NORMAL_DISTRIBUTION_WEIGHT_PARAMS).std}
              onChange={(e) => simpleSetWeightParams("std", e)}
            />
          </Col>
        </Row>
      </>
    );
  }

  function bernoulliDistributionSpeed(): ReactElement {
    return (
      <>
        <Row
          style={{ display: "flex", alignItems: "center", margin: "10px 0" }}
        >
          <Col span={6}>p:</Col>
          <Col span={18}>
            <InputNumber
              min={0}
              max={1}
              value={(weight.params as BERNOULLI_DISTRIBUTION_WEIGHT_PARAMS).p}
              onChange={(e) => simpleSetWeightParams("p", e)}
            />
          </Col>
        </Row>
      </>
    );
  }

  function binomialDistributionSpeed(): ReactElement {
    return (
      <>
        <Row
          style={{ display: "flex", alignItems: "center", margin: "10px 0" }}
        >
          <Col span={6}>n:</Col>
          <Col span={18}>
            <InputNumber
              min={0}
              value={(weight.params as BINOMIAL_DISTRIBUTION_WEIGHT_PARAMS).n}
              onChange={(e) => simpleSetWeightParams("n", e)}
            />
          </Col>
        </Row>
        <Row
          style={{ display: "flex", alignItems: "center", margin: "10px 0" }}
        >
          <Col span={6}>p:</Col>
          <Col span={18}>
            <InputNumber
              min={0}
              max={1}
              value={(weight.params as BINOMIAL_DISTRIBUTION_WEIGHT_PARAMS).p}
              onChange={(e) => simpleSetWeightParams("p", e)}
            />
          </Col>
        </Row>
      </>
    );
  }

  function poissonDistributionSpeed(): ReactElement {
    return (
      <>
        <Row
          style={{ display: "flex", alignItems: "center", margin: "10px 0" }}
        >
          <Col span={6}>lambda:</Col>
          <Col span={18}>
            <InputNumber
              min={0}
              value={
                (weight.params as POISSON_DISTRIBUTION_WEIGHT_PARAMS).lambda
              }
              onChange={(e) => simpleSetWeightParams("lambda", e)}
            />
          </Col>
        </Row>
      </>
    );
  }

  function chiSquaredDistributionSpeed(): ReactElement {
    return (
      <>
        <Row
          style={{ display: "flex", alignItems: "center", margin: "10px 0" }}
        >
          <Col span={6}>k:</Col>
          <Col span={18}>
            <InputNumber
              min={0}
              value={
                (weight.params as CHI_SQUARED_DISTRIBUTION_WEIGHT_PARAMS).k
              }
              onChange={(e) => simpleSetWeightParams("k", e)}
            />
          </Col>
        </Row>
      </>
    );
  }

  function getWeightComponent(): ReactElement {
    switch (weight.type) {
      case WEIGHT_TYPES.MANUAL:
        return manualSpeed();
      case WEIGHT_TYPES.UNIFORM_DISTRIBUTION:
        return uniformDistributionSpeed();
      case WEIGHT_TYPES.NORMAL_DISTRIBUTION:
        return normalDistributionSpeed();
      case WEIGHT_TYPES.BERNOULLI_DISTRIBUTION:
        return bernoulliDistributionSpeed();
      case WEIGHT_TYPES.BINOMIAL_DISTRIBUTION:
        return binomialDistributionSpeed();
      case WEIGHT_TYPES.POISSON_DISTRIBUTION:
        return poissonDistributionSpeed();
      case WEIGHT_TYPES.CHI_SQUARED_DISTRIBUTION:
        return chiSquaredDistributionSpeed();
      default:
        return <></>;
    }
  }

  function simpleSetWeightParams(key: string, value: number | null) {
    if (selectedEdge) {
      (weight.params as any)[key] = value;
      selectedEdge.label = JSON.stringify(weight);
      setEdges((eds) => {
        return eds
          .filter((edge) => edge.id !== selectedEdge.id)
          .concat(selectedEdge);
      });
    }
  }

  return (
    <>
      <Row style={{ display: "flex", alignItems: "center", margin: "10px 0" }}>
        <Col span={6}>{"weightType:"}</Col>
        <Col span={18}>
          <Cascader
            style={{ width: 180 }}
            allowClear={false}
            options={cascaderOptions}
            expandTrigger="hover"
            value={
              weight.type === WEIGHT_TYPES.MANUAL
                ? [WEIGHT_TYPES.MANUAL]
                : [WEIGHT_TYPES.PROBABILISTIC, weight.type]
            }
            displayRender={displayRender}
            onChange={(e) => {
              if (selectedEdge) {
                weight.type = e[e.length - 1] as WEIGHT_TYPES;
                weight.params = defaultWeightParams(
                  e[e.length - 1] as WEIGHT_TYPES
                );
                selectedEdge.label = JSON.stringify(weight);
                setEdges((eds) => {
                  return eds
                    .filter((edge) => edge.id !== selectedEdge.id)
                    .concat(selectedEdge);
                });
              }
            }}
          />
        </Col>
      </Row>
      {getWeightComponent()}
    </>
  );
}

export default WeightDrawer;
