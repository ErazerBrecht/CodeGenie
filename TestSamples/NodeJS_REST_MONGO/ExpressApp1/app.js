var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
//Database
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/CodeGenie');

var routes = require('./routes/index.js');

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//Middleware
// Make our db accessible to our router
app.use(function (req, res, next) {
    req.db = db;
    next();
});

app.use('/', routes);

app.listen(app.get('port'));
console.log('Express server started on port %s', app.get('port'));