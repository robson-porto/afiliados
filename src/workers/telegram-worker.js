const db = require("../database/db");
const { enviarTelegram } = require("../services/telegram");

async function executar() {

    db.all(
        `
        SELECT *
        FROM ofertas
        WHERE publicado = 0
        ORDER BY id ASC
        `,
        [],
        async (err, ofertas) => {

            if(err){
                console.error(err);
                return;
            }

            for(const oferta of ofertas){

                try{

                    const mensagem = `
🔥 OFERTA ENCONTRADA

📦 ${oferta.nome}

💰 De: R$ ${oferta.preco_antigo}

💵 Por: R$ ${oferta.preco}

🎯 Desconto: ${oferta.desconto}%

🔗 ${oferta.link}
`;

                    await enviarTelegram(
                        mensagem
                    );

                    db.run(
                        `
                        UPDATE ofertas
                        SET publicado = 1
                        WHERE id = ?
                        `,
                        [oferta.id]
                    );

                    console.log(
                        "Publicado:",
                        oferta.nome
                    );

                }catch(e){

                    console.error(e);

                }

            }

        }
    );

}

module.exports = {
    executar
};
