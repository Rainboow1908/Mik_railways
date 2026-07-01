const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('railwayAPI', {
  jsonURL: 'https://raw.githubusercontent.com/Rainboow1908/Mik_railways/main/page/railway_data.json',
  onOpenLocal: (cb) => ipcRenderer.on('load-data', (_, d) => cb(d)),
});
