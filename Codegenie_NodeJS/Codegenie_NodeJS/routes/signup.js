var express = require('express');
var router = express.Router();

module.exports = function (passport) {
    
    /* GET signup page. */
    router.get('/', function (req, res) {
        res.render('signup');
    });
    
    /* Handle Signup POST */
    router.post('/', passport.authenticate('signup', {
        successRedirect: '/home',
        failureRedirect: '/signup',
        failureFlash: true
    }));
    
    return router;
};