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
            for (let i = 0; i < files.length; i++) {
                let file = files[i];
                console.log(file)
                window.electronAPI.openFile(file).then(data => {
                    this.addFile(data)
                })
            }
        } else {
            this.#id = Math.round(new Date().getTime() / 2)
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
            // Add editor to preferences file
        }
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
        Array.from(this.#editors)[index].setActive()
    }

    get id() {
        return this.#id
    }

    addFile(file) {
        if (!this.#editors.get(file.filePath)) {
            console.log(file)
            let editor = new Editor(file.fileName, file.fileContent, file.filePath);
            editor.getTab().element.onclick = (event) => {
                if (this.#activeEditor.id != editor.id) {
                    this.switch(editor)
                }
            }
            editor.getTab().closeElement.onclick = (event) => {
                event.stopPropagation()
                this.closeFile(editor)
            }
            for (const [key, value] of this.#editors) {
                value.hide()
            }
            this.#editors.set(file.filePath, editor)
            this.#tabsContainer.appendChild(editor.getTab().element)
            this.#editorsContainer.appendChild(editor.getElement())
            this.#activeEditor = editor
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
                // document.getElementById('home-view').style.display = 'initial'
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
        let p = new Panel(id, panel.files, panel.active)
    }
}