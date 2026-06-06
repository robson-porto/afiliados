const db = require("../database/db");

function buscarPendentes() {

    return new Promise((resolve,reject)=>{

        db.all(
            `
            SELECT *
            FROM ofertas
            WHERE mensagem_gerada = 0
            `,
            [],
            (err,rows)=>{

                if(err)
                    return reject(err);

                resolve(rows);

            }
        );

    });

}

module.exports = {
    buscarPendentes
};

