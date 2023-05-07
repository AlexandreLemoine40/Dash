class File {
    static types = [
        {
            type: 'js',
            icon: 'fa-brands fa-js'
        },
        {
            type: 'html',
            icon: 'fa-brands fa-html5'
        },
        {
            type: 'css',
            icon: 'fa-brands fa-css3'
        }
    ]

    #name;
    #content;
    #path;
    #type;
    #icon;
    /** Properties related to graphical elements */
    #element;

    constructor(file, parentPath, parentName) {
        this.#name = file
        this.#path = `${parentPath}/${parentName}/`
        this.setFileTypeAndIcon()
        this.#element = this.createElement()
    }

    setFileTypeAndIcon() {
        let extension = this.#name.split('.').pop()
        for (let i = 0; i < File.types.length; i++) {
            const type = File.types[i];
            if (type.type === extension) {
                this.#type = type.type
                this.#icon = type.icon
                break
            }
        }
    }

    openFile() {
        // Socket
    }

    get name() {
        return this.#name
    }

    get path() {
        return this.#path
    }

    rename(name) {
        this.#name = name
    }

    delete() {
        // Remove HTML Element
        // Remove file from ACT
    }

    reset() {
        this.show()
    }

    show() {
        this.#element.style.display = 'block'
    }

    hide() {
        this.#element.style.display = 'none'
    }

    matches(filter) {
        return this.#name.toLowerCase().includes(filter.toLowerCase())
    }

    createElement() {
        let f = document.createElement('div')
        f.className = 'directory-item'
        let file = this.#name
        if (this.#name.length > 15) {
            this.#name = this.#name.substring(0, 25)
        }
        f.innerHTML = `<i class='${this.#icon} file-icon'></i> ${file}`
        f.onclick = () => {
            window.electronAPI.openFile(`${this.#path}/${this.#name}`).then((data) => {
                EditorsManager.openFile(data)
                ModalsManager.hideTreeModal()
            })
        }
        return f
    }

    isDirectory() {
        return false
    }

    buildQuickSearchResult() {
        /**
         *  <div class="quick-file-search-item">
                <span class="quick-search-file-icon"><i class="fa-brands fa-js"></i></span>&nbsp;
                <span class="quick-search-file-name">index.js</span>&nbsp;
                <span class="quick-search-file-path">/home/alex/Dash/</span>
            </div>
        */
        let element = document.createElement('div')
        element.className = "quick-file-search-item"
        let iconContainer = document.createElement('span')
        iconContainer.className = "quick-search-file-icon"
        let icon = document.createElement('i')
        icon.className = this.#icon
        iconContainer.appendChild(icon)
        let name = document.createElement('span')
        name.className = "quick-search-file-name"
        name.innerHTML = this.#name + "&nbsp;"
        let path = document.createElement('span')
        path.className = "quick-search-file-path"
        path.innerHTML = this.#path
        element.appendChild(icon)
        element.appendChild(name)
        element.appendChild(path)
        return element
    }

    getElement() {
        return this.#element
    }
}