var express = require('express');
var router = express.Router();

module.exports = function (passport) {
    
    /* GET login page. */
    router.get('/', function (req, res, next) {
        res.render('index', { message: req.flash('message') });
    });
    
    /* Handle Login POST */
    router.post('/login', passport.authenticate('login', {
        successRedirect: '/home',
        failureRedirect: '/',
        failureFlash: true
    })
    );
    
    return router;
}