import { Button, Card, InputNumber, Radio, Select } from "antd";
import { ReactElement } from "react";
import { ProjectType } from ".";

export default function CausalDiscovery({
  setKey,
  projectData,
  setProjectData,
}: {
  setKey: (key: string) => void;
  projectData: ProjectType;
  setProjectData: (data: any) => void;
}): ReactElement {
  const setBasicParams = (card: string, key: string, value: any) => {
    setProjectData({
      ...projectData,
      discovery: {
        ...projectData.discovery,
        // @ts-ignore
        [card]: { ...projectData.discovery[card], [key]: value },
      },
    });
  };
  return (
    <div className="flex flex-col gap-10">
      <Card>
        <div className="form-item">
          <div className="form-label w-28">选择算法:</div>
          <Select
            style={{ width: 200 }}
            value={projectData.discovery.algorithm}
            onChange={(e) => {
              setProjectData({
                ...projectData,
                discovery: { ...projectData.discovery, algorithm: e },
              });
            }}
            options={[
              { value: "GFCI", label: "GFCI" },
              { value: "PC", label: "PC" },
              { value: "FCI", label: "FCI" },
            ]}
          />
        </div>
        <div className="form-item">
          <div className="form-label w-28">test:</div>
          <Select
            style={{ width: 200 }}
            value={projectData.discovery.test}
            onChange={(e) => {
              setProjectData({
                ...projectData,
                discovery: { ...projectData.discovery, test: e },
              });
            }}
            options={[
              { value: "CG-LRT", label: "CG-LRT" },
              { value: "Chi Square Test", label: "Chi Square Test" },
              { value: "DG-LRT", label: "DG-LRT" },
              { value: "G Square Test", label: "G Square Test" },
              { value: "Probabilistic Test", label: "Probabilistic Test" },
            ]}
          />
        </div>
        <div className="form-item">
          <div className="form-label w-28">score:</div>
          <Select
            style={{ width: 200 }}
            value={projectData.discovery.score}
            onChange={(e) => {
              setProjectData({
                ...projectData,
                discovery: { ...projectData.discovery, score: e },
              });
            }}
            options={[
              { value: "BDeu Score", label: "BDeu Score" },
              { value: "CG-BIC", label: "CG-BIC" },
              { value: "DG-BIC", label: "DG-BIC" },
              { value: "Discrete BIC Score", label: "Discrete BIC Score" },
            ]}
          />
        </div>
        <Card title="GFCI" className="m-2">
          <div className="flex justify-between items-center m-2 h-8">
            <div className="form-label">
              Maximum size of conditioning set('depth', unlimited = -1):
            </div>
            <InputNumber
              value={projectData.discovery.gfci.conditioningSet}
              onChange={(e) => setBasicParams("gfci", "conditioningSet", e)}
            />
          </div>
          <div className="flex justify-between items-center m-2 h-8">
            <div className="form-label">
              The maximum degree of the graph (min = -1):
            </div>
            <InputNumber
              value={projectData.discovery.gfci.graphDegree}
              onChange={(e) => setBasicParams("gfci", "graphDegree", e)}
            />
          </div>
          <div className="flex justify-between items-center m-2 h-8">
            <div className="form-label">
              The maximum length for any discriminating path. -1 if unlimited
              (min = -1):
            </div>
            <InputNumber
              value={projectData.discovery.gfci.discriminatingLength}
              onChange={(e) =>
                setBasicParams("gfci", "discriminatingLength", e)
              }
            />
          </div>
          <div className="flex justify-between items-center m-2 h-8">
            <div className="form-label">
              A time lag for time series data, automatically applied (zero if
              none):
            </div>
            <InputNumber
              value={projectData.discovery.gfci.timeLag}
              onChange={(e) => setBasicParams("gfci", "timeLag", e)}
            />
          </div>
          <div className="flex justify-between items-center m-2 h-8">
            <div className="form-label">
              Yes if the complete FCI rule set should be used:
            </div>
            <Radio.Group
              value={projectData.discovery.gfci.FCIRuleSetUsed}
              onChange={(e) =>
                setBasicParams("gfci", "FCIRuleSetUsed", e.target.value)
              }
            >
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </Radio.Group>
          </div>
          <div className="flex justify-between items-center m-2 h-8">
            <div className="form-label">
              Yes if the discriminating path rule should be done, No if not:
            </div>
            <Radio.Group
              value={projectData.discovery.gfci.discriminatingRuleDone}
              onChange={(e) =>
                setBasicParams("gfci", "discriminatingRuleDone", e.target.value)
              }
            >
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </Radio.Group>
          </div>
          <div className="flex justify-between items-center m-2 h-8">
            <div className="form-label">
              Yes if the possible msep search should be done:
            </div>
            <Radio.Group
              value={projectData.discovery.gfci.msepSearchDone}
              onChange={(e) =>
                setBasicParams("gfci", "msepSearchDone", e.target.value)
              }
            >
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </Radio.Group>
          </div>
          <div className="flex justify-between items-center m-2 h-8">
            <div className="form-label">
              Yes if verbose output should be printed or logged:
            </div>
            <Radio.Group
              value={projectData.discovery.gfci.verboseOutputPrinted}
              onChange={(e) =>
                setBasicParams("gfci", "verboseOutputPrinted", e.target.value)
              }
            >
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </Radio.Group>
          </div>
        </Card>
        <Card title="BDeu Score" className="m-2">
          <div className="flex justify-between items-center m-2 h-8">
            <div className="form-label">
              Prior equivalent sample size (min = 1.0):
            </div>
            <InputNumber value={projectData.discovery.bdeuScore.sampleSize} />
          </div>
          <div className="flex justify-between items-center m-2 h-8">
            <div className="form-label">
              Structure prior coefficient (min = 0.0):
            </div>
            <InputNumber value={projectData.discovery.bdeuScore.coefficient} />
          </div>
        </Card>
        <Card title="G Square Test" className="m-2">
          <div className="flex justify-between items-center m-2 h-8">
            <div className="form-label">
              Cutoff for p values (alpha) (min = 0.0):
            </div>
            <InputNumber value={projectData.discovery.gSquareTest.values} />
          </div>
        </Card>
        <Card title="BootStrapping" className="m-2">
          <div className="flex justify-between items-center m-2 h-8">
            <div className="form-label">
              The number of bootstraps / resampling iterations (min = 0):
            </div>
            <InputNumber
              value={projectData.discovery.bootStrapping.bootstrapsNumber}
            />
          </div>
          <div className="flex justify-between items-center m-2 h-8">
            <div className="form-label">
              The percentage of resample size (min = 10%):
            </div>
            <InputNumber
              value={projectData.discovery.bootStrapping.resampleSizePercentage}
            />
          </div>
          <div className="flex justify-between items-center m-2 h-8">
            <div className="form-label">
              Seed for pseudorandom number generation (-1 = off):
            </div>
            <InputNumber value={projectData.discovery.bootStrapping.seed} />
          </div>
          <div className="flex justify-between items-center m-2 h-8">
            <div className="form-label">
              Yes, if adding the original dataset as another bootStrapping:
            </div>
            <Radio.Group
              value={projectData.discovery.bootStrapping.addingOriginalDataset}
              onChange={(e) =>
                setBasicParams("bootStrapping", "addingOriginalDataset", e.target.value)
              }
            >
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </Radio.Group>
          </div>
          <div className="flex justify-between items-center m-2 h-8">
            <div className="form-label">
              Yes, if sampling with replacement (bootstrapping):
            </div>
            <Radio.Group
              value={
                projectData.discovery.bootStrapping.samplingWithReplacement
              }
              onChange={(e) =>
                setBasicParams("bootStrapping", "samplingWithReplacement", e.target.value)
              }
            >
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </Radio.Group>
          </div>
          <div className="flex justify-between items-center m-2 h-8">
            <div className="form-label">
              Yes, if individual bootstrapping graphs should be saved:
            </div>
            <Radio.Group
              value={
                projectData.discovery.bootStrapping.individualBootstrappingSaved
              }
              onChange={(e) =>
                setBasicParams("bootStrapping", "individualBootstrappingSaved", e.target.value)
              }
            >
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </Radio.Group>
          </div>
        </Card>
      </Card>
      <div className="flex w-full gap-5">
        <Button type="primary" className="grow" onClick={() => setKey("5")}>
          上一步
        </Button>
        <Button type="primary" className="grow" onClick={() => setKey("7")}>
          生成因果图
        </Button>
      </div>
    </div>
  );
}
