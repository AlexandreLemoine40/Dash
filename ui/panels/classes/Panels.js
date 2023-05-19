/**
 * Static class
 */
class Panels {
    static list = new Map()

    static container = document.getElementById('panels-container')

    static createPanel() {
        let panel = new Panel()
        Panels.list.set(panel.id, panel)
        return panel
    }

    static remove(panel) {
        // TODO : ...
    }
}