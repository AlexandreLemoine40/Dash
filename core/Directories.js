const fs = require('fs')

function buildTree(dir) {
    let content = { name: dir, content: new Array() }
    let rows = fs.readdirSync(dir, { withFileTypes: true })

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (row.isDirectory()) {
            // Construire le chemin vers le dossier à lister
            let p = `${content.name}${row.name}`
            // Lire le dossier et lister le contenu
            let d = buildTree(p)
            // Sauvegarder le dossier dans le contenu courrant
            content.content.push(d)
        } else {
            content.content.push(row.name)
        }
    }
    return content
}