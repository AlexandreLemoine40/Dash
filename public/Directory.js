class Directory {
    static rightCaretClass = "fa-solid fa-caret-right"
    static downCaretClass = "fa-solid fa-caret-down"

    #name;
    #content;
    #path;
    #folded;
    /** Properties related to graphical elements */
    #element;
    #contentElement;
    #headerElement;
    #headerCaretElement;

    constructor(directory) {
        this.#name = directory.name
        this.#path = directory.path
        this.#content = this.parseContent(directory.content)
        this.#folded = true
        this.createElement()
    }

    search(filter) {
        let nbMatches = 0
        let nbSubmatches = 0
        if (filter.length > 0) {
            for (let i = 0; i < this.#content.length; i++) {
                const element = this.#content[i];
                if (element.isDirectory()) {
                    nbSubmatches = element.search(filter)
                } else if (element.matches(filter)) {
                    // unfold all parent directories
                    element.show()
                    nbMatches++
                } else {
                    // Hide element in treeview
                    element.hide()
                }
            }
            if (nbMatches == 0 && nbSubmatches == 0) {
                this.hide()
            } else {
                this.show()
                this.unFold()
            }
        } else {
            for (let i = 0; i < this.#content.length; i++) {
                this.#content[i].reset()
            }
        }
        return nbMatches + nbSubmatches
    }

    fold() {
        // Caret right & content display = none;
        // Has to access the element object through e.target to achieve changing its class
        // e.target.firstChild.className = Directory.rightCaretClass
        this.#contentElement.style.display = 'none'
    }

    reset() {
        this.fold()
        this.showChildren()
        this.show()
    }

    show() {
        this.#element.style.display = 'initial'
    }

    showChildren() {
        for (let i = 0; i < this.#content.length; i++) {
            let element = this.#content[i];
            element.show()
            if (element.isDirectory()) {
                element.fold()
                element.showChildren()
            }
        }
    }

    hide() {
        this.#element.style.display = 'none'
    }

    unFold(e) {
        // Caret down & content display = grid;
        // Has to access the element object through e.target to achieve changing its class
        // e.target.firstChild.className = Directory.downCaretClass
        this.#contentElement.style.display = 'grid'
    }

    toggleFold(e) {
        if (this.#folded) {
            this.unFold(e)
        } else {
            this.fold(e)
        }
        this.#folded = !this.#folded
    }

    createElement() {
        let element = document.createElement('div')
        element.className = 'directory'
        this.#headerCaretElement = document.createElement('i')
        this.#headerCaretElement.className = Directory.rightCaretClass
        /** Creating Header element */
        this.#headerElement = this.createHeaderElement()
        element.appendChild(this.#headerElement)
        /** Creating Content element */
        this.#contentElement = this.createContentElement()
        element.appendChild(this.#contentElement)
        this.buildContent()
        this.#element = element;
    }

    createHeaderElement() {
        let header = document.createElement('div')
        header.className = 'directory-header'
        header.appendChild(this.#headerCaretElement)
        header.innerHTML += ` ${this.#name}`
        header.onclick = (e) => {
            this.toggleFold(e)
        }
        return header
    }

    createContentElement() {
        let element = document.createElement('div')
        element.className = 'directory-content'
        element.style.display = 'none'
        return element
    }

    parseContent(actContent) {
        let content = []
        for (let i = 0; i < actContent.length; i++) {
            const element = actContent[i];
            if (typeof element === 'object') {
                content.push(new Directory(element))
            } else {
                content.push(new File(element, this.#path, this.#name))
            }
        }
        return content
    }

    buildContent() {
        for (let i = 0; i < this.#content.length; i++) {
            const element = this.#content[i];
            this.#contentElement.appendChild(element.getElement())
        }
    }

    getContent() {
        return this.#content
    }

    isDirectory() {
        return true
    }

    getElement() {
        return this.#element
    }

    addContent(element) {
        this.#contentElement.appendChild(element.getElement())
    }
}