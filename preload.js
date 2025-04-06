
const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electron', {
    downloadVideo: (url, filename) => {
      ipcRenderer.send('download-video', { url, filename });
    },
    onDownloadPathSelected: (callback) => {
      ipcRenderer.on('download-path-selected', (event, data) => callback(data));
    }
  }
);
