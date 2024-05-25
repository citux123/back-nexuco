const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const {sequelize} = require("./config/sqlserver.js")

const { QueryTypes } = require('sequelize');


//const sql = require('./sql');

/* SECRET */
var server_secret = 'this is extremely secret!';
console.log("entrando a session")
passport.use(new LocalStrategy(
 async function(username, password, done) {
  console.log("entrando a funcion", username, password)
    const users = await sequelize.query(`select * from dbo.modusers m where usuario='${username}' 
    and clave='${password}'  `, {
      type: QueryTypes.SELECT,
      raw: true,
      plain: true
    });

    console.log(users)

    // return sql("SELECT id, username FROM users WHERE username=@user AND password=@pass", {user: username, pass: password}).then(result => {
      if (users)
        return done(null, users);
      else
        return done(null, false);
    //});
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
      expiresIn: 120 * 60
    });
  }
}