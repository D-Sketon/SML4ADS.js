import React, { ReactElement, useEffect, useState } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import { FILE_SUFFIX } from "../../../constants";

import "codemirror/mode/xml/xml";
import "codemirror/addon/lint/lint.css";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/panda-syntax.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/lint/json-lint";
import "codemirror/addon/scroll/simplescrollbars.css";
import "codemirror/addon/scroll/simplescrollbars";

import "./index.less";

interface TextProps {
  path: string;
  ext: FILE_SUFFIX;
}

function Text(props: TextProps): ReactElement {
  const { path, ext } = props;
  const simpleExt = (() => {
    switch (ext) {
      case FILE_SUFFIX.JSON:
        return "application/json";
      case FILE_SUFFIX.XML:
      case FILE_SUFFIX.XODR:
        return "xml";
      default:
        return "application/json";
    }
  })();
  const [content, setContent] = useState<string>("");

  // onMounted
  useEffect(() => {
    const asyncFn = async () => {
      const content = await window.electronAPI.readFile(path);
      if (ext === FILE_SUFFIX.JSON) {
        setContent(JSON.stringify(JSON.parse(content), null, 2));
      } else {
        setContent(content);
      }
    };
    asyncFn();
  }, [ext, path]);

  return (
    <div style={{ height: "100%" }}>
      <CodeMirror
        value={content}
        options={{
          mode: simpleExt,
          lineNumbers: true,
          scrollbarStyle: "simple",
        }}
        editorDidMount={(editor) => {
          editor.setSize("auto", "100%");
        }}
        onBeforeChange={(editor, data, value) => {}}
        onChange={(editor, data, value) => {}}
      />
    </div>
  );
}

export default Text;
