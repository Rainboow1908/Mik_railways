const { app, BrowserWindow, Menu, dialog } = require('electron');
const path = require('path');
const https = require('https');

const JSON_URLS = [
  'https://cdn.jsdelivr.net/gh/Rainboow1908/Mik_railways@main/page/railway_data.json',
  'https://raw.githubusercontent.com/Rainboow1908/Mik_railways/main/page/railway_data.json',
];
const UPDATE_URL = 'https://api.github.com/repos/Rainboow1908/Mik_railways/releases/latest';
const CURRENT_VERSION = '1.0.0';
let mainWindow;

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'MikRailways' } }, res => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        try { resolve(JSON.parse(body)); }
        catch (e) { reject(new Error('解析失败')); }
      });
    }).on('error', () => reject());
  });
}

async function tryFetchJSON() {
  for (const url of JSON_URLS) {
    try { return await fetchJSON(url); } catch {}
  }
  return null;
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

  // 窗口先显示，后台加载数据
  mainWindow.webContents.on('did-finish-load', async () => {
    const data = await tryFetchJSON();
    if (data) {
      mainWindow.webContents.send('load-data', data);
    }

    // 更新检测（静默，不阻塞）
    https.get(UPDATE_URL, { headers: { 'User-Agent': 'MikRailways' } }, res => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        try {
          const release = JSON.parse(body);
          const latest = release.tag_name ? release.tag_name.replace('v', '') : '0.0.0';
          if (latest !== CURRENT_VERSION) {
            dialog.showMessageBox(mainWindow, {
              type: 'info', title: '发现新版本',
              message: `v${latest} 可用（当前 v${CURRENT_VERSION}）`,
              buttons: ['前往', '取消']
            }).then(r => { if (r.response === 0) require('electron').shell.openExternal(release.html_url); });
          }
        } catch {}
      });
    }).on('error', () => {});
  });
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
