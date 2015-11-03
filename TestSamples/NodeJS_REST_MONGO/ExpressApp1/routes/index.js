var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();

module.exports = function (passport) {
    
    /* GET login page. */
    router.get('/', function (req, res, next) {
        res.render('login');
    });

    /* GET signup page. */
    /*router.get('/signup', function (req, res, next) {
        res.render('signup');
    });*/
    
    /* Handle Login POST */
    router.post('/login', passport.authenticate('login', {
        successRedirect: '/home',
        failureRedirect: '/',
        failureFlash: true
    }));

    /* Handle Signup POST */
    /*router.post('/signup', passport.authenticate('signup', {
        successRedirect: '/home',
        failureRedirect: '/',
        failureFlash: true
    }));*/

    return router;
}