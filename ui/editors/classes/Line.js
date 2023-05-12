class Line {
    #number;
    #element;

    constructor(number) {
        this.#number = number;
        this.#element = this.createElement();
    }

    createElement() {
        let element = document.createElement('span');
        element.id = `line-${this.getNumber()}`;
        element.className = 'line';
        element.innerHTML = `${this.getNumber()}\n`;
        return element;
    }

    appendElement() {
        Line.linesContainer.appendChild(this.getElement());
    }

    getNumber() {
        return this.#number;
    }

    setNumber(newNumber) {
        this.#number = newNumber;
    }

    getElement() {
        return this.#element;
    }

    setElement(element) {
        this.#element = element;
    }
}
