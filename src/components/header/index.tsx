import React, { ReactElement } from "react";
import { Button } from "antd";
import "./index.less";

function HeaderButton(): ReactElement {
  return (
    <>
      <div className="header-wrapper">
        <Button>Preprocessing</Button>
        <Button>Verify</Button>
        <Button>PSTL</Button>
        <Button type="primary">Simulate</Button>
      </div>
    </>
  );
}

export default HeaderButton;
