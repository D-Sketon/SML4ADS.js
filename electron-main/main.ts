import { app, BrowserWindow, Menu, shell, ipcMain } from "electron";
import path from "path";

import newDirectory from "../electron-node/io/newDirectory";
import deleteFile from "../electron-node/io/deleteFile";
import generateTree, { _generateTree } from "../electron-node/io/generateTree";
import getAbsolutePath from "../electron-node/io/getAbsolutePath";
import getRelativePath from "../electron-node/io/getRelativePath";
import newFile from "../electron-node/io/newFile";
import newProject from "../electron-node/io/newProject";
import readFile from "../electron-node/io/readFile";
import writeJson from "../electron-node/io/writeJson";
import writeFile from "../electron-node/io/writeFile";
import readConfig from "../electron-node/io/readConfig";
import writeConfig from "../electron-node/io/writeConfig";
import chooseDirectory from "../electron-node/ui/chooseDirectory";
import chooseFile from "../electron-node/ui/chooseFile";
import ADSML2Uppaal from "../electron-node/verifier/index";
import ADSML2OpenScenario from "../electron-node/converter/openScenario2";
import { generateStl } from "../electron-node/stl/index";
import extendRPC from "../electron-node/rpc/extends";
import simulate from "../electron-node/rpc/simulate";
import visualize from "../electron-node/rpc/visualize";
import onVideoFileSelected from "../electron-node/video/fileSelect";
import { evaluateEnvironment } from "../electron-node/evaluate/environment";
import { evaluateCar, evaluatePedestrian, evaluateRider } from "../electron-node/evaluate/participant";
import { evaluateMap } from "../electron-node/evaluate/map";
import { evaluateTree } from "../electron-node/evaluate/tree";

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      preload: path.resolve(__dirname, "../electron-preload/preload.js"),
      nodeIntegration: true,
    },
  });

  const menuTemplate = [
    {
      label: "File",
      submenu: [
        {
          label: "New",
          submenu: [
            {
              label: "Directory",
              click() {
                mainWindow.webContents.send("ui:onNewDirectory");
              },
            },
            {
              label: "Model",
              click() {
                mainWindow.webContents.send("ui:onNewFile", "model");
              },
            },
            {
              label: "Tree",
              click() {
                mainWindow.webContents.send("ui:onNewFile", "tree");
              },
            },
          ],
        },
        {
          type: "separator",
        },
        {
          label: "Settings",
          click() {
            mainWindow.webContents.send("ui:onShowSettings");
          },
        },
        {
          label: "Close project",
          click() {
            mainWindow.webContents.send("chore:onClearStore");
            mainWindow.webContents.send("chore:onChangeRoute", "/welcome");
          },
        },
      ],
    },
    {
      label: "Edit",
      submenu: [
        {
          label: "Delete",
          click() {
            mainWindow.webContents.send("ui:onDeleteFile");
          },
        },
      ],
    },
    {
      label: "Help",
      click() {
        shell.openExternal("https://github.com/D-Sketon/SML4ADS.js");
      },
    },
  ];

  const menu = Menu.buildFromTemplate(menuTemplate as any);
  Menu.setApplicationMenu(menu);

  const startUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : path.resolve(__dirname, "../../build/index.html");
  mainWindow.loadURL(startUrl);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  ipcMain.handle("io:generateTree", generateTree);
  ipcMain.handle("io:_generateTree", _generateTree);
  ipcMain.handle("io:newProject", newProject);
  ipcMain.handle("io:newDirectory", newDirectory);
  ipcMain.handle("io:newFile", newFile);
  ipcMain.handle("io:readFile", readFile);
  ipcMain.handle("io:deleteFile", deleteFile);
  ipcMain.handle("io:writeJson", writeJson);
  ipcMain.handle("io:writeFile", writeFile);
  ipcMain.handle("io:getRelativePath", getRelativePath);
  ipcMain.handle("io:getAbsolutePath", getAbsolutePath);
  ipcMain.handle("io:readConfig", readConfig);
  ipcMain.handle("io:writeConfig", writeConfig);

  ipcMain.handle("ui:chooseFile", chooseFile);
  ipcMain.handle("ui:chooseDirectory", chooseDirectory);

  ipcMain.handle("verifier:ADSML2Uppaal", ADSML2Uppaal);

  ipcMain.handle("rpc:extendRPC", extendRPC);
  ipcMain.handle("rpc:simulate", simulate);
  ipcMain.handle("rpc:visualize", visualize);

  ipcMain.handle("video:fileSelect", onVideoFileSelected);

  ipcMain.handle("stl:generateStl", generateStl);

  ipcMain.handle("converter:ADSML2OpenScenario", ADSML2OpenScenario);

  ipcMain.handle("evaluate:environment", evaluateEnvironment);
  ipcMain.handle("evaluate:car", evaluateCar);
  ipcMain.handle("evaluate:pedestrian", evaluatePedestrian);
  ipcMain.handle("evaluate:rider", evaluateRider);
  ipcMain.handle("evaluate:map", evaluateMap);
  ipcMain.handle("evaluate:tree", evaluateTree);

  createWindow();

  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") app.quit();
});
