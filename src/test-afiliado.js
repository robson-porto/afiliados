const { gerarLinkAfiliado } = require("./services/afiliados");

(async () => {
    const linkAmazon = await gerarLinkAfiliado(
        "amazon",
        "https://www.amazon.com.br/dp/B0XXXXXXX"
    );

    console.log("Amazon:");
    console.log(linkAmazon);

    const linkML = await gerarLinkAfiliado(
        "mercadolivre",
        "https://www.mercadolivre.com.br/produto-teste"
    );

    console.log("\nMercado Livre:");
    console.log(linkML);

    process.exit();
})();
