var mongoose = require('mongoose');

data = process.env.db.trim();

if (data != undefined && data != "connectionstring") {
    mongoose.connect(data);
} else
    throw Error('There was an error reading the connection string to the database.\n Make sure the process.env.db exists and has a valid URL (starts with mongodb).\n You can set the env.db variable in your startup script, startnodemon.cmd \n');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));

db.once('open', function (callback) {
    console.log('Connection made with our MongoDB');
});

exports.db = db;