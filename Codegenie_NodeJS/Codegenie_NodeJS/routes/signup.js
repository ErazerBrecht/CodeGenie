var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();

module.exports = function (passport) {
    
    /* GET signup page. */
    router.get('/', function (req, res) {
        res.render('signup', { message: req.flash('message') });
    });
    
    /* Handle Signup POST */
    router.post('/', passport.authenticate('signup', {
        successRedirect: '/home',
        failureRedirect: '/',
        failureFlash: true
    }));

    return router;
}