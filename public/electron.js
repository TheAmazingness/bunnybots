const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');
const { ipcMain } = electron;

let mainWindow;
let display;

function createWindow() {
  mainWindow = new BrowserWindow({ width: 900, height: 900 });
  mainWindow.loadURL(isDev ? 'http://localhost:3000?controls' : `file://${ path.join(__dirname, '../build/index.html?controls') }`);
  mainWindow.on('closed', () => mainWindow = null);

  display = new BrowserWindow({ width: 1440, height: 900 });
  display.loadURL(isDev ? 'http://localhost:3000?display' : `file://${ path.join(__dirname, '../build/index.html?display') }`);
  display.on('closed', () => display = null);

  ipcMain.on('prematch1', (event, args) => display.webContents.send('prematch1', args));
  ipcMain.on('prematch2', (event, args) => display.webContents.send('prematch2', args));
  ipcMain.on('match', (event, args) => display.webContents.send('match', args));
  ipcMain.on('postmatch', (event, args) => display.webContents.send('postmatch', args));
  ipcMain.on('rankings', () => display.webContents.send('rankings'));
  ipcMain.on('allianceSelection', (event, args) => display.webContents.send('allianceSelection', args));
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
    display.setFullScreen(true);
  }
});