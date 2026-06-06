const fs = require("fs");
const db = require("../database/db");

function log(tipo, mensagem){

    const linha = `[${new Date().toISOString()}] [${tipo}] ${mensagem}\n`;

    fs.appendFileSync(
        "/root/afiliados/logs/app.log",
        linha
    );

    db.run(
        "INSERT INTO logs (tipo, mensagem) VALUES (?, ?)",
        [tipo, mensagem]
    );
}

module.exports = { log };
