import { ReactElement } from "react";
import AdsmlContent from "../../content/adsml/AdsmlContent";
import { MModel } from "../../../model/Model";

interface ExtendAdsmlContentProps {
  model: MModel;
}

export default function ExtendAdsmlContent({
  model,
}: ExtendAdsmlContentProps): ReactElement {
  return (
    <AdsmlContent
      model={model}
      handleCarClick={() => {}}
      className="left-info"
      style={{
        height: "460px",
        overflow: "auto",
      }}
    />
  );
}
