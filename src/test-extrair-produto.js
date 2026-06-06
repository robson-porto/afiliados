const { extrairProduto } = require("./services/extrair-produto");

(async () => {
    const link = "https://amazon.com.br/Relógio-Garmin-Forerunner-Monitor-Cardíaco/dp/B0953X73TP?pd_rd_w=cObhk&content-id=amzn1.sym.49c30b43-6327-4205-bff7-940d62245e41&pf_rd_p=49c30b43-6327-4205-bff7-940d62245e41&pf_rd_r=BS5K46RK0SN1RKVSSXK9&pd_rd_wg=kqyKs&pd_rd_r=6b98835f-e35f-4419-82c2-a9ff5a71583d&pd_rd_i=B0953X73TP&ref_=dossier_default_ref_B0953X73TP";

    const produto = await extrairProduto(link);

    console.log(produto);

    process.exit();
})();
