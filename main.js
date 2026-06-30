const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const path = require('path');
const https = require('https');

const JSON_URL = 'https://raw.githubusercontent.com/Rainboow1908/Mik_railways/main/page/railway_data.json';
const UPDATE_URL = 'https://api.github.com/repos/Rainboow1908/Mik_railways/releases/latest';
const CURRENT_VERSION = '1.0.0';
let mainWindow;

function fetchJSON() {
  return new Promise((resolve, reject) => {
    https.get(JSON_URL, { headers: { 'User-Agent': 'MikRailways' } }, res => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        try { resolve(JSON.parse(body)); }
        catch (e) { reject(new Error('JSON解析失败: ' + e.message)); }
      });
    }).on('error', e => reject(new Error('联网失败: ' + e.message)));
  });
}

function checkUpdate() {
  return new Promise(resolve => {
    https.get(UPDATE_URL, { headers: { 'User-Agent': 'MikRailways' } }, res => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        try {
          const release = JSON.parse(body);
          const latest = release.tag_name ? release.tag_name.replace('v', '') : '0.0.0';
          resolve({ latest, current: CURRENT_VERSION, url: release.html_url, hasUpdate: latest !== CURRENT_VERSION });
        } catch { resolve(null); }
      });
    }).on('error', () => resolve(null));
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
    try {
      const data = await fetchJSON();
      mainWindow.webContents.send('load-data', data);
    } catch (e) {
      dialog.showErrorBox('加载失败', e.message + '\n\n可手动：文件→打开本地JSON');
    }
    const update = await checkUpdate();
    if (update && update.hasUpdate) {
      dialog.showMessageBox(mainWindow, {
        type: 'info', title: '发现新版本',
        message: `新版本 v${update.latest} 可用（当前 v${update.current}）`,
        detail: '是否前往下载？', buttons: ['前往', '取消']
      }).then(r => { if (r.response === 0) require('electron').shell.openExternal(update.url); });
    }
  });
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
