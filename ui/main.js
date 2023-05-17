/** Script to be execute on client side on page load **/

// window.electronAPI.[Function]

document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key == 'b') {
        ModalsManager.toggleTreeModal()
    }
    if (event.ctrlKey && event.key == 'o') {
        ModalsManager.toggleQuickSearchModal()
    }
    if (event.ctrlKey && event.shiftKey && event.key == 'O') {
        ModalsManager.toggleQuickSearchModal()
    }
    if (event.key == 'Escape') {
        ModalsManager.hideModals()
    }
})

document.getElementById('tree-search-file').addEventListener('keyup', (event) => {
    Tree.search(event.target.value)
})

let selectedQuickSearchResultItem = null
let limitQuickSearchResultItem
let matches = []
document.getElementById('quick-file-search-input').addEventListener('keydown', (event) => {
    if (event.key == 'ArrowDown' || event.key == 'ArrowUp') {
        event.preventDefault()
    }
})
document.getElementById('quick-file-search-input').addEventListener('keyup', (event) => {
    if (event.key == 'Enter') {
        // Open the selected file
        if (event.shiftKey) {
            // Open in a new panel
            let file = matches[selectedQuickSearchResultItem]
            window.electronAPI.openFile(`${file.path}/${file.name}`).then((data) => {
                Panel.openFileInNewPanel(data)
                ModalsManager.hideModals()
            })
        } else {
            // Open in the current panel
            let file = matches[selectedQuickSearchResultItem]
            window.electronAPI.openFile(`${file.path}/${file.name}`).then((data) => {
                Panel.openFile(data)
                ModalsManager.hideModals()
            })
        }
        selectedQuickSearchResultItem = null
        limitQuickSearchResultItem = undefined
        matches = []
        document.getElementById('quick-file-search-input').value = ''
        document.getElementById('quick-file-search-results').innerHTML = ''
    } else if (event.key == 'ArrowDown') {
        event.preventDefault()
        // Move down the selected
        if (selectedQuickSearchResultItem < limitQuickSearchResultItem - 1) {
            document.querySelectorAll('.quick-file-search-item')[selectedQuickSearchResultItem].classList.remove('active')
            selectedQuickSearchResultItem++
            document.querySelectorAll('.quick-file-search-item')[selectedQuickSearchResultItem].classList.add('active')
        }
    } else if (event.key == 'ArrowUp') {
        event.preventDefault()
        // Move up the selected
        if (selectedQuickSearchResultItem > 0) {
            document.querySelectorAll('.quick-file-search-item')[selectedQuickSearchResultItem].classList.remove('active')
            selectedQuickSearchResultItem--
            document.querySelectorAll('.quick-file-search-item')[selectedQuickSearchResultItem].classList.add('active')
        }

    } else if (event.target.value.length > 0) {
        matches = ModalsManager.quickSearch(Tree.getInstance().root, event.target.value)
        if (matches.length > 0) {
            ModalsManager.buildQuickSearchResult(matches)
            selectedQuickSearchResultItem = 0
            document.querySelectorAll('.quick-file-search-item')[selectedQuickSearchResultItem].classList.add('active')
            limitQuickSearchResultItem = matches.length
        }
        // Set the active result as first of the list (active class with background color)

    } else {
        document.getElementById('quick-file-search-results').innerHTML = ''
    }
})

/*function toggleNightShiftSettings() {
    let element = document.getElementById('nightshift-settings')
    let display = 'initial'
    if (window.getComputedStyle(element).getPropertyValue('display') == 'initial') {
        display = 'none'
    }
    element.style.display = display
}*/

function toggleNightShiftSettings() {
    if (document.body.classList.contains('nightshift')) {
        document.body.classList.remove('nightshift')
    } else {
        document.body.classList.add('nightshift')
    }
}