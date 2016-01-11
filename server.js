var express = require('express');
var path = require('path');
var https = require('https');
var fs = require('fs');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var flash = require('connect-flash');

//Mongoose
var mongoose = require('./mongoose/dbconnection');

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
var cookiestore = require('connect-mongo')(session);
var configPassport = require('./passport/config');
configPassport(passport);

//Routes
var indexRoutes = require('./routes/index')(passport);
var signupRoutes = require('./routes/signup.js')(passport);

var userRoutesMain = require('./routes/users/main');
var userRoutesExercises = require('./routes/users/exercises');
var userRoutesAnswers = require('./routes/users/answers');
var userRoutesSeen = require('./routes/users/seen');

var adminRouteUsers = require('./routes/admin/users');
var adminRouteExercises = require('./routes/admin/exercises');
var adminRouteAnswers = require('./routes/admin/answers');

var statisticRoutes = require('./routes/statistics');
var homeRoutes = require('./routes/home');

//Vars
var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname,'public','images','favicon.ico')));
app.use(flash());
app.use(session({
    secret: "shhhhhitsasecret",
    name: "Codegenie",
    store: new cookiestore({
        mongooseConnection: mongoose.db,
        ttl: 7 * 24 * 60 * 60
    }),
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());


app.use('/', indexRoutes);
app.use('/signup', signupRoutes);

app.use('/users', userRoutesMain);
app.use('/users', userRoutesExercises);
app.use('/users', userRoutesAnswers);
app.use('/users', userRoutesSeen);

app.use('/admin', adminRouteUsers);
app.use('/admin', adminRouteExercises);
app.use('/admin', adminRouteAnswers);

app.use('/statistics', statisticRoutes);
app.use('/home', homeRoutes);

var server = app.listen(app.get('port'), function () {  
    console.log('Express server started on port %s', app.get('port'));
});

//https.createServer(sslOptions, app).listen(app.get('port'));

//var redirectToHttps = express();
//redirectToHttps.use(function (req, res, next) {
//    if (req.secure) next();
//    else res.redirect('https://' + req.headers.host + req.url);
//});
//redirectToHttps.listen(80);