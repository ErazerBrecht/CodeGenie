var LocalStrategy = require('passport-local').Strategy;
var schemas = require("../mongoose/schemas");
var bCrypt = require('bcrypt-nodejs');
var moment = require('moment');
var UserModel = schemas.UserModel;
var errhandler = schemas.errhandler;

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
                console.log('User not found with username ' + username);
                return done(null, false, req.flash('message', 'Incorrect username.'));
            }
            if (!isValidPassword(user, password)) {
                console.log('Invalid password for user: ' + username);
                return done(null, false, req.flash('message', 'Incorrect password.'));
            }
            
            UserModel.update({ _id: user._id }, { $set: { 'lastseen': new Date().toISOString() } }, { runValidators: true }, function (err) {
                var response = errhandler(err);
                if (response != "ok") {
                    done(null, false, req.flash('message', "Error in updating lastseen"));
                    console.log('Error updating lastseen for user: ' + user.name + "\n" + response);
                }
            });
            
            return done(null, user);
        });
    }));
    
    var isValidPassword = function (user, password) {
        return bCrypt.compareSync(password, user.password);
    }
}