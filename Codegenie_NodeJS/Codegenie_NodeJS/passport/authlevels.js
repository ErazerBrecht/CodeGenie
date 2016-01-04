var schemas = require("../mongoose/schemas");
var moment = require("moment");
var UserModel = schemas.UserModel;

var errorNotLoggedIn = ["Unauthorized, not logged in."];
var errorNotAdmin = ["Unauthorized, not an admin."];
var errorNotCorrectUser = ["Unauthorized, not the correct user."];

var updatelastseen = function (user) {
    UserModel.update({ _id: user._id }, { $set: { 'lastseen': new Date().toISOString() } }, { runValidators: true }, function (err) {
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
    if (!req.user.course == 'Admin') return res.status(401).json(errorNotAdmin);
    return next();
};

exports.isCorrectUser = function (req, res, next) {
    if (!req.isAuthenticated()) res.status(401).json(errorNotLoggedIn);
    if (!req.user.admin && req.user._id != req.params.userID) return res.status(401).json(errorNotCorrectUser);
    return next();
};