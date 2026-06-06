function extrairAsinAmazon(url) {
    const match = url.match(/\/dp\/([A-Z0-9]{10})|\/gp\/product\/([A-Z0-9]{10})/i);

    if (!match) {
        return null;
    }

    return match[1] || match[2];
}

function gerarImagemAmazon(url) {
    const asin = extrairAsinAmazon(url);

    if (!asin) {
        return null;
    }

    return `https://m.media-amazon.com/images/P/${asin}.jpg`;
}

module.exports = {
    extrairAsinAmazon,
    gerarImagemAmazon
};
