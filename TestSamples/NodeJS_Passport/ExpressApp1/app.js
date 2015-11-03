var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');

//DB + Mongoose
var mongoose = require('./mongoose/dbconnection');
var schemas = require("./mongoose/schemas");

//vars
var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//passport
var passport = require('passport');
var expressSession = require('express-session');
//TODO: Change key :)
app.use(expressSession({ secret: 'mySecretKey', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Using the flash middleware provided by connect-flash to store messages in session
// and displaying in templates
var flash = require('connect-flash');
app.use(flash());

var configPassport = require('./passport/config');
configPassport(passport);

//routes
var indexRoutes = require('./routes/index')(passport);
var homeRoutes = require('./routes/home');
var userRoutes = require('./routes/users');

app.use('/', indexRoutes);
app.use('/home', homeRoutes);
app.use('/users/', userRoutes);

app.listen(app.get('port'));
console.log('Express server started on port %s', app.get('port'));