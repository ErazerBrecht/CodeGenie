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
    ExerciseModel.find(function (err, exercises) {
        if (err) return console.error(err);

        res.status(200).json(exercises);
    })
});

router.get('/:exerciseID', function (req, res) {
    exerciseID = req.params.exerciseID;

    ExerciseModel.find({ _id: exerciseID }, function (err, exercise) {
        if (err) return console.error(err);

        res.status(200).json(exercise);
    })
});

router.get('/:exerciseID/answers', function (req, res) {
    exerciseID = req.params.exerciseID;

    AnswerModel.find({ exerciseid: exerciseID }, function (err, exercise) {
        if (err) return console.error(err);

        res.status(200).json(exercise);
    })
});



//POST

router.post("/post", function (req, res) {
    var b = req.body;

    var newexercise = new ExerciseModel({
        title: b.title,
        classification: b.classification,
        weight: b.weight,
        deadline: b.deadline,
        created: b.created,
        extra: b.extra,
        questions: b.questions
    });

    newexercise.save(function (err) {
        var response = errhandler(err);
        if (response == "ok") res.sendStatus(201);
        else res.status(500).json(response);
    });
});



//EDIT

router.post("/edit/:exerciseID", function (req, res) {
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