var express = require('express');
var auth = require('../passport/authlevels');
var router = express.Router();

var isLoggedInRedirect = auth.isLoggedInRedirect;

module.exports = function (passport) {
    
    /* GET login page. */
    router.get('/', function (req, res) {
        if (req.isAuthenticated())
            res.redirect('/home');
        else
            res.render('login', { message: req.flash('message') });
    });

    router.get('/signout', isLoggedInRedirect, function (req, res) {
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
};