function sort(directory) {
    for (let i = 0; i < directory.content.length - 1; i++) {
        const row = directory.content[i];
        let max = row
        let index = -1
        for (let j = i + 1; j < directory.content.length; j++) {
            const _row = directory.content[j];
            if (typeof _row === 'object') {
                if(typeof max === 'object') {
                    if(max.name < _row.name) {
                        max = _row
                        index = j
                    }
                } else {
                    max = _row
                    index = j
                }
            } else {
                if (typeof max != 'object' && max.name < _row.name) {
                    max = _row
                    index = j
                }
            }
        }
        if (max != row && index != -1) {
            let _r = row
            row = max
            directory.content[index] = _r
        }
    }
}

function sortByCopy(directory) {
    let array = new Array()
    for (let i = 0; i < directory.content.length - 1; i++) {
        const row = directory.content[i];
        // Trier les sous-dossiers contenus dans le dossier courant
        let max = row
        for (let j = i + 1; j < directory.content.length; j++) {
            const _row = directory.content[j];
            if (typeof _row === 'object') {
                if(typeof max === 'object') {
                    if(max.name < _row.name) {
                        max = _row
                    }
                } else {
                    max = _row
                }
            } else {
                if (typeof max != 'object' && max.name < _row.name) {
                    max = _row
                }
            }
        }
        array.push(max)
    }
    return array; // OU : directory.content = array
}

function recursiveSort(directory) {
    for (let i = 0; i < directory.content.length - 1; i++) {
        const row = directory.content[i]
        if(typeof row === 'object' && row.content.length > 0) {
            recursiveSort(row)
        }
        let max = row
        let index = -1
        for (let j = i + 1; j < directory.content.length; j++) {
            const _row = directory.content[j];
            if (typeof _row === 'object') {
                if(typeof max === 'object') {
                    if(max.name < _row.name) {
                        max = _row
                        index = j
                    }
                } else {
                    max = _row
                    index = j
                }
            } else {
                if (typeof max != 'object' && max.name < _row.name) {
                    max = _row
                    index = j
                }
            }
        }
        if (max != row && index != -1) {
            let _r = row
            row = max
            directory.content[index] = _r
        }
    }  
}

function recursiveSortByCopy(directory) {
    let array = new Array()
    for (let i = 0; i < directory.content.length - 1; i++) {
        const row = directory.content[i];
        if(typeof row === 'object' && row.content.length > 0) {
            row.content = recursiveSortByCopy(row)
        }
        // Trier les sous-dossiers contenus dans le dossier courant
        let max = row
        for (let j = i + 1; j < directory.content.length; j++) {
            const _row = directory.content[j];
            if (typeof _row === 'object') {
                if(typeof max === 'object') {
                    if(max.name < _row.name) {
                        max = _row
                    }
                } else {
                    max = _row
                }
            } else {
                if (typeof max != 'object' && max.name < _row.name) {
                    max = _row
                }
            }
        }
        array.push(max)
    }
    return array;
}