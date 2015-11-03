exports.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) return next();
    res.status(401).send('Unauthorized, not logged in.');
}

exports.isAdmin = function (req, res, next) {
    if (req.isAuthenticated() && req.user.admin) return next();
    res.status(401).send('Unauthorized, not an admin.');
}

exports.isUser = function (req, res, next) {
    if (req.isAuthenticated() && (req.user.admin || req.user._id == req.params.userID)) return next();
    res.status(401).send('Unauthorized, not the correct user.');
}