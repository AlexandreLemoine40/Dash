class EditorTab {
    static TAB_ACTIVE_CLASS = 'active';

    #editorId;
    #name;
    #element;
    #closeElement;
    #stateElement;

    constructor(name, editorId) {
        this.#name = name;
        this.#editorId = editorId;
        this.#closeElement = this.createCloseElement()
        this.#element = this.createElement();
    }

    get name() {
        return this.#name;
    }

    get closeElement() {
        return this.#closeElement
    }

    get element() {
        return this.#element;
    }

    set name(name) {
        if (typeof name === 'string') {
            this.#name = name;
        }
    }

    get closeElement() {
        return this.#closeElement
    }

    get editorId() {
        return this.#editorId
    }

    remove() {
        this.#element.remove()
    }

    createCloseElement() {
        let closeElement = document.createElement('span');
        closeElement.className = 'close-element'
        closeElement.innerHTML = '&#x2715'
        return closeElement
    }

    createElement() {
        let element = document.createElement('div');
        element.id = `tab-${this.#editorId}`
        element.className = 'editor-title active';
        let titleElement = document.createElement('div');
        titleElement.className = 'title';
        let fileNameElement = document.createElement('span')
        fileNameElement.className = 'filename'
        fileNameElement.innerHTML = this.#name;
        titleElement.appendChild(fileNameElement)
        let stateElement = document.createElement('span')
        stateElement.className = 'state-element'
        stateElement.innerHTML = '&#x2726'
        element.appendChild(titleElement);
        titleElement.appendChild(stateElement);
        titleElement.appendChild(this.#closeElement);
        return element;
    }

    setActive() {
        if (!this.isActive()) {
            this.#element.className = 'editor-title active'
        }
    }

    setInactive() {
        let classList = this.getClassList();
        if (this.isActive()) {
            classList.remove(EditorTab.TAB_ACTIVE_CLASS);
        }
    }

    isActive() {
        return this.#element.classList.contains(EditorTab.TAB_ACTIVE_CLASS)
    }

    getClassList() {
        return this.#element.classList;
    }

    static removeActive() {
        let activeTab = document.querySelector('.editor-title.active');
        if (activeTab) activeTab.classList.remove('active');
    }
}