var express = require('express');
var path = require('path');
var https = require('https');
var fs = require('fs');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');

//Mongoose
var mongoose = require('./mongoose/dbconnection');
var schemas = require('./mongoose/schemas');

//Certificate
var sslOptions = {
    key: fs.readFileSync('./ssl/server.key'),
    cert: fs.readFileSync('./ssl/server.crt'),
    ca: fs.readFileSync('./ssl/ca.crt'),
    requestCert: true,
    rejectUnauthorized: false
};

//Session & Auth
var session = require('express-session');
var sess;

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
app.use(session({
    secret: "shhhhhitsasecret",
    name: "Codegenie",
    resave: true,
    saveUninitialized: true
}));

app.use('/', indexRoutes);
app.use('/users/', userRoutes);
app.use('/exercises', exerciseRoutes);
app.use('/exercises', answerRoutes);



https.createServer(sslOptions, app).listen(2000);



var http = express();
http.get('*', function (req, res) {
    res.redirect('https://localhost:2000' + req.url)
}).listen(1337);



console.log('Express server started on port %s', app.get('port'));