var express = require('express');
var bodyParser = require('body-parser');
var auth = require('../passport/authlevels');
var router = express.Router();

var isLoggedIn = auth.isLoggedIn;

module.exports = function (passport) {
    
    /* GET login page. */
    router.get('/', function (req, res, next) {
        res.render('login');
    });

    router.get('/signout', isLoggedIn, function (req, res, next) {
        req.logout();
        res.redirect('/');
    });

    /* GET signup page. */
    /*router.get('/signup', function (req, res, next) {
        res.render('signup');
    });*/
    
    /* Handle Login POST */
    router.post('/login', passport.authenticate('login', {
        successRedirect: '/home',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    /* Handle Signup POST */
    router.post('/signup', passport.authenticate('signup', {
        successRedirect: '/home',
        failureRedirect: '/',
        failureFlash: true
    }));

    return router;
}