class Panel {

    #id;
    #headerElement;
    #tabs;
    #tabsContainer;
    #closePanel;
    #splitPanel;
    #panelActions;
    #editors;
    #editorsContainer;
    #element;
    #activeEditor;

    constructor(id = undefined, files = undefined, active = undefined) {
        if (id && files && active > -1) {
            this.#id = id
        } else {
            this.#id = Math.round(new Date().getTime() / 2)
        }
        this.#tabs = new Map()
        this.#tabsContainer = this.createTabsContainer()
        this.#editorsContainer = this.createEditorsContainer()
        this.#closePanel = this.createClosePanel()
        this.#splitPanel = this.createSplitPanel()
        this.#headerElement = this.createHeader()
        this.#panelActions = this.createPanelActions()
        this.#element = this.createElement()
        this.append()
        this.#editors = new Map()
        this.#activeEditor = null
    }

    createElement() {
        let element = document.createElement('div')
        element.className = 'editor-view'
        element.id = `editor-view-${this.#id}`
        return element
    }

    createTabsContainer() {
        let element = document.createElement('div')
        element.className = 'editors-titles'
        element.id = `editors-titles-${this.#id}`
        return element
    }

    createEditorsContainer() {
        let element = document.createElement('div')
        element.className = 'editors-container'
        element.id = `editors-container-${this.#id}`
        return element
    }

    createPanelActions() {
        let element = document.createElement('div')
        element.className = 'panel-actions'
        return element
    }

    createHeader() {
        let element = document.createElement('div')
        element.className = 'panel-header'
        return element
    }

    createClosePanel() {
        let element = document.createElement('div')
        element.className = 'close-panel'
        // TODO : Replace innerHTML with a fontawesome icon
        element.innerHTML = '<i class="fa-sharp fa-light fa-xmark"></i>'
        let _element = document.createElement('div')
        _element.className = 'panel-action'
        _element.onclick = () => {
            this.close()
        }
        _element.appendChild(element)
        return _element
    }

    createSplitPanel() {
        let element = document.createElement('div')
        element.className = 'split-panel'
        // TODO : Replace innerHTML with a fontawesome icon
        element.innerHTML = '<i class="fa-sharp fa-light fa-columns-3"></i>'
        let _element = document.createElement('div')
        _element.className = 'panel-action'
        _element.onclick = () => {
            this.split()
        }
        _element.appendChild(element)
        return _element
    }

    append() {
        this.#panelActions.appendChild(this.#splitPanel)
        this.#panelActions.appendChild(this.#closePanel)
        this.#headerElement.appendChild(this.#tabsContainer)
        this.#headerElement.appendChild(this.#panelActions)
        this.#element.appendChild(this.#headerElement)
        this.#element.appendChild(this.#editorsContainer)
        document.getElementById('panels-container').appendChild(this.#element)
    }

    setActive(index) {
        let editor = Array.from(this.#editors.values())[index]
        editor.show()
        this.#activeEditor = editor
    }

    get id() {
        return this.#id
    }

    get files() {
        return Array.from(this.#editors.keys())
    }

    get active() {
        return this.#activeEditor
    }

    addFile(file, restored = false) {
        if (!this.#editors.get(file.filePath)) {
            let editor = new Editor(file.fileName, file.fileContent, file.filePath);
            editor.getTab().element.onclick = (event) => {
                console.log(this.#activeEditor)
                if (this.#activeEditor.id != editor.id) {
                    this.switch(editor)
                    window.electronAPI.changeActive({
                        action: 'changeActive',
                        panelId: this.#id,
                        active: editor.filePath
                    })
                }
            }
            editor.getTab().closeElement.onclick = (event) => {
                event.stopPropagation()
                this.closeFile(editor)
                let editors = Array.from(this.#editors.keys())
                if (editors.length > 0) {
                    let activeIndex = -1
                    for (let i = 0; i < editors.length; i++) {
                        let row = editors[i];
                        if (row == this.#activeEditor.filePath) {
                            activeIndex = i
                        }
                    }
                    window.electronAPI.closePanelFile({
                        action: 'closeFile',
                        panelId: this.#id,
                        filePath: editor.filePath,
                        active: activeIndex
                    })
                }
            }
            for (const [key, value] of this.#editors) {
                value.hide()
            }
            this.#editors.set(file.filePath, editor)
            this.#tabsContainer.appendChild(editor.getTab().element)
            this.#editorsContainer.appendChild(editor.getElement())
            if (!restored) {
                this.#activeEditor = editor
                editor.getTab().setActive()
            } else {
                editor.hide()
            }
            document.getElementById('home-view').style.display = 'none'
        }
    }

    hideActive() {
        if (this.#activeEditor) this.#activeEditor.hide()
    }

    switch(file) {
        if (this.#activeEditor) this.#activeEditor.hide()
        file.show()
        this.#activeEditor = file
    }

    focus() {
        // Get the only TextArea child displayed and focus it
    }

    remove() {
        this.#element.remove()
    }

    close() {
        // For each tabs of the panel -> window.electronAPI.closeFile(file)
        window.electronAPI.closePanel(this.#id).then((r) => {
            this.remove()
            Panels.list.delete(this.#id)
            if (Panels.list.size > 0) {
                // Get the last panel (default)
                let p = Array.from(Panels.list.values()).pop()
                p.focus()
            } else {
                document.getElementById('home-view').style.display = 'initial'
            }
        })
    }

    get editors() {
        return this.#editors
    }

    closeFile(editor) {
        editor.closeEditor()
        this.#editors.delete(editor.filePath)
        if (this.#editors.size > 0) {
            this.#activeEditor = Array.from(this.#editors.values()).pop()
            this.switch(this.#activeEditor)
        } else {
            this.close()
        }
    }

    split() {
        // If more than 1 file open
        // Create new panel
        // Send current editor to the new panel
        if (Array.from(this.#editors).length > 1) {
            let p = new Panel()
            p.copyEditor(this.#activeEditor)
            this.closeFile(this.#activeEditor)
        }
    }

    copyEditor(editor) {
        this.addFile({
            fileName: editor.fileName,
            fileContent: editor.fileContent,
            filePath: editor.filePath
        })
    }

    static createPanel(panel, id) {
        console.log(panel)
        let p = new Panel(id, panel.files, panel.active)
        for (let i = 0; i < panel.files.length; i++) {
            let file = panel.files[i];
            window.electronAPI.openFile(file).then(data => {
                p.addFile(data, true)
                if (i == panel.files.length - 1) {
                    p.setActive(panel.active)
                }
            })
        }
        Panels.list.set(id, p)
    }

    static openNewFile() {
        let editor = new Editor('Untitled', '', '');
        document.querySelectorAll('.editor').forEach(editor => {
            editor.style.display = 'none'
        })
        // editor.append();
        ModalsManager.hideHomeModal()
    }

    static openFile(file, panel = undefined) {
        let p = panel
        if (!panel && Panels.list.size > 0) {
            p = Array.from(Panels.list.values()).pop()
        } else {
            p = Panels.createPanel()
            window.electronAPI.openPanel({
                file: file.filePath,
                panelId: p.id
            })
        }
        p.addFile(file)
        window.electronAPI.openPanelFile({
            action: 'addFile',
            panelId: p.id,
            filePath: file.filePath,
            active: Array.from(p.editors).length - 1
        })
    }

    static openFileInNewPanel(file) {
        let p = Panels.createPanel()
        p.addFile(file)
        window.electronAPI.openPanel(p.id, file.filePath)
    }
}