const express = require("express")
const router = express.Router()
const session = require('../session');



router.post('/login/oauth', session.passport.authenticate('local', /* { failureRedirect: '/shop' } */), function(req, res) {
	
	req.token = session.generateToken(req.user);
	res.json({
		token: req.token,
		user: req.user
	});

});

router.get('/me', session.check, function(req, res) {
    res.json(req.user);
  });

module.exports = router