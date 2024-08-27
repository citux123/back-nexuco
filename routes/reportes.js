const express = require("express")
const router = express.Router()
const session = require('../session');
const { gerReporteVentas, getReporteVentasCliente, gerReporteVentasxFecha, gerReporteCarteraClientes } = require("../controller/reporteController")

router.post('/ventas', session.check, gerReporteVentas);
router.post('/ventasxfecha', session.check, gerReporteVentasxFecha);

router.get('/clientes', session.check, getReporteVentasCliente);


router.post('/carteraClientes', session.check, gerReporteCarteraClientes)


module.exports = router