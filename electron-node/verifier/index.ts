import readFile from '../io/readFile';
import parseModel from './json/parseModel';
import writeXml from './uppaal/writeXml';

const ADSML2Uppaal = (_e: any, workSpacePath: string, modelPath: string, outputPath: string) => {
  const content = readFile(_e, modelPath);
  const model = parseModel(_e, content, workSpacePath);
  writeXml(_e, model, outputPath);
}

export default ADSML2Uppaal;