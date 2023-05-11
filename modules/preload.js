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
    changeActive: (data) => ipcRenderer.send('updatePanel', data),
    openPanelFile: (data) => ipcRenderer.send('updatePanel', data),
    closePanelFile: (data) => {
        console.log(data)
        ipcRenderer.send('updatePanel', data)
    },
    openPanel: (data) => ipcRenderer.send('openPanel', data),
    askPreferences: () => ipcRenderer.invoke('preferencies'),
    closePanel: (panelId) => ipcRenderer.invoke('closePanel', panelId),
    closeWindow: () => ipcRenderer.send('closeWindow'),
    maximizeWindow: () => ipcRenderer.send('maximizeWindow'),
    minimizeWindow: () => ipcRenderer.send('minimizeWindow')
})