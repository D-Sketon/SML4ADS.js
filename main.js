// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');
const { ipcMain } = require('electron');

const generateTree = require("./node/io/generateTree");
const newProject = require('./node/io/newProject');
const newDirectory = require('./node/io/newDirectory');
const newFile = require('./node/io/newFile');
const readFile = require('./node/io/readFile');
const deleteFile = require('./node/io/deleteFile');
const writeJson = require('./node/io/writeJson');
const getRelativePath = require('./node/io/getRelativePath');

const chooseDirectory = require('./node/ui/chooseDirectory');
const chooseFile = require('./node/ui/chooseFile');

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    }
  })

  const menuTemplate = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New',
          submenu: [
            {
              label: 'Directory',
              click() {
                mainWindow.webContents.send('ui:onNewDirectory');
              }
            },
            {
              label: 'Model',
              click() {
                mainWindow.webContents.send('ui:onNewFile', 'model');
              }
            },
            {
              label: 'Tree',
              click() {
                mainWindow.webContents.send('ui:onNewFile', 'tree');
              }
            }
          ]
        },
        {
          type: 'separator',
        },
        {
          label: 'Settings',
          click() {
            mainWindow.webContents.send('ui:onShowSettings');
          }
        },
        {
          label: 'Close project',
          click() {
            mainWindow.webContents.send('chore:onClearStore');
            mainWindow.webContents.send('chore:onChangeRoute', '/welcome');
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Delete',
          click() {
            mainWindow.webContents.send('ui:onDeleteFile');
          }
        }
      ]
    },
    {
      label: 'Help',
      click() {
        shell.openExternal("https://github.com/D-Sketon/SML4ADS.js")
      }
    }
  ]

  const menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)

  const startUrl =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : path.join(__dirname, "/build/index.html");
  mainWindow.loadURL(startUrl);

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  ipcMain.handle('io:generateTree', generateTree);
  ipcMain.handle('io:newProject', newProject);
  ipcMain.handle('io:newDirectory', newDirectory);
  ipcMain.handle('io:newFile', newFile);
  ipcMain.handle('io:readFile', readFile);
  ipcMain.handle('io:deleteFile', deleteFile);
  ipcMain.handle('io:writeJson', writeJson);
  ipcMain.handle('io:getRelativePath', getRelativePath);

  ipcMain.handle('ui:chooseFile', chooseFile);
  ipcMain.handle('ui:chooseDirectory', chooseDirectory);

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})
