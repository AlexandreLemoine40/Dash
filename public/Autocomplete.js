class Autocomplete {
    static jsShorthands = [
        { shorthand: 'gid', value: 'document.getElementById(\'\')'},
        { shorthand: 'qsa', value: 'document.querySelectorAll(\'\')'},
        { shorthand: 'qrs', value: 'document.querySelector(\'\')'},
        { shorthand: 'fn', value: `function name() {
    // Actions
}`},
        { shorthand: 'for', value: `for(let i = 0; i < array.length; i++) {
    const row = array[i]
}`},
        { shorthand: 'clo', value: 'console.log()'}
    ]

    constructor() {
        // Empty
    }
}