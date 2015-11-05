var schemas = require('../mongoose/schemas');
var bodyParser = require('body-parser');
var express = require('express');
var auth = require('../passport/authlevels');
var router = express.Router();

var UserModel = schemas.UserModel;
var ExerciseModel = schemas.ExerciseModel;
var AnswerModel = schemas.AnswerModel;

var errhandler = schemas.errhandler;

var isAdmin = auth.isAdmin;



//EXERCISES GET

router.get('/', isAdmin, function (req, res) {
    AnswerModel.find(function (err, answers) {
        if (err) return console.error(err);

        res.status(200).json(answers);
    })
});


router.get('/exercises', isAdmin, function (req, res) {
    ExerciseModel.find(function (err, exercises) {
        if (err) return console.error(err);

        res.status(200).json(exercises);
    })
});

router.get('/exercises/:exerciseID', isAdmin, function (req, res) {
    var exerciseID = req.params.exerciseID;

    ExerciseModel.findById(exerciseID, function (err, exercise) {
        if (err) return console.error(err);

        res.status(200).json(exercise);
    })
});

router.get('/exercises/:exerciseID/answers', isAdmin, function (req, res) {
    var exerciseID = req.params.exerciseID;

    AnswerModel.find({ exerciseid: exerciseID }, function (err, exercise) {
        if (err) return console.error(err);

        res.status(200).json(exercise);
    })
});

//EXERCISES POST

router.post("/exercises/post", isAdmin, function (req, res) {
    var newexercise = new ExerciseModel(req.body);

    newexercise.save(function (err) {
        var response = errhandler(err);
        if (response == "ok") res.sendStatus(201);
        else res.status(500).json(response);
    });
});

router.post("/exercises/edit/:exerciseID", isAdmin, function (req, res) {
    var exerciseID = req.params.exerciseID;

    ExerciseModel.findOne({ _id: exerciseID }, function (err, exercise) {
        if (err) return console.error(err);

        var newexercise = new ExerciseModel(exercise);

        for (var field in req.body) newexercise[field] = req.body[field];

        ExerciseModel.update({ _id: exerciseID }, newexercise, { runValidators: true }, function (err) {
            var response = errhandler(err);
            if (response == "ok") res.sendStatus(201);
            else res.status(500).json(response);
        });
    });
});





//ANSWERS GET

router.get('/answers', isAdmin, function (req, res) {
    AnswerModel.find(function (err, answer) {
        if (err) return console.error(err);

        res.status(200).json(answer);
    })
});

router.get('/answers/:answerID', isAdmin, function (req, res) {
    var answerID = req.params.answerID;

    AnswerModel.find({ _id: answerID }, function (err, answer) {
        if (err) return console.error(err);

        res.status(200).json(answer);
    })
});

//ANSWERS POST

router.post("/answers/post", isAdmin, function (req, res) {
    var newanswer = new AnswerModel(req.body);

    newanswer.save(function (err) {
        var response = errhandler(err);
        if (response == "ok") res.sendStatus(201);
        else res.status(500).json(response);
    });
});

router.post("/answers/edit/:answerID", isAdmin, function (req, res) {
    var answerID = req.params.answerID;

    AnswerModel.findOne({ _id: answerID }, function (err, answer) {
        if (err) return console.error(err);

        var newanswer = new UserModel(answer);

        for (var field in req.body) newanswer[field] = req.body[field];

        AnswerModel.update({ _id: answerID }, newanswer, { runValidators: true }, function (err) {
            var response = errhandler(err);
            if (response == "ok") res.sendStatus(201);
            else res.status(500).json(response);
        });
    });
});

module.exports = router;