const axios = require("axios");
const db = require("../database/db");

function buscarConfig(chave) {
    return new Promise((resolve, reject) => {
        db.get(
            "SELECT valor FROM configuracoes WHERE chave = ?",
            [chave],
            (err, row) => {
                if (err) return reject(err);
                resolve(row ? row.valor : null);
            }
        );
    });
}

async function enviarTelegram(mensagem) {
    const token = await buscarConfig("telegram_token");
    const chatId = await buscarConfig("telegram_chat_id");

    if (!token || !chatId) {
        throw new Error("telegram_token ou telegram_chat_id não configurado");
    }

    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    const resposta = await axios.post(url, {
        chat_id: chatId,
        text: mensagem,
        parse_mode: "HTML",
        disable_web_page_preview: false
    });

    return resposta.data;
}

async function enviarTelegramComBotao(mensagem, link) {
    const token = await buscarConfig("telegram_token");
    const chatId = await buscarConfig("telegram_chat_id");

    if (!token || !chatId) {
        throw new Error("telegram_token ou telegram_chat_id não configurado");
    }

    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    const resposta = await axios.post(url, {
        chat_id: chatId,
        text: mensagem,
        parse_mode: "HTML",
        disable_web_page_preview: false,
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: "🛒 Comprar agora",
                        url: link
                    }
                ]
            ]
        }
    });

    return resposta.data;
}

async function enviarTelegramFoto(mensagem, link, imagem) {
    const token = await buscarConfig("telegram_token");
    const chatId = await buscarConfig("telegram_chat_id");

    if (!token || !chatId) {
        throw new Error("telegram_token ou telegram_chat_id não configurado");
    }

    const url = `https://api.telegram.org/bot${token}/sendPhoto`;

    const resposta = await axios.post(url, {
        chat_id: chatId,
        photo: imagem,
        caption: mensagem,
        parse_mode: "HTML",
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: "🛒 Comprar agora",
                        url: link
                    }
                ]
            ]
        }
    });

    return resposta.data;
}

module.exports = {
    enviarTelegram,
    enviarTelegramComBotao,
    enviarTelegramFoto
};
