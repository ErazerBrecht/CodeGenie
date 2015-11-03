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
var isAdmin = auth.isAdmin;
var isUser = auth.isUser;



//GET

router.get('/', isLoggedIn, function (req, res) {
    ExerciseModel.find(function (err, exercises) {
        if (err) return console.error(err);

        res.status(200).json(exercises);
    })
});

router.get('/:exerciseID', isLoggedIn, function (req, res) {
    exerciseID = req.params.exerciseID;

    ExerciseModel.find({ _id: exerciseID }, function (err, exercise) {
        if (err) return console.error(err);

        res.status(200).json(exercise);
    })
});

router.get('/:exerciseID/answers', isAdmin, function (req, res) {
    exerciseID = req.params.exerciseID;

    AnswerModel.find({ exerciseid: exerciseID }, function (err, exercise) {
        if (err) return console.error(err);

        res.status(200).json(exercise);
    })
});



//POST

router.post("/post", isAdmin, function (req, res) {
    var newexercise = new ExerciseModel(req.body);

    newexercise.save(function (err) {
        var response = errhandler(err);
        if (response == "ok") res.sendStatus(201);
        else res.status(500).json(response);
    });
});



//EDIT

router.post("/edit/:exerciseID", isAdmin, function (req, res) {
    exerciseID = req.params.exerciseID;
    var b = req.body;

    ExerciseModel.findOne({ _id: exerciseID }, function (err, exercise) {
        if (err) return console.error(err);

        var newexercise = new ExerciseModel(exercise);

        for (var field in req.body) newexercise[field] = b[field];

        ExerciseModel.update({ _id: exerciseID }, newexercise, { runValidators: true }, function (err) {
            var response = errhandler(err);
            if (response == "ok") res.sendStatus(201);
            else res.status(500).json(response);
        });
    });
});

module.exports = router;