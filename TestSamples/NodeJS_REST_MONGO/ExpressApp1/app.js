var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');

//DB + Mongoose
var mongo = require('mongodb');
var mongoose = require('./mongoose/dbconnection');
var schemas = require("./mongoose/schemas");

//routes
var indexRoutes = require('./routes/index');
var userRoutes = require('./routes/users');
var exerciseRoutes = require('./routes/exercises');
var answerRoutes = require('./routes/answers');

//vars
var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    req.db = mongoose.db;
    next();
});

app.use('/', indexRoutes);
app.use('/users/', userRoutes);
app.use('/exercises', exerciseRoutes);
app.use('/exercises', answerRoutes);

app.listen(app.get('port'));
console.log('Express server started on port %s', app.get('port'));