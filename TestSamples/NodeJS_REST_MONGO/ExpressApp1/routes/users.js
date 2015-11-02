var schemas = require("../mongoose/schemas");
var bodyParser = require('body-parser');
var express = require('express');
var router = express.Router();

var UserModel = schemas.UserModel;
var ExerciseModel = schemas.ExerciseModel;
var AnswerModel = schemas.AnswerModel;

var errhandler = schemas.errhandler;



//GET

router.get('/', function (req, res) {
    UserModel.find(function (err, users) {
        if (err) return console.error(err);

        res.status(200).json(users);
    })
});

router.get('/:userID', function (req, res) {
    userID = req.params.userID;

    UserModel.find({ _id: userID }, function (err, users) {
        if (err) return console.error(err);

        res.status(200).json(users);
    })
});

router.get('/:userID/exercises', function (req, res) {
    userID = req.params.userID;

    AnswerModel.find({ userid: userID }, function (err, answers) {
        if (err) return console.error(err);

        res.status(200).json(answers);
    })
});

router.get('/:userID/exercises/:exerciseID', function (req, res) {
    userID = req.params.userID;
    exerciseID = req.params.exerciseID;

    AnswerModel.find({ userid: userID, questionid: exerciseID }, function (err, answer) {
        if (err) return console.error(err);

        res.status(200).json(answer);
    })
});



//POST

router.post("/post", function (req, res) {
    var newuser = new UserModel(req.body);

    newuser.lastseen = moment().format("DD/MM/YYYY")
    newuser.admin = false;

    newuser.save(function (err) {
        var response = errhandler(err);
        if (response == "ok") res.sendStatus(201);
        else res.status(500).json(response);
    });
});



//EDIT

router.post("/edit/:userID", function (req, res) {
    userID = req.params.userID;
    var b = req.body;

    UserModel.findOne({ _id: userID }, function (err, user) {
        if (err) return console.error(err);

        var newuser = new UserModel(user);

        for (var field in req.body) newuser[field] = b[field];

        UserModel.update({ _id: userID }, newuser, { runValidators: true }, function (err) {
            var response = errhandler(err);
            if (response == "ok") res.sendStatus(201);
            else res.status(500).json(response);
        });
    });
});

module.exports = router;