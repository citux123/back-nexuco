/* REQUIRES */
const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const cf = require("./cf")
const setData = require("./controller/landingController")
const catalogo = require("./controller/catalogoController")
const userRouter = require("./routes/user")
const useRouterPedido = require("./routes/pedido")
const useRouterReporte = require("./routes/reportes")
const useRouterCatalogos = require("./routes/catalogos")
//onst session = require('./session');



// Configurar Sequelize
const sequelize = require("./config/sqlserver");
sequelize.init();

/* MODULES */
// const sql = require('./sql');
const session = require('./session');

const app = express();

/* USES */
app.use(bodyparser.json());
app.use(cors());

app.use(session.passport.initialize());

/* ROUTES */
app.get('/', function(req, res) {
	res.send('Welcome to the API/Back-end!');
});

//manejo de usuarios
app.use("/user", userRouter)
//manejo de pedidos y catalogo para ellos
app.use("/pedidos", useRouterPedido)
// manejo de reporteria
app.use("/reportes", useRouterReporte)
// manejo de catalogos 
app.use("/catalogos", useRouterCatalogos)

app.get('/escucha',  function(req, res) {
	res.json("noooo way ");
  });

//manejo de contacto pagina
app.post('/setContacto',   setData.setData );


app.post("/catalogo/productos" ,session.check,  catalogo.getProductos )

app.get("/catalogo/producto/:id" ,session.check,  catalogo.getProducto )



/* START SERVER */
app.listen(cf.port|| 3000);