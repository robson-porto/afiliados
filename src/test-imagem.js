const { extrairImagemProduto } = require("./services/extrair-imagem");

(async () => {
    const url = "https://www.amazon.com.br/b?ie=UTF8&node=122326793011&linkCode=sl2&tag=personalizedpagebanner-20&linkId=8652b69a555e5997fa3fe621b463eb42&language=pt_BR&ref_=as_li_ss_tl";

    const imagem = await extrairImagemProduto(url);

    console.log("Imagem encontrada:");
    console.log(imagem);

    process.exit();
})();
