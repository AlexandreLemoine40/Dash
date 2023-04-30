class Lines {
    #lines;
    #element;
    #linesPreElement;

    constructor(editorId, nbLines) {
        this.#lines = new Array();
        this.#linesPreElement = this.createLinesPreElement();
        this.#element = this.createElement();
        this.init(nbLines);
    }

    createElement() {
        /**
         * <div class="editor-lines">
                <pre id="lines-container" class="lines-container"></pre>
            </div>
         */
        let element = document.createElement('div');
        element.className = 'editor-lines';
        element.appendChild(this.#linesPreElement);
        return element;
    }

    createLinesPreElement() {
        let linesPreElement = document.createElement('pre');
        linesPreElement.className = 'lines-container';
        return linesPreElement;
    }

    addLine() {
        let line = new Line(this.#lines.length);
        this.#lines.push(line);
        this.#linesPreElement.appendChild(line.getElement());
    }

    removeLine() {
        // let line = this.getLastLine()
    }

    getLastLine() {
        return this.#lines[this.getLastLineIndex()]
    }

    getLastLineIndex() {
        return this.#lines.length - 1
    }

    appendLine(line) {
        this.#element.appendChild(line.getElement())
    }

    init(nbLines) {
        for (let i = 0; i < nbLines; i++) {
            this.addLine();
        }
    }

    getElement() {
        return this.#element;
    }

    get element() {
        return this.#element;
    }

    static getNbLinesByFileContent(fileContent) {
        return fileContent.split(/\n/).length;
    }
}