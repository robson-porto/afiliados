const axios = require("axios");
const cheerio = require("cheerio");

async function extrairImagemProduto(urlProduto) {
    try {
        const resposta = await axios.get(urlProduto, {
            timeout: 15000,
            maxRedirects: 5,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
                "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
                "Accept": "text/html,application/xhtml+xml"
            }
        });

        const html = resposta.data;
        const $ = cheerio.load(html);

        let imagem =
            $('meta[property="og:image"]').attr("content") ||
            $('meta[name="twitter:image"]').attr("content") ||
            $("#landingImage").attr("src") ||
            $("#imgTagWrapperId img").attr("src");

        if (imagem) {
            return imagem;
        }

        const matchOld = html.match(/"large":"(https?:\/\/[^"]+)"/);

        if (matchOld && matchOld[1]) {
            return matchOld[1].replace(/\\u002F/g, "/");
        }

        const matchHiRes = html.match(/"hiRes":"(https?:\/\/[^"]+)"/);

        if (matchHiRes && matchHiRes[1]) {
            return matchHiRes[1].replace(/\\u002F/g, "/");
        }

        const matchDynamic = html.match(/data-a-dynamic-image="([^"]+)"/);

        if (matchDynamic && matchDynamic[1]) {
            const jsonText = matchDynamic[1]
                .replace(/&quot;/g, '"');

            const imagens = Object.keys(JSON.parse(jsonText));

            if (imagens.length > 0) {
                return imagens[0];
            }
        }

        return null;

    } catch (err) {
        console.error("Erro ao extrair imagem:", err.message);
        return null;
    }
}

module.exports = {
    extrairImagemProduto
};
