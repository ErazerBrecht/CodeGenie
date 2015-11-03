var bodyParser = require('body-parser');
var express = require('express');
var router = express.Router();

var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/');
}

router.get('/', isAuthenticated, function (req, res, next) {
    res.render('index', { title: 'CodeGenie' });
});

module.exports = router;
