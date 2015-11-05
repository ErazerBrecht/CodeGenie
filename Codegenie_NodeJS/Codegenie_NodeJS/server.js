var express = require('express');
var path = require('path');
var https = require('https');
var fs = require('fs');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var flash = require('connect-flash');

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

//Passport
var passport = require('passport');
var session = require('express-session');
var configPassport = require('./passport/config');
configPassport(passport);

//Routes
var indexRoutes = require('./routes/index')(passport);
var signupRoutes = require('./routes/signup.js')(passport);
var userRoutes = require('./routes/users');
var adminRoutes = require('./routes/admin');
var homeRoutes = require('./routes/home');

//Vars
var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use(session({
    secret: "shhhhhitsasecret",
    name: "Codegenie",
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());


app.use('/', indexRoutes);
app.use('/signup', signupRoutes);
app.use('/users', userRoutes);
app.use('/admin', adminRoutes);
app.use('/home', homeRoutes);


https.createServer(sslOptions, app).listen(app.get('port'));

var redirectToHttps = express();
redirectToHttps.use(function (req, res, next) {
    if (req.secure) next();
    else res.redirect('https://' + req.headers.host + req.url);
});
redirectToHttps.listen(80);


console.log('Express server started on port %s', app.get('port'));