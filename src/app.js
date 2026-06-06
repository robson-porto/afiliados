const express = require("express");
const session = require("express-session");
const db = require("./database/db");
const { gerarMensagem } =
    require("./services/mensagens");
const { iniciarScheduler } =
    require("./scheduler");
const app = express();
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: "troque_essa_senha_secreta",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));
function proteger(req,res,next){

    if(req.session && req.session.logado){
        return next();
    }
return res.redirect("/login");
}

    


app.get("/nova-oferta", proteger, (req,res)=>{

    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Nova Oferta</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body class="container mt-4">

        <h1>➕ Nova Oferta</h1>

        <a href="/dashboard" class="btn btn-primary mb-3">
            Voltar
        </a>

        <form method="POST" action="/nova-oferta">

            <input class="form-control mb-2" name="nome" placeholder="Nome do produto" required>

            <input class="form-control mb-2" name="preco" placeholder="Preço atual" required>

            <input class="form-control mb-2" name="preco_antigo" placeholder="Preço antigo" required>

            <input class="form-control mb-2" name="desconto" placeholder="Desconto %" required>

            <input class="form-control mb-2" name="categoria" placeholder="Categoria">

            <input class="form-control mb-2" name="link" placeholder="Link afiliado meli.la ou Amazon" required>

            <select class="form-control mb-3" name="origem">
                <option value="mercadolivre">Mercado Livre</option>
                <option value="amazon">Amazon</option>
                <option value="manual">Manual</option>
            </select>

            <button class="btn btn-success">
                Salvar Oferta
            </button>

        </form>

    </body>
    </html>
    `);
});

app.post("/nova-oferta", proteger, (req,res)=>{

    const {
        nome,
        preco,
        preco_antigo,
        desconto,
        categoria,
        link,
        origem
    } = req.body;

    db.run(
        `
        INSERT INTO ofertas
        (
            nome,
            preco,
            preco_antigo,
            desconto,
            categoria,
            link,
            origem,
            publicado
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, 0)
        `,
        [
            nome,
            parseFloat(preco.replace(",", ".")),
            parseFloat(preco_antigo.replace(",", ".")),
            parseFloat(desconto.replace(",", ".")),
            categoria,
            link,
            origem
        ],
        (err)=>{

            if(err){
                return res.status(500).send(err.message);
            }

            res.redirect("/ofertas-view");
        }
    );
});

app.get("/login", (req,res)=>{

    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Login</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body class="container mt-5">

        <h1>Login</h1>

        <form method="POST" action="/login">
            <input class="form-control mb-2" name="usuario" placeholder="Usuário">

            <input class="form-control mb-2" type="password" name="senha" placeholder="Senha">

            <button class="btn btn-primary">
                Entrar
            </button>
        </form>

    </body>
    </html>
    `);
});

app.post("/login", (req,res)=>{

    const { usuario, senha } = req.body;

    if(usuario === "admin" && senha === "admin123"){
        req.session.logado = true;

        req.session.save(() => {
            return res.redirect("/dashboard");
        });

        return;
    }

    res.send("Login inválido");
});

app.get("/logout", (req,res)=>{
    req.session.destroy();
    res.redirect("/login");
});


app.get("/config-view", proteger, (req,res)=>{

    db.all(
        "SELECT * FROM configuracoes ORDER BY chave",
        [],
        (err,configs)=>{

            if(err){
                return res.status(500).send(err.message);
            }

            const campos = configs.map(c => `
                <div class="mb-3">
                    <label class="form-label">
                        ${c.chave}
                    </label>

                    <input
                        class="form-control"
                        name="${c.chave}"
                        value="${c.valor || ""}"
                    >
                </div>
            `).join("");

            res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Configurações</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
            </head>
            <body class="container mt-4">

                <h1>⚙️ Configurações</h1>

                <a href="/dashboard" class="btn btn-primary mb-3">
                    Voltar
                </a>

                <form method="POST" action="/config-save">
                    ${campos}

                    <button class="btn btn-success">
                        Salvar
                    </button>
                </form>

            </body>
            </html>
            `);
        }
    );
});
app.post("/config-save", (req,res)=>{

    const dados = req.body;
    const chaves = Object.keys(dados);

    chaves.forEach(chave => {
        db.run(
            `
            INSERT OR REPLACE INTO configuracoes
            (chave, valor)
            VALUES (?, ?)
            `,
            [chave, dados[chave]]
        );
    });

    res.redirect("/config-view");
});
app.get("/health", (req, res) => {
    res.json({
        status: "online",
        timestamp: new Date()
    });
});
app.get("/", (req,res)=>{

    res.send(`
        <h1>Bot Afiliados</h1>

        <ul>
            <li><a href="/health">Health</a></li>
            <li><a href="/ofertas">Ofertas</a></li>
            <li><a href="/promocoes">Promoções</a></li>
        </ul>
    `);

});
app.get("/logs-view", proteger, (req,res)=>{

    db.all(
        "SELECT * FROM logs ORDER BY id DESC LIMIT 100",
        [],
        (err,logs)=>{

            if(err){
                return res.status(500).send(err.message);
            }

            const linhas = logs.map(l => `
                <tr>
                    <td>${l.id}</td>
                    <td>${l.tipo}</td>
                    <td>${l.mensagem}</td>
                    <td>${l.criado_em}</td>
                </tr>
            `).join("");

            res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Logs</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
            </head>
            <body class="container mt-4">

                <h1>📝 Logs</h1>

                <a href="/dashboard" class="btn btn-primary mb-3">
                    Voltar
                </a>

                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tipo</th>
                            <th>Mensagem</th>
                            <th>Data</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${linhas}
                    </tbody>
                </table>

            </body>
            </html>
            `);
        }
    );
});
app.get("/stats-view", proteger, (req,res)=>{

    db.get(
        `
        SELECT
            COUNT(*) as total,
            SUM(
                CASE
                    WHEN publicado = 1
                    THEN 1
                    ELSE 0
                END
            ) as publicadas
        FROM ofertas
        `,
        [],
        (err,stats)=>{

            if(err){

                return res.status(500)
                .send(err.message);

            }

            res.send(`

            <!DOCTYPE html>

            <html>

            <head>

                <title>Estatísticas</title>

                <link
                    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
                    rel="stylesheet"
                >

            </head>

            <body class="container mt-4">

                <h1>📊 Estatísticas</h1>

                <a
                    href="/dashboard"
                    class="btn btn-primary mb-3"
                >
                    Voltar
                </a>

                <div class="row">

                    <div class="col-md-6">

                        <div class="card">

                            <div class="card-body">

                                <h5>
                                    Total de Ofertas
                                </h5>

                                <h1>
                                    ${stats.total}
                                </h1>

                            </div>

                        </div>

                    </div>

                    <div class="col-md-6">

                        <div class="card">

                            <div class="card-body">

                                <h5>
                                    Publicadas
                                </h5>

                                <h1>
                                    ${stats.publicadas || 0}
                                </h1>

                            </div>

                        </div>

                    </div>

                </div>

            </body>

            </html>

            `);

        }

    );

});
app.get("/ofertas-view", proteger, (req, res) => {

    db.all(
        "SELECT * FROM ofertas ORDER BY id DESC",
        [],
        (err, rows) => {

            if (err) {
                return res.status(500).send(err.message);
            }

            const tabela = rows.map(o => `
                <tr>
                    <td>${o.id}</td>
                    <td>${o.nome}</td>
                    <td>R$ ${o.preco}</td>
                    <td>${o.desconto}%</td>
                    <td>${o.origem}</td>
                </tr>
            `).join("");

            res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Ofertas</title>

                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

            </head>
            <body class="container mt-4">

                <h1>📦 Ofertas</h1>

                <a href="/dashboard" class="btn btn-primary mb-3">
                    Voltar
                </a>

                <table class="table table-striped">

                    <thead>

                        <tr>
                            <th>ID</th>
                            <th>Produto</th>
                            <th>Preço</th>
                            <th>Desconto</th>
                            <th>Origem</th>
                        </tr>

                    </thead>

                    <tbody>

                        ${tabela}

                    </tbody>

                </table>

            </body>
            </html>
            `);

        }
    );

});

app.get("/promocoes-view", proteger, (req,res)=>{

    db.all(
        `
        SELECT *
        FROM ofertas
        ORDER BY desconto DESC
        LIMIT 20
        `,
        [],
        (err,rows)=>{

            if(err){
                return res.status(500)
                .send(err.message);
            }

            const cards = rows.map(o => `

                <div class="card mb-3">

                    <div class="card-body">

                        <h5>${o.nome}</h5>

                        <p>

                            💰 De:
                            <del>R$ ${o.preco_antigo}</del>

                            <br>

                            🔥 Por:
                            <strong>R$ ${o.preco}</strong>

                            <br>

                            🎯 Desconto:
                            ${o.desconto}%

                        </p>

                        <a
                            href="${o.link}"
                            target="_blank"
                            class="btn btn-success"
                        >
                            Ver Oferta
                        </a>

                    </div>

                </div>

            `).join("");

            res.send(`
            <!DOCTYPE html>

            <html>

            <head>

                <title>Promoções</title>

                <link
                    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
                    rel="stylesheet"
                >

            </head>

            <body class="container mt-4">

                <h1>🔥 Promoções</h1>

                <a
                    href="/dashboard"
                    class="btn btn-primary mb-3"
                >
                    Voltar
                </a>

                ${cards}

            </body>

            </html>
            `);

        }

    );

});

iniciarScheduler();
app.get("/dashboard", proteger, (req,res)=>{

    db.all(
        `
        SELECT *
        FROM ofertas
        ORDER BY id DESC
        LIMIT 10
        `,
        [],
        (err, ofertas) => {

            if(err){
                return res.status(500)
                    .send(err.message);
            }

            db.get(
                `
                SELECT
                    COUNT(*) as total,
                    SUM(
                        CASE
                            WHEN publicado = 1
                            THEN 1
                            ELSE 0
                        END
                    ) as publicadas
                FROM ofertas
                `,
                [],
                (err, stats) => {

                    if(err){
                        return res.status(500)
                            .send(err.message);
                    }

                    const lista = ofertas
                        .map(o =>
                            `<li>${o.nome} - R$ ${o.preco}</li>`
                        )
                        .join("");

                   res.send(`
<!DOCTYPE html>
<html>

<head>

<meta charset="UTF-8">

<title>Bot Afiliados</title>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<body class="bg-light">

<div class="container mt-4">

    <h1 class="mb-4">
        🚀 Dashboard Afiliados
    </h1>

    <div class="row">

        <div class="col-md-6">

            <div class="card mb-3">

                <div class="card-body">

                    <h5>Total de Ofertas</h5>

                    <h2>${stats.total}</h2>

                </div>

            </div>

        </div>

        <div class="col-md-6">

            <div class="card mb-3">

                <div class="card-body">

                    <h5>Publicadas</h5>

                    <h2>${stats.publicadas || 0}</h2>

                </div>

            </div>

        </div>

    </div>

    <div class="card">

        <div class="card-header">
            Últimas Ofertas
        </div>

        <div class="card-body">

            <ul class="list-group">

                ${ofertas.map(o => `
                    <li class="list-group-item">
                        <strong>${o.nome}</strong>
                        <br>
                        R$ ${o.preco}
                    </li>
                `).join("")}

            </ul>

        </div>

    </div>

<div class="mt-4 d-flex gap-2">
<a href="/config-view" class="btn btn-secondary">
    ⚙️ Configurações
</a>
<a href="/nova-oferta" class="btn btn-success">
    ➕ Nova Oferta
</a>
   
 <a href="/logs-view" class="btn btn-warning">
        📝 Logs
    </a>
    <a
        href="/ofertas-view"
        class="btn btn-primary btn-lg"
    >
        📦 Ofertas
    </a>

    <a
        href="/promocoes-view"
        class="btn btn-success btn-lg"
    >
        🔥 Promoções
    </a>

    <a
        href="/stats-view"
        class="btn btn-dark btn-lg"
    >
        📊 Estatísticas
    </a>

</div>
   </div>

</body>


</html>
`);

                }
            );

        }
    );

});

app.listen(3000, "0.0.0.0", () => {
    console.log("Servidor iniciado na porta 3000");
});
