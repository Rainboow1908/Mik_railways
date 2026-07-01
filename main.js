const { app, BrowserWindow, Menu, dialog } = require('electron');
const path = require('path');

const UPDATE_URL = 'https://api.github.com/repos/Rainboow1908/Mik_railways/releases/latest';
const CURRENT_VERSION = '1.1.0';
let mainWindow;

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
      const res = await fetch(UPDATE_URL, { headers: { 'User-Agent': 'MikRailways' } });
      if (res.ok) {
        const release = await res.json();
        const latest = release.tag_name ? release.tag_name.replace('v', '') : '0.0.0';
        if (latest !== CURRENT_VERSION) {
          dialog.showMessageBox(mainWindow, {
            type: 'info', title: '发现新版本',
            message: `v${latest} 可用（当前 v${CURRENT_VERSION}）`,
            buttons: ['前往', '取消']
          }).then(r => { if (r.response === 0) require('electron').shell.openExternal(release.html_url); });
        }
      }
    } catch {}
  });
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
