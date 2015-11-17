var schemas = require('../mongoose/schemas');
var bodyParser = require('body-parser');
var express = require('express');
var auth = require('../passport/authlevels');
var router = express.Router();

var UserModel = schemas.UserModel;
var ExerciseModel = schemas.ExerciseModel;
var AnswerModel = schemas.AnswerModel;

var errhandler = schemas.errhandler;

var isLoggedIn = auth.isLoggedIn;


router.get('/', isLoggedIn, function (req, res) {
    var response = { users: 0, admins: 0, exercises: 0, answers: 0, classes: [] };
    
    //TODO: fix this godzilla of a query (why does it have to be async)
    ExerciseModel.count(function (err, c) {
        response.exercises = c;

        AnswerModel.count(function (err, c) {
            response.answers = c;

            UserModel.count(function (err, c) {
                response.users = c;

                UserModel.count({ admin: true }, function (err, c) {
                    response.admins = c;

                    UserModel.find({}, { class: 1 }, function (err, c) {
                        var ar = count(c);
                        for (var index in ar[0]) response.classes.push({ class: ar[0][index].class, count: ar[1][index] });

                        res.status(200).json(response);
                    });
                });
            });
        });
    });
});

function count(arr) {
    var a = [], b = [], prev;

    arr.sort();
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] !== prev) {
            a.push(arr[i]);
            b.push(1);
        } else {
            b[b.length - 1]++;
        }
        prev = arr[i];
    }

    return [a, b];
}

module.exports = router;