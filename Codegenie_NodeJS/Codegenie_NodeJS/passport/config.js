var login = require('./login');
var signup = require('./signup');

var schemas = require("../mongoose/schemas");
var UserModel = schemas.UserModel;

module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function (id, done) {
        UserModel.findById(id, function (err, user) {
            done(err, user);
        });
    });

    login(passport);
    signup(passport);
}