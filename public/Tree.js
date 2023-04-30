class Tree {
    #root;
    #act;
    #treeElement;

    constructor(act = undefined) {
        if(Tree.instance) {
            return Tree.instance
        } else {
            this.#act = act ? act : [];
            this.#root = new Directory(this.#act)
            this.#treeElement = document.getElementById('project-tree')
            this.append()
            Tree.instance = this
        }
    }

    append() {
        for (let i = 0; i < this.#root.getContent().length; i++) {
            const element = this.#root.getContent()[i];
            this.#treeElement.appendChild(element.getElement())
        }
    }

    static getInstance() {
        return Tree.instance;
    }

    search(filter) {
        this.#root.search(filter)
    }

    static search(filter) {
        Tree.getInstance().search(filter)
    }
}