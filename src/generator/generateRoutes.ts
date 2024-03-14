// @ts-nocheck
const fs = require("fs");
const path = require("path");
(() => {
  const pagesDirectory = path.resolve(__dirname, "../components/extends");

  const routeComponents = fs
    .readdirSync(pagesDirectory)
    .filter(
      (file) =>
        fs.statSync(path.join(pagesDirectory, file)).isFile() &&
        file.endsWith(".tsx")
    )
    .map((directory) => ({
      path: `/${directory
        .replace(".tsx", "")
        .replace(directory[0], directory[0].toLowerCase())}`,
      name: directory.replace(".tsx", ""),
      component: `./components/extends/${directory.replace(".tsx", "")}`,
    }));

  const routesContent = `
import React, { ReactElement } from "react";
import { Route } from "react-router-dom";
${routeComponents
  .map((route) => `import ${route.name} from "${route.component}";`)
  .join("\n")}

const extendRouter = (): ReactElement => {
  return (
    <React.Fragment>
      ${routeComponents
        .map(
          (route) =>
            `<Route path="${route.path}" element={<${route.name} />} />`
        )
        .join("\n")}
    </React.Fragment>
  );
};

export default extendRouter;
  `;
  fs.writeFileSync(
    path.resolve(__dirname, "../extendRouter.tsx"),
    routesContent
  );
})();
