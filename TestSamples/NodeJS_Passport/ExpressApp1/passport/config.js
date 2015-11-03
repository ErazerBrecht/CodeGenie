var login = require('./login');

// Load up the user model
var schemas = require("../mongoose/schemas");
var UserModel = schemas.UserModel;

// Expose this function to our app using module.exports
module.exports = function (passport) {
    
    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function (user, done) {
        console.log('serializing user: '); console.log(user);
        done(null, user._id);
    });
    
    passport.deserializeUser(function (id, done) {
        UserModel.findById(id, function (err, user) {
            console.log('deserializing user:', user);
            done(err, user);
        });
    });
    
    // Setting up Passport Strategies for Login and SignUp/Registration
    login(passport);
    //TODO ADD SIGNUP
    //signup(passport);
}
