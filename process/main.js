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
        icon: path.join(__dirname, "../images/icon.png"),
        webPreferences: {
            nodeIntegration: false,
            webgl: true, // Activer l'accélération matérielle pour WebGL
            experimentalCanvasFeatures: true, // Activer l'accélération matérielle pour Canvas
            accelerator: 'gpu', // Utiliser le GPU pour le rendu accéléré
            preload: path.join(__dirname, "ipc/client/preload.js")
        }
    })

    /*********** Test if Dash global preferences file exists */
    /*********** Test if Dash project preferences file exists */

    // let project = fs.readFileSync(os.homedir() + '.dash/project.txt').toString()
    let preferences = JSON.parse(fs.readFileSync(os.homedir() + '/.dash/preferences.json').toString())

    let preferencesPath = path.join(preferences.project, '.dash/preferences.json')
    let projectPreferences
    if (fs.existsSync(preferencesPath)) {
        projectPreferences = JSON.parse(fs.readFileSync(preferencesPath).toString())
    } else {
        // Create the directory
        fs.mkdirSync(preferences.project + '.dash')
        // For the test case
        let object = {
            "panels": {
                "165894913": {
                    "files": [
                        "/home/alex/Personnel/project-sandbox/src/App.js"
                    ],
                    "active": 0
                },
                "1658949132": {
                    "files": [
                        "/home/alex/Personnel/project-sandbox/index.js",
                        "/home/alex/Personnel/project-sandbox/index.css",
                        "/home/alex/Personnel/project-sandbox/theme.js"
                    ],
                    "active": 2
                }
            }
        }
        fs.writeFileSync(preferencesPath, JSON.stringify(object))
        projectPreferences = object
    }

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

    /*ipcMain.handle('closeFile', (event, file) => {
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
    })*/

    ipcMain.handle('openFile', (event, file) => {
        if (file != '') {
            const result = { fileName: file.split('/').pop(), filePath: file, fileContent: fs.readFileSync(file).toString() }
            return result
        }
    })

    ipcMain.on('openProject', (event, data) => {
        let directory = dialog.showOpenDialogSync({ properties: ['openDirectory'] })[0]
        /** TODO : make changes in the preferences variables */
        preferences.project = directory
        preferencesPath = preferences.project, '.dash/preferences.json'

        // Get the preferences for the project
        projectPreferences = JSON.parse(fs.readFileSync(preferencesPath).toString())
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
        console.log(projectPreferences)
        let project = buildTree(preferences.project)
        sort(project)
        win.setTitle(`IDIZ - ${preferences.project}`)
        return { panels: projectPreferences, directory: preferences.project, project: project }
    })

    ipcMain.on('openPanel', (event, data) => {
        projectPreferences.panels[data.panelId] = {
            files: [data.file],
            active: 0
        }
        updateProjectPreferences()
    })

    ipcMain.on('updatePanel', (event, data) => {
        if (data.action == 'closeFile') {
            console.log(data)
            console.log(projectPreferences.panels)
            for (let i = 0; i < projectPreferences.panels[data.panelId].files.length; i++) {
                let row = projectPreferences.panels[data.panelId].files[i]
                if (row == data.filePath) {
                    projectPreferences.panels[data.panelId].files.splice(i, 1)
                    break
                }
            }
            projectPreferences.panels[data.panelId].active = data.active
            // UPDATE ACTIVE EDITOR INDEX
        } else if (data.action == 'addFile') {
            // data.filePath is a string
            console.log(projectPreferences.panels[data.panelId])
            projectPreferences.panels[data.panelId].files.push(data.filePath)
            projectPreferences.panels[data.panelId].active = data.active
            // UPDATE ACTIVE EDITOR INDEX
        } else if (data.action == 'changeActive') {
            // Has to be an integer
            for (let i = 0; i < projectPreferences.panels[data.panelId].files.length; i++) {
                let row = projectPreferences.panels[data.panelId].files[i];
                if (row == data.active) {
                    projectPreferences.panels[data.panelId].active = i
                    break
                }
            }
        }
        updateProjectPreferences()
    })

    ipcMain.handle('closePanel', (event, panelId) => {
        if (projectPreferences.panels.hasOwnProperty(panelId)) {
            console.log(`deleting ${panelId}`)
            delete projectPreferences.panels[panelId]
            console.log(projectPreferences)
            updateProjectPreferences()
        }
        return true
    })

    function updateProjectPreferences() {
        fs.writeFileSync(preferencesPath, JSON.stringify(projectPreferences))
    }

    win.loadFile('ui/main.html')
}

app.whenReady().then(() => {
    createWindow()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})