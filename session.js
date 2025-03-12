const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const {sequelize} = require("./config/sqlserver.js")

const { QueryTypes } = require('sequelize');

/* SECRET */
let server_secret = process.env.SECRET
passport.use(new LocalStrategy(
 async function(username, password, done) {
  if (username.length <= 13 && password.length <=13){
    const users = await sequelize.query(`select id,nombre,usuario,telefono,nivel,puesto,departamento,__acceso_portal_web,codven from grupo_sugua_data.dbo.modusers m where usuario='${username}' 
    and PWDCOMPARE('${password}',pwd) = 1`, {
      type: QueryTypes.SELECT,
      raw: true,
      plain: true
    });

      if (users && users.__acceso_portal_web)
        return done(null, users);
      else
        return done("Usuario sin permisos", false);
  }else{
    return done(null, false);
  }
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

module.exports = {
  passport: passport,
  check: expressJwt({secret: server_secret}),
  generateToken(user) {
    return jwt.sign({
      user: user
    }, server_secret, {
      expiresIn: 30 * 60
    });
  }
}