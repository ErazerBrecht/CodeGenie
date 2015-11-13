var mongoose = require('mongoose');
var fs = require('fs').readFile('./mongoose/connectioninfo.config', 'UTF-8', function (err, data) {
    if (err) return console.log('There was an error reading the connection string to the database, make sure to check if ./mongoose/connectioninfo.js exists and has an URL.');
    mongoose.connect(data);
});

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error: '));

db.once('open', function (callback) {
    console.log('connection made.');
});

exports.db = db;