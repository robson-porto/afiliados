const cron = require("node-cron");
const {
    executar: publicarTelegram
} = require("../workers/telegram-worker");
const { executar } = require("../workers/ofertas-worker");



function iniciarScheduler() {

    console.log("Scheduler iniciado");

cron.schedule("* * * * *", async () => {

    console.log(
        "Executando scheduler:",
        new Date()
    );

    try {

        await executar();

        await publicarTelegram();

    } catch(err){

        console.error(err);

    }

});

}

module.exports = {
    iniciarScheduler
};
