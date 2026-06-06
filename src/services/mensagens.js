function gerarMensagem(oferta){

    return `
🔥 OFERTA ENCONTRADA

📦 ${oferta.nome}

💰 De: R$ ${oferta.preco_antigo}

💵 Por: R$ ${oferta.preco}

🎯 Desconto: ${oferta.desconto}%

📂 Categoria: ${oferta.categoria || "Geral"}

🔗 ${oferta.link}
`;

}

module.exports = {
    gerarMensagem
};
