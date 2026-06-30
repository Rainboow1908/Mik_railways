const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

let mainWindow;
let currentData = null;

function openFile() {
  const result = dialog.showOpenDialogSync(mainWindow, {
    title: '选择 railway_data.json',
    filters: [{ name: 'JSON', extensions: ['json'] }],
    properties: ['openFile']
  });
  if (result && result[0]) {
    try {
      const raw = fs.readFileSync(result[0], 'utf-8');
      currentData = { path: result[0], json: JSON.parse(raw) };
      mainWindow.webContents.send('load-data', currentData.json);
    } catch (e) {
      dialog.showErrorBox('错误', 'JSON 解析失败: ' + e.message);
    }
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    title: 'Mik 轨道交通',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    }
  });

  mainWindow.loadFile('page/index.html');

  const menu = Menu.buildFromTemplate([
    {
      label: '文件',
      submenu: [
        { label: '打开 JSON...', accelerator: 'CmdOrCtrl+O', click: openFile },
        { label: '3D 地图', click: () => mainWindow.loadFile('page/index.html') },
        { label: '2D 地图', click: () => mainWindow.loadFile('page/map2d.html') },
        { type: 'separator' },
        { label: '退出', role: 'quit' }
      ]
    },
    {
      label: '视图',
      submenu: [
        { label: '刷新', role: 'reload' },
        { label: '开发者工具', role: 'toggleDevTools' },
      ]
    }
  ]);
  Menu.setApplicationMenu(menu);

  // 窗口加载完自动弹出文件选择
  mainWindow.webContents.on('did-finish-load', () => {
    if (!currentData) openFile();
  });
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
