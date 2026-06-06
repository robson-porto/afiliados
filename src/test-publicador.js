const {
    executar
} = require("./workers/telegram-worker");

executar();

setTimeout(()=>{
    process.exit();
},5000);
