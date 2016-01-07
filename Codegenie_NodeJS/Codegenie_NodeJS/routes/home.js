var express = require('express');
var auth = require('../passport/authlevels');
var router = express.Router();

var isLoggedInRedirect = auth.isLoggedInRedirect;

router.get('/', isLoggedInRedirect, function (req, res) {
    if (req.user.course == 'Admin')
        res.render('adminpanel', {title: 'CodeGenie'});
    else
        res.render('userpanel', {title: 'CodeGenie'});
});

module.exports = router;
