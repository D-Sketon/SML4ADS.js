import readFile from '../io/readFile';
import parseModel from './json/parseModel.ts';
import writeXml from './uppaal/writeXml.ts';

const ADSML2Uppaal = (_e: any, workSpacePath: string, modelPath: string, outputPath: string) => {
  const content = readFile(_e, modelPath);
  const model = parseModel(_e, content, workSpacePath);
  writeXml(_e, model, outputPath);
}

export default ADSML2Uppaal;