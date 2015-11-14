var bodyParser = require('body-parser');
var express = require('express');
var router = express.Router();
var auth = require('../passport/authlevels');

var isLoggedIn = auth.isLoggedIn;

//var isAuthenticated = function (req, res, next) {
//    if (req.isAuthenticated()) return next();
//    res.redirect('/');
//}


router.get('/', isLoggedIn, function (req, res, next) {
    if (req.user.admin) //Check if user is an admin, TODO: Talk about this with other team members!!!!
        res.redirect('/admin');
    else
        res.render('index', { title: 'CodeGenie' });
});

module.exports = router;
