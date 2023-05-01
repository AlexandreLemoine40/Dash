class Panel {

    #id;
    #tabs;
    #tabsContainer;
    #editors;
    #editorsContainer;
    #element;
    #activeEditor;

    constructor() {
        this.#id = Math.round(new Date().getTime() / 2)
        this.#tabs = new Map()
        this.#tabsContainer = this.createTabsContainer()
        this.#editorsContainer = this.createEditorsContainer()
        this.#element = this.createElement()
        this.append()
        this.#editors = new Map()
        this.#activeEditor = null
    }

    /**
     * 
     * <div class="section editor-view" id="editor-view">
       </div>
     */
    createElement() {
        let element = document.createElement('div')
        element.className = 'editor-view'
        element.id = `editor-view-${this.#id}`
        return element
    }

    /**
     * <div class="editor-titles" id="editor-titles-container">
       </div>
       <div class="editors" id="editors-container">
       </div>
     */

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

    append() {
        this.#element.appendChild(this.#tabsContainer)
        this.#element.appendChild(this.#editorsContainer)
        document.getElementById('panels-container').appendChild(this.#element)
    }

    get id() {
        return this.#id
    }

    addFile(file) {
        if (!this.#editors.get(file.name)) {
            let editor = new Editor(file.name, file.content, file.path);
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
            this.#editors.set(file.path, editor)
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
        this.remove()
        Panels.list.delete(this.#id)
        if (Panels.list.size > 0) {
            // Get the last panel (default)
            let p = Array.from(Panels.list.values()).pop()
            p.focus()
        } else {
            document.getElementById('home-view').style.display = 'initial'
        }
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

    static split() {
        // Open the file in a new panel
    }

    static moveFile() {
        // Move to another panel
    }
}