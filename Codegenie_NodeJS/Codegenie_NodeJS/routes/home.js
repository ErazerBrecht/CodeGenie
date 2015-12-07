var bodyParser = require('body-parser');
var express = require('express');
var router = express.Router();
var auth = require('../passport/authlevels');

var isLoggedInRedirect = auth.isLoggedInRedirect;

router.get('/', isLoggedInRedirect, function (req, res, next) {
    if (req.user.admin)
        res.redirect('/admin');
    else
        res.render('userpanel', { title: 'CodeGenie' });
});

module.exports = router;
