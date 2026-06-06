const {
    executar
} = require("./workers/ofertas-worker");

executar()
.then(()=>{
    process.exit();
});
