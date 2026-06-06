const db = require("./database/db");

db.run(`
INSERT INTO ofertas
(nome, preco, preco_antigo, desconto, link, origem)
VALUES
(
'Produto Teste',
99.90,
199.90,
50,
'https://teste.com',
'manual'
)
`, function(err){

    if(err){
        console.log(err.message);
        process.exit();
    }

    console.log("Registro criado ID:", this.lastID);
    process.exit();

});
