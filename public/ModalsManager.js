class ModalsManager {
    static TreeModal = document.getElementById('tree-modal')
    static treeModalTitle = document.getElementById('tree-modal-title')
    static quickSearchModal = document.getElementById('quick-file-search-modal')
    static ProjectTree = document.getElementById('project-tree')
    static rightCaret = "fa-solid fa-caret-right"
    static downCaret = "fa-solid fa-caret-down"
    static project = {};
    static isQuickSearchModalShown = false
    static isTreeModalShown = false
    static HomeModal = document.getElementById('open-project-modal')

    static toggleTreeModal() {
        if (ModalsManager.isTreeModalShown) {
            ModalsManager.hideTreeModal()
        } else {
            ModalsManager.showTreeModal()
        }
    }

    static toggleQuickSearchModal() {
        if (ModalsManager.isQuickSearchModalShown) {
            ModalsManager.hideQuickSearchModal()
        } else {
            ModalsManager.showQuickSearchModal()
        }
        ModalsManager.isQuickSearchModalShown = !ModalsManager.isQuickSearchModalShown
    }

    static showQuickSearchModal() {
        document.getElementById('modals-container').style.display = 'initial'
        ModalsManager.quickSearchModal.style.display = 'grid'
        document.getElementById('quick-search-file-input').focus()
    }

    static hideQuickSearchModal() {
        document.getElementById('modals-container').style.display = 'none'
        ModalsManager.quickSearchModal.style.display = 'none'
        document.getElementById('quick-search-file-input').value = ''
    }

    static hideModals() {
        let modals = document.querySelectorAll('.modal')
        for (let i = 0; i < modals.length; i++) {
            const modal = modals[i];
            modal.style.display = 'none'
        }
        document.getElementById('modals-container').style.display = 'none'
    }

    static hideTreeModal() {
        ModalsManager.isTreeModalShown = false
        document.getElementById('modals-container').style.display = 'none'
        document.getElementById('tree-modal').style.display = 'none'
    }

    static showTreeModal() {
        ModalsManager.isTreeModalShown = true
        document.getElementById('modals-container').style.display = 'initial'
        document.getElementById('tree-modal').style.display = 'grid'
        document.getElementById('tree-search-file').focus()
    }

    static hideHomeModal() {
        document.getElementById('modals-container').style.display = 'none'
        ModalsManager.HomeModal.style.display = 'none'
    }

    static buildTreeModal(arg) {
        document.getElementById('tree-modal-title').innerHTML = arg.directory
        let project = arg.project
        for (let i = 0; i < project.content.length; i++) {
            const element = project.content[i];
            if (typeof element == 'object') {
                // Element is of type directory
                let directory = ModalsManager.buildDirectory(element)
                document.getElementById('project-tree').appendChild(directory)
            } else {
                // Element is of type file
                let file = ModalsManager.buildFile(element)
                document.getElementById('project-tree').appendChild(file)
            }
        }
    }

    static buildDirectory(directory) {
        let d = document.createElement('div')
        d.className = 'directory'
        let headerCaret = document.createElement('i')
        headerCaret.className = ModalsManager.rightCaret
        let header = document.createElement('div')
        header.className = 'directory-header'
        header.appendChild(headerCaret)
        header.innerHTML += ` ${directory.name}`
        d.appendChild(header)
        let content = document.createElement('div')
        content.className = 'directory-content'
        content.style.display = 'none'
        content.setAttribute('folded', true)
        d.appendChild(content)
        header.onclick = (e) => {
            if (content.getAttribute('folded') == 'true') {
                e.target.firstChild.className = ModalsManager.downCaret
                content.style.display = 'grid'
                content.setAttribute('folded', false)
            } else {
                e.target.firstChild.className = ModalsManager.rightCaret
                content.style.display = 'none'
                content.setAttribute('folded', true)
            }
        }
        for (let i = 0; i < directory.content.length; i++) {
            const element = directory.content[i];
            if (typeof element == 'object') {
                content.appendChild(ModalsManager.buildDirectory(element))
            } else {
                content.appendChild(ModalsManager.buildFile(element))
            }
        }
        return d
    }

    static buildFile(file) {
        let f = document.createElement('div')
        f.className = 'directory-item'
        if (file.length > 15) {
            file = file.substring(0, 25)
        }
        f.innerHTML = file
        return f
    }

    static setTreeModalTitle(title) {
        ModalsManager.treeModalTitle.innerHTML = title
    }
}
