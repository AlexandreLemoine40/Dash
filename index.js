const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const os = require("os");
const fs = require('fs')
const path = require('path')

const buildTree = (dir) => {
    // 'dir' value has to non end with a '/' -> this shouldn't happen since __dirname doesn't return directory names suffixed by slashes
    // 'act' stands for 'Abstract Content Tree' derived from 'Asbtract Syntax Tree'
    let name = dir.split('/')[dir.split('/').length - 1]
    let index = dir.split('/').length - 1
    let path = dir.split('/')
    path.splice(index, 1)
    path = path.join('/')
    let act = { path: path, name: name, content: new Array() }
    // Each file/directory in the directory 'dir'
    let rows = fs.readdirSync(dir, { withFileTypes: true })
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (row.isDirectory()) {
            if (!row.name.startsWith('.')) act.content.push(buildTree(`${act.path.length > 0 ? act.path + '/' : ''}${act.name}/${row.name}`))
        } else {
            act.content.push(row.name)
        }
    }
    return act
}

function sort(directory) {
    for (let i = 0; i < directory.content.length - 1; i++) {
        let row = directory.content[i];
        let max = row
        let index = -1
        for (let j = i + 1; j < directory.content.length; j++) {
            let _row = directory.content[j];
            if (typeof max === 'object') {
                if (typeof _row === 'object' && _row.name < max.name) {
                    max = _row
                    index = j
                }
            } else {
                if (typeof _row === 'object') {
                    // Prio
                    max = _row
                    index = j
                } else if (_row < max) {
                    max = _row
                    index = j
                }
            }
        }
        if (max != row && index != -1) {
            let _r = directory.content[i]
            directory.content[i] = max
            directory.content[index] = _r
        }
    }
    for (let i = 0; i < directory.content.length; i++) {
        if (typeof directory.content[i] === 'object' && directory.content[i].content.length > 0) {
            sort(directory.content[i])
        }
    }
}

const createWindow = () => {
    // By default, IDIZ opens the current directory as projet root
    const win = new BrowserWindow({
        width: 1920,
        height: 1080,
        frame: false,
        webPreferences: {
            nodeIntegration: false,
            webgl: true, // Activer l'accélération matérielle pour WebGL
            experimentalCanvasFeatures: true, // Activer l'accélération matérielle pour Canvas
            accelerator: 'gpu', // Utiliser le GPU pour le rendu accéléré
            preload: path.join(__dirname, "modules/preload.js")
        }
    })

    let preferences = JSON.parse(fs.readFileSync(path.join(__dirname, '.dash/preferences.json')).toString())

    ipcMain.on('saveFile', (event, data) => {
        // First: check the mtime to see if there's newer versions of the file since the last save/opening
        fs.writeFile(data.filePath, data.fileContent, (err) => {
            let evt = 'fileSaved'
            if (err) {
                evt = 'fileSaveFailed'
            }
            event.reply(evt, { fileName: data.filePath })
        })
    })

    ipcMain.handle('closeFile', (event, file) => {
        let currentPreferenciesPath = path.join(__dirname, '.dash/')
        let filesOpenedPath = currentPreferenciesPath + 'editors.txt'
        let filesOpened = []
        let index = -1
        if (fs.existsSync(filesOpenedPath)) {
            filesOpened = fs.readFileSync(filesOpenedPath).toString().split('\n')
            for (let i = 0; i < filesOpened.length; i++) {
                const f = filesOpened[i];
                if (file == f) {
                    index = i
                    break
                }
            }
        }
        if (index > -1) {
            filesOpened.splice(index, 1)
            fs.writeFileSync(filesOpenedPath, filesOpened.join('\n'))
        }
        return true
    })

    ipcMain.handle('openFile', (event, file) => {
        if (file != '') {
            let currentPreferenciesPath = path.join(__dirname, '.dash/')
            let filesOpenedPath = currentPreferenciesPath + 'editors.txt'
            let isOpened = false
            let filesOpened = []
            if (fs.existsSync(filesOpenedPath)) {
                filesOpened = fs.readFileSync(filesOpenedPath).toString().split('\n')
                for (let i = 0; i < filesOpened.length; i++) {
                    const f = filesOpened[i];
                    if (file == f) {
                        isOpened = true
                        break
                    }
                }
            }
            if (!isOpened) {
                filesOpened.push(file)
                fs.writeFileSync(filesOpenedPath, filesOpened.join('\n'))
            }
            const result = { fileName: file.split('/').pop(), filePath: file, fileContent: fs.readFileSync(file).toString() }
            return result
        }
    })

    ipcMain.on('openProject', (event, data) => {
        let directory = dialog.showOpenDialogSync({ properties: ['openDirectory'] })[0]
        fs.writeFileSync(path.join(os.homedir(), '.dash/project.txt'), directory)
        let project = buildTree(directory)
        sort(project)
        win.setTitle(`IDIZ - ${directory}`)
        win.webContents.send('projectOpened', { directory: directory, project: project, preferencies: null })
    })

    ipcMain.on('minimizeWindow', () => {
        win.minimize()
    })

    ipcMain.on('maximizeWindow', () => {
        if (win.isMaximized()) {
            win.restore()
        } else {
            win.maximize()
        }
    })

    ipcMain.on('closeWindow', () => {
        win.close()
    })

    ipcMain.handle('preferencies', (event) => {
        console.log(preferences)
        let project = buildTree(__dirname)
        sort(project)
        win.setTitle(`IDIZ - ${__dirname}`)
        return { panels: preferences, directory: __dirname, project: project }
    })

    ipcMain.on('openPanel', (event, data) => {
        preferences[data.panelId] = {
            files: [data.file],
            active: 0
        }
        updatePreferences()
    })

    ipcMain.on('updatePanel', (event, data) => {
        if (data.action == 'closeFile') {
            for (let i = 0; i < preferences.panels[data.panelId].files.length; i++) {
                let row = preferences.panels[data.panelId].files[i]
                if (row == data.filePath) {
                    preferences.panels[data.panelId].files.splice(i, 1)
                    break
                }
            }
            preferences.panels[data.panelId].active = data.active
            // UPDATE ACTIVE EDITOR INDEX
        } else if (data.action == 'addFile') {
            // data.filePath is a string
            console.log(preferences.panels[data.panelId])
            preferences.panels[data.panelId].files.push(data.filePath)
            preferences.panels[data.panelId].active = data.active
            // UPDATE ACTIVE EDITOR INDEX
        } else if (data.action == 'changeActive') {
            // Has to be an integer
            for (let i = 0; i < preferences.panels[data.panelId].files.length; i++) {
                let row = preferences.panels[data.panelId].files[i];
                if (row == data.active) {
                    preferences.panels[data.panelId].active = i
                    break
                }
            }
        }
        updatePreferences()
    })

    ipcMain.handle('closePanel', (event, panelId) => {
        if (preferences.panels.hasOwnProperty(panelId)) {
            console.log(`deleting ${panelId}`)
            delete preferences.panels[panelId]
            console.log(preferences)
            updatePreferences()
        }
        return true
    })

    function updatePreferences() {
        fs.writeFileSync(path.join(__dirname, '.dash/preferences.json'), JSON.stringify(preferences))
    }

    win.loadFile('index.html')
}

app.whenReady().then(() => {
    createWindow()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})