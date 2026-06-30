const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('railwayAPI', {
  onData: (callback) => {
    ipcRenderer.on('load-data', (event, data) => callback(data));
  },
  getData: () => {
    return new Promise(resolve => {
      ipcRenderer.once('load-data', (event, data) => resolve(data));
    });
  }
});
