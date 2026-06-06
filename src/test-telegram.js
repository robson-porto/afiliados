const { enviarTelegram } = require("./services/telegram");

(async () => {
    try {
        await enviarTelegram(`
🔥 <b>Teste do Bot de Ofertas</b>

Se você recebeu esta mensagem, o Telegram está integrado corretamente.
        `);

        console.log("Mensagem enviada com sucesso");
    } catch (err) {
        console.error("Erro ao enviar:", err.response?.data || err.message);
    }

    process.exit();
})();
