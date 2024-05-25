/* REQUIRES */
const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const cf = require("./cf")
const setData = require("./controller/landingController")
const catalogo = require("./controller/catalogoController")


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

app.post('/login', session.passport.authenticate('local', { failureRedirect: '/login' }), function(req, res) {
	
	req.token = session.generateToken(req.user);
	res.json({
		token: req.token,
		user: req.user
	});

});

app.get('/me', session.check, function(req, res) {
  res.json(req.user);
});

app.get('/escucha',  function(req, res) {
	res.json("noooo way ");
  });

app.post('/setContacto',   setData.setData );


app.post("/catalogo/productos" , catalogo.getProductos )



/* START SERVER */
app.listen(cf.port|| 3000);