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

window.electronAPI.askPreferencies().then((data) => {
    document.getElementById('project-name').innerHTML = `- ${data.directory}`
    new Tree(data.project)
    ModalsManager.setTreeModalTitle(data.directory)
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
                /*EditorsManager.openEditor({
                    name: data.fileName,
                    content: data.fileContent,
                    path: data.filePath
                })*/
                ModalsManager.hideTreeModal()
            })
        }
    } else {
        document.getElementById('home-view').style.display = 'initial'
    }
})