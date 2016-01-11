var schemas = require("../mongoose/schemas");
var moment = require("moment");
var UserModel = schemas.UserModel;

var errorNotLoggedIn = ["Unauthorized, not logged in."];
var errorNotAdmin = ["Unauthorized, not an admin."];

var UpdateLastSeen = function (user) { //Not used because this tends to update alot on page loads.
    UserModel.update({ _id: user._id }, { $set: { 'lastseen': new Date() } }, { runValidators: true }, function (err) {
        if (err) console.log('Error updating lastseen for user: ' + user.name);
    });
};

exports.isLoggedIn = function (req, res, next) {
    if (!req.isAuthenticated()) return res.status(401).json(errorNotLoggedIn);
    return next();
};

exports.isLoggedInRedirect = function (req, res, next) {
    if (!req.isAuthenticated()) return res.redirect('/');
    return next();
};

exports.isAdmin = function (req, res, next) {
    if (!req.isAuthenticated()) return res.status(401).json(errorNotLoggedIn);
    if (req.user.course != 'Admin') return res.status(401).json(errorNotAdmin);
    return next();
};