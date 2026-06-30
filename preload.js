const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('railwayAPI', {
  fetchData: () => ipcRenderer.invoke('get-data'),
  onData: (callback) => {
    const handler = (event, data) => callback(data);
    ipcRenderer.on('load-data', handler);
    return () => ipcRenderer.removeListener('load-data', handler);
  }
});
