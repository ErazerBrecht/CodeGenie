var bodyParser = require('body-parser');
var express = require('express');
var router = express.Router();

var isAuthenticated = function (req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler 
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects
    if (req.isAuthenticated())
        return next();
    // if the user is not authenticated then redirect him to the login page
    res.redirect('/');
}

/* GET home page. Only when user is authenticated */
router.get('/', isAuthenticated, function (req, res, next) {
    res.render('home', { title: 'CodeGenie' });
});

//TODO Add logout

module.exports = router;
