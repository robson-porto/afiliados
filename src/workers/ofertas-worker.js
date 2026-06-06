const {
    ofertaExiste,
    salvarOferta
} = require("../services/ofertas");

async function executar() {
    const { log } =
    require("../services/logger");


    const ofertas = [
        {
            nome: "Notebook Lenovo",
            preco: 2499,
            preco_antigo: 3299,
            desconto: 24,
            link: "https://produto-002.com",
            origem: "worker"
        },
        {
            nome: "Smart TV Samsung",
            preco: 1899,
            preco_antigo: 2599,
            desconto: 26,
            link: "https://produto-003.com",
            origem: "worker"
        }
    ];

    for(const oferta of ofertas){

        const existe =
            await ofertaExiste(oferta.link);

        if(existe){

            console.log(
                "Já existe:",
                oferta.nome
            );

            continue;
        }

        const id =
            await salvarOferta(oferta);

        console.log(
            "Oferta salva:",
            id
        );
    }

}

module.exports = {
    executar
};
