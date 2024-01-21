import { ReactElement, useCallback, useEffect, useRef, useState } from "react";
import { Controlled as ReactCodeMirror } from "react-codemirror2";
import CodeMirror from "codemirror";

import "codemirror/mode/yaml/yaml";
import "codemirror/mode/xml/xml";
import "codemirror/addon/scroll/simplescrollbars.css";
import "codemirror/addon/scroll/simplescrollbars";
import "codemirror/lib/codemirror.css";

import "./index.less";
import Title from "antd/es/typography/Title";
import { Button, notification } from "antd";

interface AdstlProps {
  path: string;
}

const customKeyWords = [
  ["IS EQUAL TO", "template-atom-keyword"],
  ["IS LESS THAN", "template-atom-keyword"],
  ["IS GREATER THAN", "template-atom-keyword"],
  ["IS NOT EQUAL TO", "template-atom-keyword"],
  ["IS NOT LESS THAN", "template-atom-keyword"],
  ["IS NOT GREATER THAN", "template-atom-keyword"],
  ["GLOBALLY", "template-future-keyword"],
  ["ALWAYS", "template-future-keyword"],
  ["FINALLY", "template-future-keyword"],
  ["UNTIL", "template-future-keyword"],
  ["IF", "template-logic-keyword"],
  ["THEN", "template-logic-keyword"],
  ["AND", "template-logic-keyword"],
  ["OR", "template-logic-keyword"],
  ["NOT", "template-logic-keyword"],
  ["FROM", "template-interval-keyword"],
  ["TO", "template-interval-keyword"],
  ["(", "template-bracket"],
  [")", "template-bracket"],
  ["__Extend__", "odd-inner"],
  ["INCLUDE", "odd-keyword"],
  ["EXCLUDE", "odd-keyword"],
  ["CONDITIONAL", "odd-keyword"],
  ["OF", "odd-keyword"],
  ["FOR", "odd-keyword"],
  ["IS", "odd-inner"],
  ["ARE", "odd-inner"],
];

const customStlKeyWords = [
  ["always", "template-future-keyword"],
  ["eventually", "template-future-keyword"],
  [" until ", "template-future-keyword"],
  [" and ", "template-logic-keyword"],
  [" or ", "template-logic-keyword"],
  ["not", "template-logic-keyword"],
  ["->", "template-logic-keyword"],
  ["<", "template-atom-keyword"],
  ["<=", "template-atom-keyword"],
  [">", "template-atom-keyword"],
  [">=", "template-atom-keyword"],
  ["==", "template-atom-keyword"],
  ["!=", "template-atom-keyword"],
];

CodeMirror.defineMode("adstl", () => ({
  token: (stream: any, state: any) => {
    const cmCustomCheckStreamFn = (streamWrapper: any) => {
      for (let i = 0; i < customKeyWords.length; i++) {
        if (streamWrapper.match(customKeyWords[i][0])) {
          return customKeyWords[i][1];
        }
      }
      return "";
    };
    const ch = stream.peek();
    /* comments */
    if (
      ch === "#" &&
      (stream.pos === 0 || /\s/.test(stream.string.charAt(stream.pos - 1)))
    ) {
      stream.skipToEnd();
      return "comment";
    }

    const ret = cmCustomCheckStreamFn(stream);
    if (ret.length > 0) return ret;

    stream.next();
    return null;
  },
  lineComment: "#",
}));

CodeMirror.defineMode("stl", () => ({
  token: (stream: any, state: any) => {
    const cmCustomCheckStreamFn = (streamWrapper: any) => {
      for (let i = 0; i < customStlKeyWords.length; i++) {
        if (streamWrapper.match(customStlKeyWords[i][0])) {
          return customStlKeyWords[i][1];
        }
      }
      return "";
    };

    const ret = cmCustomCheckStreamFn(stream);
    if (ret.length > 0) return ret;

    stream.next();
    return null;
  },
}));

export default function Adstl({ path }: AdstlProps): ReactElement {
  const [odd, setOdd] = useState("");
  const [template, setTemplate] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const oddRef = useRef<any>(null);
  const templateRef = useRef<any>(null);
  const oddCodeMirrorRef = useRef<any>(null);
  const templateCodeMirrorRef = useRef<any>(null);

  useEffect(() => {
    const asyncFn = async () => {
      const content = await window.electronAPI.readFile(path);
      const contents = content.split("\n---\n\n");
      setOdd(contents[0]);
      oddCodeMirrorRef.current.setValue(contents[0]);
      setTemplate(contents[1]);
      templateCodeMirrorRef.current.setValue(contents[1]);
    };
    asyncFn();
  }, [path]);

  useEffect(() => {
    const oddCodeMirror = CodeMirror(oddRef.current, {
      mode: "adstl",
      lineNumbers: true,
      scrollbarStyle: "simple",
      indentUnit: 2,
      tabSize: 2,
    });
    oddCodeMirrorRef.current = oddCodeMirror;
    oddCodeMirror.setSize("auto", "100%");
    oddCodeMirror.on("change", (editor: any) => {
      setOdd(editor.getValue());
    });
    const templateCodeMirror = CodeMirror(templateRef.current, {
      mode: "adstl",
      lineNumbers: true,
      scrollbarStyle: "simple",
      indentUnit: 2,
      tabSize: 2,
    });
    templateCodeMirrorRef.current = templateCodeMirror;
    templateCodeMirror.setSize("auto", "100%");
    templateCodeMirror.on("change", (editor: any) => {
      setTemplate(editor.getValue());
    });
    return () => {
      oddCodeMirror.off("change");
      templateCodeMirror.off("change");
      if (oddRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        oddRef.current.innerHTML = "";
      }
      if (templateRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        templateRef.current.innerHTML = "";
      }
    };
  }, []);

  const saveHook = useCallback(
    async (isManual = false) => {
      try {
        await window.electronAPI.writeFile(path, odd + "\n---\n\n" + template);
      } catch (error: any) {
        console.error(error);
        isManual &&
          notification.error({
            message: "Error",
            description: error.message,
          });
      }
    },
    [odd, path, template]
  );

  const handleKeyDown = async (event: React.KeyboardEvent) => {
    if (event.key.toLowerCase() === "s" && (event.ctrlKey || event.metaKey)) {
      await saveHook(true);
      event.preventDefault();
    }
  };

  const generateStl = async () => {
    try {
      const res = await window.electronAPI.generateStl(odd, template);
      setGeneratedContent(res);
    } catch (e: any) {
      notification.error({
        message: "Error",
        description: e.message,
      });
    }
  };

  return (
    <>
      <div className="w-full h-full" onKeyDown={handleKeyDown} tabIndex={0}>
        <div className="flex w-full" style={{ height: "60%" }}>
          <div className="w-1/2">
            <Title level={4} style={{ margin: 5 }}>
              ODD
            </Title>
            {/* <ReactCodeMirror
            className="adstl-editor"
            value={odd}
            options={{
              mode: "yaml",
              // lineNumbers: true,
              // scrollbarStyle: "simple",
              // indentUnit: 2,
              // tabSize: 2,
              // electricChars: false,
              smartIndent: true,
            }}
            editorDidMount={(editor) => {
              editor.setSize("auto", "100%");
            }}
            onBeforeChange={(editor, data, value) => {
              setOdd(value);
            }}
            onChange={(editor, data, value) => {}}
          /> */}
            <div className="adstl-editor" ref={oddRef} />
          </div>
          <div className="w-1/2">
            <Title level={4} style={{ margin: 5 }}>
              Template
            </Title>
            {/* <ReactCodeMirror
            className="adstl-editor"
            value={template}
            options={{
              mode: "adstl",
              lineNumbers: true,
              scrollbarStyle: "simple",
              indentUnit: 2,
              tabSize: 2,
              electricChars: false,
              smartIndent: false,
            }}
            editorDidMount={(editor) => {
              editor.setSize("100%", "100%");
            }}
            onBeforeChange={(editor, data, value) => {
              setTemplate(value);
            }}
            onChange={(editor, data, value) => {}}
          /> */}
            <div className="adstl-editor" ref={templateRef} />
          </div>
        </div>
        <div className="flex w-full" style={{ height: "40%" }}>
          <div style={{ width: "80%" }}>
            <ReactCodeMirror
              className="adstl-editor stl-editor"
              value={generatedContent}
              options={{
                mode: "stl",
                lineNumbers: true,
                scrollbarStyle: "simple",
                indentUnit: 2,
                tabSize: 2,
              }}
              editorDidMount={(editor) => {
                editor.setSize("auto", "100%");
              }}
              onBeforeChange={(editor, data, value) => {}}
              onChange={(editor, data, value) => {}}
            />
          </div>
          <div
            style={{ width: "20%" }}
            className="flex flex-col justify-end items-center"
          >
            <Button type="primary" className="m-2" onClick={generateStl}>
              Generate STL
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
