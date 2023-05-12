class TextDisplay {
    #element;
    #value;
    #type;

    constructor(args) {
        this.#type = this.initType(args.type)
        this.#element = this.createElement(args.fileContent);
    }

    createElement(fileContent) {
        let element = document.createElement('pre');
        element.className = 'code-container';
        // element.setAttribute('data-language', 'javascript')
        element.innerHTML = this.highlight(fileContent);
        return element;
    }

    getElement() {
        return this.#element;
    }

    highlight(content) {
        return hljs.highlight(content, { language: this.#type }).value;
    }

    initType(type) {
        let _type = ''
        switch (type) {
            case 'js':
                _type = 'javascript'
                break
            case 'html':
                _type = 'html'
                break
            case 'css':
                _type = 'css'
                break
            case 'py':
                _type = 'python'
        }
        return _type
    }

    update(value) {
        this.#value = value;
        this.#element.innerHTML = this.highlight(value);
    }

    /** TODO : Better calling (for a single file each time) */
    static highlightExtra() {
        let params = document.querySelectorAll('.hljs-params')
        for (let i = 0; i < params.length; i++) {
            console.log(params[i])
            params[i].innerHTML = params[i].innerHTML.replace(/\,/g, '<span class="hljs-comma">,</span>')
        }
    }
}