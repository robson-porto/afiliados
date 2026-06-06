const axios = require("axios");
const cheerio = require("cheerio");

async function extrairProduto(link) {
    const resposta = await axios.get(link, {
        timeout: 15000,
        maxRedirects: 5,
        headers: {
            "User-Agent": "Mozilla/5.0",
            "Accept-Language": "pt-BR,pt;q=0.9"
        }
    });

    const $ = cheerio.load(resposta.data);

    const nome =
        $('meta[property="og:title"]').attr("content") ||
        $("title").text().trim();

    const imagem =
        $('meta[property="og:image"]').attr("content") ||
        $('meta[name="twitter:image"]').attr("content") ||
        $("#landingImage").attr("src");

    return {
        nome,
        imagem,
        link
    };
}

module.exports = {
    extrairProduto
};
