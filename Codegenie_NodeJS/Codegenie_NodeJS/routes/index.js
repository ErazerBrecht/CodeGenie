var express = require('express');
var bodyParser = require('body-parser');
var auth = require('../passport/authlevels');
var router = express.Router();

var isLoggedIn = auth.isLoggedIn;

module.exports = function (passport) {
    
    /* GET login page. */
    router.get('/', function (req, res, next) {
        res.render('login', { message: req.flash('message') });
    });

    router.get('/signout', isLoggedIn, function (req, res, next) {
        req.logout();
        res.redirect('/');
    });
    
    /* Handle Login POST */
    router.post('/login', passport.authenticate('login', {
        successRedirect: '/home',
        failureRedirect: '/',
        failureFlash: true
    }));

    return router;
}