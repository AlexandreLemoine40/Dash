class NightShift {
    static class = 'nightshift'
    static activated = false
    static element = document.body

    static activate() {
        if (!NightShift.element.classList.contains(NightShift.class)) {
            NightShift.element.classList.add(NightShift.class)
        }
    }

    static deactivate() {
        if (NightShift.element.classList.contains(NightShift.class)) {
            NightShift.element.classList.remove(NightShift.class)
        }
    }

    static toggle() {
        if (NightShift.activated) {
            NightShift.deactivate()
        } else {
            NightShift.activate()
        }
        // Invert the activated boolean
        NightShift.activated = !NightShift.activated
    }
}