var LocalStrategy = require('passport-local').Strategy;
var schemas = require("../mongoose/schemas");
var bCrypt = require('bcrypt-nodejs');
var moment = require('moment');
var UserModel = schemas.UserModel;

module.exports = function (passport) {
    passport.use('signup', new LocalStrategy({
        passReqToCallback: true
    },
        function (req, username, password, done) {

            findOrCreateUser = function () {
                var email = req.body.email;
                UserModel.findOne({ 'email': email }, function (err, user) {
                    if (err) {
                        console.log('Error in signup: ' + err);
                        return done(null, false, err);
                    }
                    if (user && email) {
                        return done(null, false, req.flash('message', 'Email is already used'));
                    } else {
                        UserModel.findOne({ 'name': username }, function (err, user) {
                            if (err) {
                                console.log('Error in SignUp: ' + err);
                                return done(null, false, err);
                            }
                            if (user) {
                                console.log('User already exists');
                                return done(null, false, req.flash('message', 'User Already Exists'));
                            } else {
                                var newUser = new UserModel({
                                    name: username,
                                    password: createHash(password),
                                    class: req.body.group,
                                    email: email,
                                    status: 0,
                                    admin: false,
                                    registerdate: new Date().toISOString(),
                                    lastseen: new Date().toISOString()
                                });

                                newUser.save(function (err) {
                                    if (err) {
                                        console.log('Error in saving user: ' + err);
                                        done(null, false, err);
                                    }
                                    return done(null, newUser);
                                });
                                console.log('Signup: ' + newUser.name);
                            }
                        });
                    }
                });
            };

            process.nextTick(findOrCreateUser);
        })
    );

    var createHash = function (password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }
}