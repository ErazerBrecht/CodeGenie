﻿var errorNotLoggedIn = "Unauthorized, not logged in.";
var errorNotAdmin = "Unauthorized, not an admin.";
var errorNotCorrectUser = "Unauthorized, not the correct user.";

exports.isLoggedIn = function (req, res, next) {
    if (!req.isAuthenticated()) return res.status(401).send(errorNotLoggedIn);
    return next();
}

exports.isLoggedInRedirect = function (req, res, next) {
    if (!req.isAuthenticated()) return res.redirect('/');
    return next();
}

exports.isAdmin = function (req, res, next) {
    if (!req.isAuthenticated()) return res.status(401).send(errorNotLoggedIn);
    if (!req.user.admin) return res.status(401).send(errorNotAdmin);
    return next();
}

exports.isCorrectUser = function (req, res, next) {
    if (!req.isAuthenticated()) res.status(401).send(errorNotLoggedIn);
    if (!req.user.admin && req.user._id != req.params.userID) return res.status(401).send(errorNotCorrectUser);
    return next();
}