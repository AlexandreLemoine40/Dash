class EditorsLayout {
    static SPLIT_MODE_COLUMN = 'column'
    static SPLIT_MODE_ROW = 'row'
    static SPLIT_SINGLE = 1
    static SPLIT_FOUR = 4

    static single() {
        // Un seul éditeur
        EditorsLayout.split(SPLIT_SINGLE)
    }

    static split(splitMode, nb) {
        switch(splitMode) {
            case EditorsLayout.SPLIT_MODE_COLUMN:
                EditorsLayout.splitColumns(nb);
                break;

            case EditorsLayout.SPLIT_MODE_ROW:
                EditorsLayout.splitRows(nb);
                break;
        }
    }

    static splitColumns(nb) {
        // Container display grid -> change grid-template-column
        // Vérifier avec le nombre d'enfants de la div container (nombre de panneaux d'editors)
    }

    static splitRows(nb) {

    }
}