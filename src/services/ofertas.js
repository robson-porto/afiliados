const db = require("../database/db");

function ofertaExiste(link) {

    return new Promise((resolve, reject) => {

        db.get(
            "SELECT id FROM ofertas WHERE link = ?",
            [link],
            (err, row) => {

                if(err)
                    return reject(err);

                resolve(!!row);
            }
        );

    });

}

function salvarOferta(oferta) {

    return new Promise((resolve, reject) => {

        db.run(
            `
            INSERT INTO ofertas
            (
                nome,
                preco,
                preco_antigo,
                desconto,
                link,
                origem
            )
            VALUES (?,?,?,?,?,?)
            `,
            [
                oferta.nome,
                oferta.preco,
                oferta.preco_antigo,
                oferta.desconto,
                oferta.link,
                oferta.origem
            ],
            function(err){

                if(err)
                    return reject(err);

                resolve(this.lastID);
            }
        );

    });

}

module.exports = {
    ofertaExiste,
    salvarOferta
};
