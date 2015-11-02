var mongoose = require("mongoose");
var fs = require("fs").readFile("./mongoose/connectioninfo.config", function (err, data) {
    if (err) return console.log(err);
    mongoose.connect(data);
});

var dbinfo;
var db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error: "));

db.once("open", function (callback) {
    console.log("connection made.");
});

exports.db = db;