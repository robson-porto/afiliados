const {
    ofertaExiste,
    salvarOferta
} = require("./services/ofertas");

(async()=>{

    const oferta = {
        nome: "SSD Kingston 1TB",
        preco: 279.90,
        preco_antigo: 399.90,
        desconto: 30,
        link: "https://produto-001.com",
        origem: "teste"
    };

    const existe = await ofertaExiste(
        oferta.link
    );

    if(existe){

        console.log("Oferta já cadastrada");
        process.exit();

    }

    const id = await salvarOferta(
        oferta
    );

    console.log(
        "Oferta salva:",
        id
    );

    process.exit();

})();
