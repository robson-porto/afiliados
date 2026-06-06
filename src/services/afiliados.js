const db = require("../database/db");

function buscarAfiliado(plataforma) {
    return new Promise((resolve, reject) => {
        db.get(
            "SELECT * FROM afiliados WHERE plataforma = ? AND ativo = 1",
            [plataforma],
            (err, row) => {
                if (err) return reject(err);
                resolve(row);
            }
        );
    });
}

async function gerarLinkAmazon(urlProduto) {
    const afiliado = await buscarAfiliado("amazon");

    if (!afiliado) {
        return urlProduto;
    }

    const separador = urlProduto.includes("?") ? "&" : "?";

    return `${urlProduto}${separador}tag=${afiliado.identificador}`;
}

async function gerarLinkMercadoLivre(urlProduto) {
    const afiliado = await buscarAfiliado("mercadolivre");

    if (!afiliado) {
        return urlProduto;
    }

    // Por enquanto retorna o link original.
    // Depois ajustamos com o formato oficial do link gerado pelo painel do Mercado Livre.
    return urlProduto;
}

async function gerarLinkAfiliado(plataforma, urlProduto) {
    if (plataforma === "amazon") {
        return await gerarLinkAmazon(urlProduto);
    }

    if (plataforma === "mercadolivre") {
        return await gerarLinkMercadoLivre(urlProduto);
    }

    return urlProduto;
}

module.exports = {
    gerarLinkAfiliado
};
