const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("/root/afiliados/data/afiliados.db");

db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS ofertas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT,
            preco REAL,
            preco_antigo REAL,
            desconto REAL,
            link TEXT UNIQUE,
            origem TEXT,
            publicado INTEGER DEFAULT 0,
            criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

});

module.exports = db;
