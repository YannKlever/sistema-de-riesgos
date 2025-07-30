async function tableExists(db, tableName) {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT name FROM sqlite_master WHERE type='table' AND name=?`,
            [tableName],
            (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(!!row);
                }
            }
        );
    });
}

async function addColumnIfNotExists(db, tableName, columnDefinition) {
    // Implementar lógica para añadir columnas si no existen
}

module.exports = {
    tableExists,
    addColumnIfNotExists
};