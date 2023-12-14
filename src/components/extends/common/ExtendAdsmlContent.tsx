import { ReactElement } from "react";
import AdsmlContent from "../../content/adsml/AdsmlContent";
import { MModel } from "../../../model/Model";

interface ExtendAdsmlContentProps {
  model: MModel;
}

function ExtendAdsmlContent(props: ExtendAdsmlContentProps): ReactElement {
  const { model } = props;
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

export default ExtendAdsmlContent;
