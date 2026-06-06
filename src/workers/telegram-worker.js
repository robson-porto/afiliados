const db = require("../database/db");
const { enviarTelegramComBotao } = require("../services/telegram");

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

                   const categoria = oferta.categoria || "ofertas";

const hashtag = categoria
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9]/g, "");

const mensagem = `
🔥 <b>OFERTA ENCONTRADA</b>

📦 <b>${oferta.nome}</b>

💰 De: <s>R$ ${oferta.preco_antigo}</s>
💵 Por: <b>R$ ${oferta.preco}</b>

🎯 <b>${oferta.desconto}% OFF</b>

#${hashtag} #promocao #ofertas
`;
                   await enviarTelegramComBotao(
    mensagem,
    oferta.link
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
