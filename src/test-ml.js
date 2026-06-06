const { salvarOferta } = require("./services/ofertas");

(async () => {
    const oferta = {
        nome: "Produto Mercado Livre Teste",
        preco: 99.90,
        preco_antigo: 149.90,
        desconto: 33,
        link: "https://meli.la/2Q9XXzJ",
        origem: "mercadolivre",
        categoria: "Geral"
    };

    const id = await salvarOferta(oferta);

    console.log("Oferta Mercado Livre salva:", id);

    process.exit();
})();
