// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const { ipcMain } = require('electron');

const chooseFile = require('./node/chooseFile');
const generateTree = require("./node/generateTree");
const showOpenDialog = require('./node/showOpenDialog');

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
            },
            {
              label: 'Model',
            },
            {
              label: 'Tree',
            }
          ]
        },
        {
          type: 'separator',
        },
        {
          label: 'Settings',
        },
        {
          label: 'Close project',
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Delete',
        }
      ]
    },
    {
      label: 'Help',
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
  ipcMain.handle('file:generateTree', generateTree);
  ipcMain.handle('file:chooseFile', chooseFile);
  ipcMain.handle('file:showOpenDialog', showOpenDialog);

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

