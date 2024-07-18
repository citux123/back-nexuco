const express = require("express")
const router = express.Router()
const session = require('../session');
const { getCatalogoclientesNombre, getCatalogoclientesCodigo, 
    getCatalogoVendedores, setPedidos, getCatalogoTransporte } = require("../controller/pedidoController")


router.get('/catalogo/clientes/codigo', session.check, getCatalogoclientesCodigo);
router.get('/catalogo/clientes/nombre', session.check, getCatalogoclientesNombre);
router.get("/catalogo/vendedores", session.check, getCatalogoVendedores)
router.get("/catalogo/transportes", session.check, getCatalogoTransporte)


router.post("/set/pedido", session.check, setPedidos)


module.exports = router