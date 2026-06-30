const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('railwayAPI', {
  onData: (callback) => {
    ipcRenderer.on('load-data', (event, data) => callback(data));
  },
  onError: (callback) => {
    ipcRenderer.on('load-error', (event, msg) => callback(msg));
  }
});
