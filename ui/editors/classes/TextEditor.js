class TextEditor {
    #filepath;
    #element;
    #textArea;
    #textDisplay;

    constructor(args) {
        this.#filepath = args.filepath
        this.#textArea = this.createTextArea(args.fileContent);
        this.#textDisplay = new TextDisplay({ fileContent: args.fileContent, type: args.type });
        this.#element = this.createElement();
    }

    createElement() {
        let element = document.createElement('div')
        element.className = 'editor-content'
        element.appendChild(this.#textArea);
        element.appendChild(this.#textDisplay.getElement());
        return element;
    }

    createTextArea(fileContent) {
        let element = document.createElement('textarea');
        element.name = 'file-content';
        element.className = 'file-content';
        element.cols = '30';
        element.setAttribute('resizeable', 'false')
        element.setAttribute('spellcheck', 'false')
        element.setAttribute('filepath', this.#filepath)
        element.value = fileContent;
        // Bind event oninput
        element.oninput = (e) => {
            this.#textDisplay.update(e.target.value)
        }
        element.onkeydown = (e) => {
            if (e.ctrlKey) {
                if (e.key == 's') {
                    window.electronAPI.saveFile(this.#filepath, e.target.value)
                } else if (e.key == 'x') {
                    // Supprimer la ligne et la mettre dans le presse papier
                    // Récupérer la numéro de la ligne courante
                    var startPos = e.target.selectionStart;
                    var endPos = e.target.selectionEnd;
                    if (startPos == endPos) {
                        e.preventDefault()
                        // L'utilisateur n'a pas séléctionné de texte, on surcharge ctrl+x
                        let lines = e.target.value.split('\n')
                        let currentPos = e.target.value.substring(0, startPos)
                        let nbLines = currentPos.split('\n').length
                        navigator.clipboard.writeText(lines[nbLines - 1]).then(() => {
                            lines.splice(nbLines - 1, 1)
                            lines = lines.join('\n')
                            e.target.value = lines
                            this.#textDisplay.update(e.target.value)
                            currentPos = currentPos.split('\n')
                            currentPos.pop()
                            currentPos = currentPos.join('\n').length
                            e.target.selectionStart = currentPos
                            e.target.selectionEnd = e.target.selectionStart
                        }, () => {
                            // Nothing
                        });
                    }
                } else if (e.key == 'w') {
                    // Fermer l'editeur sans enregistrer
                } else if (e.key == 'b') {
                    e.preventDefault()
                    // ModalsManager.showTreeModal()
                    // Toggle tree view
                } else if (e.key == 'f') {
                    // Search in the file
                } else if (e.key == 'c') {
                    var startPos = e.target.selectionStart;
                    var endPos = e.target.selectionEnd;
                    if (startPos == endPos) {
                        e.preventDefault()
                        let lines = e.target.value.split('\n')
                        let currentPos = e.target.value.substring(0, startPos)
                        let nbLines = currentPos.split('\n').length
                        navigator.clipboard.writeText(lines[nbLines - 1]).then(() => {
                            // console.log('Copied to clipboard')
                        }, () => {
                            // Nothing
                        });
                    }
                }
            } else {
                if (e.key == 'Tab') {
                    // TODO :
                    // Traiter le cas de l'auto complétion avec la touche Tab
                    // ...

                    // Empêcher le changement de focus
                    e.preventDefault()
                    var startPos = e.target.selectionStart;
                    var endPos = e.target.selectionEnd;
                    // Intégrer une tabulation à l'endroit du curseur = prendre la value avant
                    // le curseur, concaténer avec une tabulation et concaténer avec la valeur 
                    // après le curseur
                    e.target.value = e.target.value.substring(0, startPos)
                        + '    '
                        + e.target.value.substring(endPos, e.target.value.length);
                    // Mettre le curseur à l'endroit de l'insertion
                    e.target.selectionStart = startPos + 4;
                    e.target.selectionEnd = startPos + 4;
                    // Répercuter les changements sur le contenu affiché
                    this.#textDisplay.update(e.target.value)
                }
            }
        }
        return element;
    }

    get textDisplay() {
        return this.#textDisplay;
    }

    getElement() {
        return this.#element;
    }
}