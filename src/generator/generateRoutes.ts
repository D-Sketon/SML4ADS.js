// @ts-nocheck
const fs = require("fs");
const path = require("path");

const isTsxFile = (pagesDirectory: string, fileName: string) => {
  return (
    fs.statSync(path.join(pagesDirectory, fileName)).isFile() &&
    fileName.endsWith(".tsx")
  );
};

const isFolder = (pagesDirectory: string, folderName: string) => {
  return (
    fs.statSync(path.join(pagesDirectory, folderName)).isDirectory() &&
    fs.readdirSync(path.join(pagesDirectory, folderName)).includes("index.tsx")
  );
};

(() => {
  const pagesDirectory = path.resolve(__dirname, "../components/extends");

  const routeComponents = fs
    .readdirSync(pagesDirectory)
    .filter(
      (file) =>
        isTsxFile(pagesDirectory, file) || isFolder(pagesDirectory, file)
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
