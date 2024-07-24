const express = require("express")
const router = express.Router()
const session = require('../session');
const { getCatalogoclientes, getCatalogoLineas, getCatalogoColores, getCatalogoVendedores, getCatalogoProveedores  } = require("../controller/catalogosController")

router.get('/clientes', session.check, getCatalogoclientes);
router.get('/lineas', session.check, getCatalogoLineas);
router.get('/colores', session.check, getCatalogoColores);
router.get('/vendedores', session.check, getCatalogoVendedores);
router.get('/proveedores', session.check, getCatalogoProveedores);

module.exports = router