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

  const entryComponents = fs
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
    }))
    .reduce((acc, curr, index) => {
      if (index % 3 === 0) acc.push([]);
      acc[Math.floor(index / 3)].push(curr);
      return acc;
    }, []);

  const entryContent = `
import { ReactElement } from "react";
import { NavLink } from "react-router-dom";
import { Card, Col, Row } from "antd";

${entryComponents
  .map((entry) =>
    entry
      .map(
        (component) =>
          `import { meta as ${component.name}Meta } from "${component.component}";`
      )
      .join("\n")
  )
  .join("\n")}

const extendEntry = (): ReactElement => {
  return (
    <>
      ${entryComponents
        .map(
          (entry) =>
            `<Row gutter={16} className="mt-2 mb-2">
              ${entry
                .map(
                  (component) =>
                    `<Col span={8}>
                      <Card title={${component.name}Meta.title} extra={<NavLink to="${component.path}">More</NavLink>} className="h-52" hoverable={true}>
                      {${component.name}Meta.description}
                      </Card>
                    </Col>`
                )
                .join("\n")}
            </Row>`
        )
        .join("\n")}
    </>
  );
};

export default extendEntry;
  `;

  fs.writeFileSync(path.resolve(__dirname, "../extendEntry.tsx"), entryContent);
})();
