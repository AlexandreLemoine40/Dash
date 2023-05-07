const targetNode = document.getElementById("editors-container");

window.electronAPI.onProjectOpened((_event, arg) => {
    if (!arg.canceled) {
        document.getElementById('open-project-modal').style.display = 'none'
        // ModalsManager.buildTreeModal(arg)
        new Tree(arg.project)
        ModalsManager.setTreeModalTitle(arg.directory)
        ModalsManager.showTreeModal()
    } else {
        console.log(arg.canceled)
    }
})

window.electronAPI.onFileSaved((_event, arg) => {
    // console.log(arg)
})

window.electronAPI.askPreferences().then((data) => {
    for (const key in data.panels.panels) {
        Panel.createPanel(data.panels.panels[key], key)
    }
    new Tree(data.project)
    document.getElementById('project-name').innerHTML = `- ${data.directory}`
    ModalsManager.setTreeModalTitle(data.directory)
})

/*window.electronAPI.askPreferences().then((data) => {
    
    if (data.filesOpened.length > 0 && !(data.filesOpened.length == 1 && data.filesOpened[0] == '')) {
        let files = data.filesOpened
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            window.electronAPI.openFile(file).then((data) => {
                EditorsManager.openFile({
                    name: data.fileName,
                    content: data.fileContent,
                    path: data.filePath
                })
                ModalsManager.hideTreeModal()
            })
        }
    } else {
    document.getElementById('home-view').style.display = 'initial'
}
})*/