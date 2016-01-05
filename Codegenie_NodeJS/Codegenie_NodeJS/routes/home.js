var express = require('express');
var router = express.Router();
var auth = require('../passport/authlevels');

var isLoggedInRedirect = auth.isLoggedInRedirect;

router.get('/', isLoggedInRedirect, function (req, res) {
    if (req.user.course == 'Admin')
        res.render('adminpanel', {title: 'CodeGenie'});
    else
        res.render('userpanel', { title: 'CodeGenie' });
});

module.exports = router;
