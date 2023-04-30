const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    setTitle: (title) => ipcRenderer.send('set-title', title),
    getTree: () => ipcRenderer.send('tree', '.'),
    openFile: (path) => ipcRenderer.invoke('openFile', path),
    closeFile: (path) => ipcRenderer.invoke('closeFile', path),
    toggleOpenFile: () => ipcRenderer.send('toggleOpenFile'),
    openProject: () => ipcRenderer.send('openProject'),
    onProjectOpened: (callback) => ipcRenderer.on('projectOpened', callback),
    onFileSaved: (callback) => ipcRenderer.on('fileSave', callback),
    saveFile: (file, content) => ipcRenderer.send('saveFile', { filePath: file, fileContent: content }),
    askPreferencies: () => ipcRenderer.invoke('preferencies')
})