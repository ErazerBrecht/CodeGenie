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
                            class: req.param('class'),
                            status: 0,
                            admin: false,
                            registerdate: moment().format("DD/MM/YYYY"),
                            lastseen: moment().format("DD/MM/YYYY")
                        });

                        newUser.save(function (err) {
                            if (err) {
                                console.log('Error in Saving user: ' + err);
                                done(null, false, err);
                            }
                            return done(null, newUser);
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