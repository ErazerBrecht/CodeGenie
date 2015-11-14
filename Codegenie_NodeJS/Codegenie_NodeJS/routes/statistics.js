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
    var response = { users: 0, admins: 0, exercises: 0, answers: 0, class: [] };

    //TODO: fix this godzilla of a query (why does it have to be async)
    ExerciseModel.count(function (err, c) {
        response.exercises = c;

        AnswerModel.count(function (err, c) {
            response.answers = c;

            UserModel.count(function (err, c) {
                response.users = c;

                UserModel.count({ admin: true }, function (err, c) {
                    response.admins = c;

                    UserModel.count({ class: '3EA1' }, function (err, c) {
                        response.class.push({ class: '3EA1', count: c });

                        UserModel.count({ class: '2EA1' }, function (err, c) {
                            response.class.push({ class: '2EA1', count: c });

                            res.status(200).json(response);
                        });
                    });
                });
            });
        });
    });
});


module.exports = router;