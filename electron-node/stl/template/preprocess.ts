export const convertIndentToNestedString = (indentString: string): string => {
  if(indentString.startsWith("#")) return indentString;
  const lines = indentString.split("\n");
  let result = "";
  let indentLevel = 0;

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (trimmedLine !== "") {
      const currentIndent = line.match(/^\s*/)![0].length / 2;

      while (currentIndent > indentLevel) {
        result += "( ";
        indentLevel++;
      }

      while (currentIndent < indentLevel) {
        result += ") ";
        indentLevel--;
      }

      result += trimmedLine + "\n";
    }
  }

  while (indentLevel > 0) {
    result += " )";
    indentLevel--;
  }

  return result.trim();
};
