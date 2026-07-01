const { app, BrowserWindow, Menu, dialog } = require('electron');
const path = require('path');
const https = require('https');

const UPDATE_URL = 'https://api.github.com/repos/Rainboow1908/Mik_railways/releases/latest';
const CURRENT_VERSION = '1.2.3';
let mainWindow;

function checkUpdate() {
  return new Promise((resolve) => {
    const req = https.get(UPDATE_URL, { headers: { 'User-Agent': 'MikRailways' }, rejectUnauthorized: false }, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        try {
          const release = JSON.parse(body);
          resolve(release.tag_name ? release.tag_name.replace('v', '') : null);
        } catch { resolve(null); }
      });
    });
    req.on('error', () => resolve(null));
    req.setTimeout(10000, () => { req.destroy(); resolve(null); });
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400, height: 900, title: 'Mik Railways',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true, nodeIntegration: false,
    }
  });

  mainWindow.loadFile('page/index.html');

  const menu = Menu.buildFromTemplate([
    {
      label: '文件',
      submenu: [
        { label: '打开本地JSON...', click: () => {
          const r = dialog.showOpenDialogSync(mainWindow, { title: '选择JSON', filters: [{ name: 'JSON', extensions: ['json'] }], properties: ['openFile'] });
          if (r) { const fs = require('fs'); mainWindow.webContents.send('load-data', JSON.parse(fs.readFileSync(r[0], 'utf-8'))); }
        }},
        { label: '3D地图', click: () => mainWindow.loadFile('page/index.html') },
        { label: '2D地图', click: () => mainWindow.loadFile('page/map2d.html') },
        { type: 'separator' }, { label: '退出', role: 'quit' }
      ]
    },
    { label: '视图', submenu: [{ label: '刷新', role: 'reload' }, { label: '开发者工具', role: 'toggleDevTools' }] }
  ]);
  Menu.setApplicationMenu(menu);

  mainWindow.webContents.on('did-finish-load', async () => {
    const latest = await checkUpdate();
    if (latest && latest !== CURRENT_VERSION) {
      dialog.showMessageBox(mainWindow, {
        type: 'info', title: 'Update Available',
        message: `v${latest} available (current v${CURRENT_VERSION})`,
        buttons: ['Download', 'Cancel']
      }).then(r => {
        if (r.response === 0) require('electron').shell.openExternal('https://github.com/Rainboow1908/Mik_railways/releases/latest');
      });
    }
  });
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
