var LocalStrategy = require('passport-local').Strategy;
var schemas = require("../mongoose/schemas");
var moment = require('moment');
var passwordhandler = require('./passwordhandler');
var UserModel = schemas.UserModel;

module.exports = function (passport) {
    passport.use('login', new LocalStrategy({
        passReqToCallback: true
    },
        function (req, username, password, done) {
        UserModel.findOne({ name: username },
                function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                console.log('User not found with username: ' + username);
                return done(null, false, req.flash('message', 'Incorrect username.'));
            }
            if (!passwordhandler.isValidPassword(user, password)) {
                console.log('Invalid password for user: ' + username);
                return done(null, false, req.flash('message', 'Incorrect password.'));
            }
            
            UserModel.update({ _id: user._id }, { $set: { 'lastseen': new Date() }, $inc: { 'logins': 1 } }, { runValidators: true }, function (err) {
                if (err) {
                    console.error(err);
                    done(null, false, req.flash('message', "Error in updating lastseen."));
                }
            });
            
            return done(null, user);
        });
    }));
};