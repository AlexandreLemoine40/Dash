class Theme {
    static mainColor = '--main-color'
    static root = document.querySelector(':root')

    /**
     * 
     * @param {String} color : A string with a format like rgb(red, green, blue) or rgba(red, green, blue, opacity) or color keywords.
     */
    static setBackgroundColorVariable(color) {
        Theme.root.style.setProperty(Theme.mainColor, color)
    }

    /**
     * 
     * @returns A string which is the value of the css variable --main-color.
     */
    static getBackgroundColorVariableValue() {
        return Theme.root.getPropertyValue(Theme.mainColor)
    }

    // TODO : Being able to change every property of the theme:
    // ...
}