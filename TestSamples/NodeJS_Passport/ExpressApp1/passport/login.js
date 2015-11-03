var LocalStrategy = require('passport-local').Strategy;
var schemas = require("../mongoose/schemas");
var UserModel = schemas.UserModel;

module.exports = function (passport) {

    passport.use('login', new LocalStrategy({
        passReqToCallback: true // Allows us to pass back the entire request to the callback
    },
    function (req, username, password, done) {
        UserModel.findOne({ name: username },
            function (err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    console.log('User Not Found with username ' + username);
                    return done(null, false, req.flash('message', 'Incorrect username.'));
                }
                if (!isValidPassword(user, password)) {
                    console.log('Invalid Password');
                    return done(null, false, req.flash('message', 'Incorrect password.'));
                }
                return done(null, user);
            }
        );
    })
    );
    
    //TODO DECRYPT
    var isValidPassword = function (user, password) {
        if (password === user.hash)
            return true;
        return false;
    }
}