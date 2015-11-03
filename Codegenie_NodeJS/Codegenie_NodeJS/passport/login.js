var LocalStrategy = require('passport-local').Strategy;
var schemas = require("../mongoose/schemas");
var bCrypt = require('bcrypt-nodejs');
var moment = require('moment');
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
                        console.log('User Not Found with username ' + username);
                        return done(null, false, req.flash('message', 'Incorrect username.'));
                    }
                    if (!isValidPassword(user, password)) {
                        console.log('Invalid Password for user: ' + username);
                        return done(null, false, req.flash('message', 'Incorrect password.'));
                    }
                    /*var newuser = new UserModel(user);

                    /*newuser.update({ _id: user._id }, { lastseen: moment().format("DD/MM/YYYY") }, { runValidators: true }, function (err) {
                        var response = errhandler(err);
                        if (response != "ok") {
                            done(null, false, response);
                            console.log('Error updating lastseen for user: ' + user.name);
                        }
                    });*/

                    return done(null, user);
                }
            );
        })
    );

    var isValidPassword = function (user, password) {
        return bCrypt.compareSync(password, user.password);
    }
}