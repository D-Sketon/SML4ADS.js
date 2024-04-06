import { Button, Card, InputNumber, Radio, Select } from "antd";
import { ReactElement } from "react";

export default function CausalDiscovery(): ReactElement {
  return (
    <div className="flex flex-col gap-10">
      <Card>
        <div className="form-item">
          <div className="form-label w-28">选择算法:</div>
          <Select
            style={{ width: 200 }}
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
            <InputNumber defaultValue={-1} />
          </div>
          <div className="flex justify-between items-center m-2 h-8">
            <div className="form-label">
              The maximum degree of the graph (min = -1):
            </div>
            <InputNumber defaultValue={1000} />
          </div>
          <div className="flex justify-between items-center m-2 h-8">
            <div className="form-label">
              The maximum length for any discriminating path. -1 if unlimited
              (min = -1):
            </div>
            <InputNumber defaultValue={-1} />
          </div>
          <div className="flex justify-between items-center m-2 h-8">
            <div className="form-label">
              A time lag for time series data, automatically applied (zero if
              none):
            </div>
            <InputNumber defaultValue={0} />
          </div>
          <div className="flex justify-between items-center m-2 h-8">
            <div className="form-label">
              Yes if the complete FCI rule set should be used:
            </div>
            <Radio.Group>
              <Radio value={1}>Yes</Radio>
              <Radio value={0}>No</Radio>
            </Radio.Group>
          </div>
          <div className="flex justify-between items-center m-2 h-8">
            <div className="form-label">
              Yes if the discriminating path rule should be done, No if not:
            </div>
            <Radio.Group>
              <Radio value={1}>Yes</Radio>
              <Radio value={0}>No</Radio>
            </Radio.Group>
          </div>
          <div className="flex justify-between items-center m-2 h-8">
            <div className="form-label">
              Yes if the possible msep search should be done:
            </div>
            <Radio.Group>
              <Radio value={1}>Yes</Radio>
              <Radio value={0}>No</Radio>
            </Radio.Group>
          </div>
          <div className="flex justify-between items-center m-2 h-8">
            <div className="form-label">
              Yes if verbose output should be printed or logged:
            </div>
            <Radio.Group>
              <Radio value={1}>Yes</Radio>
              <Radio value={0}>No</Radio>
            </Radio.Group>
          </div>
        </Card>
        <Card title="BDeu Score" className="m-2">
          <div className="flex justify-between items-center m-2 h-8">
            <div className="form-label">
              Prior equivalent sample size (min = 1.0):
            </div>
            <InputNumber defaultValue={10} />
          </div>
          <div className="flex justify-between items-center m-2 h-8">
            <div className="form-label">
              Structure prior coefficient (min = 0.0):
            </div>
            <InputNumber defaultValue={1} />
          </div>
        </Card>
        <Card title="G Square Test" className="m-2">
          <div className="flex justify-between items-center m-2 h-8">
            <div className="form-label">
              Cutoff for p values (alpha) (min = 0.0):
            </div>
            <InputNumber defaultValue={0.01} />
          </div>
        </Card>
        <Card title="BootStrapping" className="m-2">
          <div className="flex justify-between items-center m-2 h-8">
            <div className="form-label">
              The number of bootstraps / resampling iterations (min = 0):
            </div>
            <InputNumber defaultValue={0} />
          </div>
          <div className="flex justify-between items-center m-2 h-8">
            <div className="form-label">
              The percentage of resample size (min = 10%):
            </div>
            <InputNumber defaultValue={100} />
          </div>
          <div className="flex justify-between items-center m-2 h-8">
            <div className="form-label">
              Seed for pseudorandom number generation (-1 = off):
            </div>
            <InputNumber defaultValue={-1} />
          </div>
          <div className="flex justify-between items-center m-2 h-8">
            <div className="form-label">
              Yes, if adding the original dataset as another bootStrapping:
            </div>
            <Radio.Group>
              <Radio value={1}>Yes</Radio>
              <Radio value={0}>No</Radio>
            </Radio.Group>
          </div>
          <div className="flex justify-between items-center m-2 h-8">
            <div className="form-label">
              Yes, if sampling with replacement (bootstrapping):
            </div>
            <Radio.Group>
              <Radio value={1}>Yes</Radio>
              <Radio value={0}>No</Radio>
            </Radio.Group>
          </div>
          <div className="flex justify-between items-center m-2 h-8">
            <div className="form-label">
              Yes, if individual bootstrapping graphs should be saved:
            </div>
            <Radio.Group>
              <Radio value={1}>Yes</Radio>
              <Radio value={0}>No</Radio>
            </Radio.Group>
          </div>
        </Card>
      </Card>
      <div className="flex w-full gap-5">
        <Button type="primary" className="grow">
          上一步
        </Button>
        <Button type="primary" className="grow">
          生成因果图
        </Button>
      </div>
    </div>
  );
}
