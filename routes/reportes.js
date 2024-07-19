const express = require("express")
const router = express.Router()
const session = require('../session');
const { gerReporteVentas, getReporteVentasCliente } = require("../controller/reporteController")

router.get('/ventas', session.check, gerReporteVentas);
router.get('/clientes', session.check, getReporteVentasCliente);



module.exports = router