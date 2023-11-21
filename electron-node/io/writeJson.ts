import fs from 'fs/promises';

async function writeJson(_e: any, path: string, object: any) {
  const json = JSON.stringify(object);
  try {
    await fs.writeFile(path, json);
  } catch (error: any) {
    _e?.sender.send('ui:onOpenNotification', 'error', 'Error', error.message);
    return false;
  }
  return true;
}

export default writeJson;