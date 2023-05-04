class EditorsManager {
    static editors = new Map();
    static titlesContainer = document.getElementById('editors-titles-container')
    static editorsContainer = document.getElementById('editors-container')

    static openEditor(file) {
        let editor = new Editor(file.name, file.content, file.path);
        EditorsManager.editors.set(file.path, editor);
        document.querySelectorAll('.editor').forEach(editor => {
            editor.style.display = 'none'
        })
        // editor.append();
        document.getElementById('home-view').style.display = 'none'
    }

    static openNewFile() {
        let editor = new Editor('Untitled', '', '');
        EditorsManager.editors.set('', editor);
        document.querySelectorAll('.editor').forEach(editor => {
            editor.style.display = 'none'
        })
        // editor.append();
        ModalsManager.hideHomeModal()
    }

    static openFile(file, panel = undefined) {
        let p = panel
        if (!panel && Panels.list.size > 0) {
            p = Array.from(Panels.list.values()).pop()
        } else {
            p = Panels.createPanel()
        }
        p.addFile(file)
    }

    static openFileInNewPanel(file) {
        let p = Panels.createPanel()
        p.addFile(file)
   }
}