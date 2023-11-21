import fs from 'fs/promises';

async function newDirectory(_e: any, path: string, name: string) {
  try {
    await fs.access(`${path}/${name}`);
    _e?.sender.send('ui:onOpenNotification', 'error', 'Error', `Directory ${path}/${name} already exists`);
    return false;
  } catch (error) { }

  const pathName = `${path}/${name}`;
  try {
    await fs.mkdir(pathName);
  } catch (error: any) {
    _e?.sender.send('ui:onOpenNotification', 'error', 'Error', error.message);
    return false;
  }
  return true;
}

export default newDirectory;