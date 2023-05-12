class Editor {
    static fileContent = document.getElementById('file-content');
    static editorContent = document.getElementById('code-container');
    static editorParentNode = document.getElementById('editor-view');

    #id;
    #elementId;
    #fileName;
    #filepath;
    #fileContent;
    #tab;
    #lines;
    #textEditor;
    #element;
    #type;

    constructor(fileName, fileContent, filePath) {
        this.#id = `editor-${filePath.replace(/\//g, '')}`
        this.#fileName = fileName
        this.#filepath = filePath
        this.#fileContent = fileContent
        this.#elementId = `${filePath.replace(/\//g, '')}`
        this.#tab = new EditorTab(fileName, this.#elementId);
        this.#lines = new Lines(this.#id, this.getNbLinesByFileContent());
        this.#type = fileName.split('.').pop();
        this.#textEditor = new TextEditor({ fileContent: this.#fileContent, type: this.#type, filepath: this.#filepath });
        this.#element = this.createElement();
        this.initEditorEvents();
    }

    getNbLinesByFileContent() {
        return this.#fileContent.split(/\n/).length;
    }

    show() {
        setTimeout(() => {
            this.#element.style.display = 'grid'
        }, 1)
        this.#tab.setActive()
    }

    hide() {
        this.#tab.setInactive()
        this.#element.style.display = 'none'
    }

    closeEditor() {
        // Better switching smoothness
        this.#element.remove()
        this.#tab.remove()
        window.electronAPI.closeFile(this.#filepath)
    }

    createElement() {
        let element = document.createElement('div')
        element.id = this.#elementId
        element.className = 'editor'
        element.appendChild(this.#lines.getElement())
        element.appendChild(this.#textEditor.getElement())
        return element;
    }

    get filePath() {
        return this.#filepath
    }

    get fileName() {
        return this.#fileName
    }

    get fileContent() {
        return this.#fileContent
    }

    get id() {
        return this.#id
    }

    getElement() {
        return this.#element;
    }

    focus() {
        this.#fileContent.focus()
    }

    initEditorEvents() {
        this.#textEditor.getElement().addEventListener('input', (e) => {
            this.#textEditor.textDisplay.update(e.target.value)
            // this.#textEditor.textDisplay.innerHTML = Prism.highlight(e.target.value, Prism.languages.javascript, 'javascript');
        })
    }

    getTab() {
        return this.#tab;
    }

    setTabInactive() {
        this.#tab.setInactive();
    }

    static getText() {
        return Editor.fileContent.value;
    }

    static setText(text) {
        Editor.fileContent.value = text;
    }

    static clearText() {
        Editor.fileContent.value = '';
    }

    static appendText(text) {
        Editor.fileContent.value += text;
    }

    static updateEditorContent() {
        let text = Editor.fileContent.getText()
        Editor.editorContent = text
    }

    static highlightContent() {
        let content = Editor.fileContent.value
        return content
    }

    static removeLine(i) {
        Line.getLine(i).removeLine()
    }

    static update() {
        Editor.editorContent.innerHTML = Editor.highlightContent()
    }
}
