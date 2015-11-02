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
    AnswerModel.find(function (err, answers) {
        if (err) return console.error(err);

        res.status(200).json(answers);
    })
});

router.get('/:answerID', function (req, res) {
    answerID = req.params.answerID;

    AnswerModel.find({ _id: answerID }, function (err, answer) {
        if (err) return console.error(err);

        res.status(200).json(answer);
    })
});



//POST

router.post("/post", function (req, res) {
    var b = req.body;

    var answer = new AnswerModel({
        exerciseid: b.exerciseid,
        userid: b.userid,
        answered: b.answered,
        answers: b.answers
    });

    newexercise.save(function (err) {
        var response = errhandler(err);
        if (response == "ok") res.sendStatus(201);
        else res.status(500).json(response);
    });
});



//EDIT

router.post("/edit/:answerID", function (req, res) {
    answerID = req.params.answerID;
    var b = req.body;

    AnswerModel.findOne({ _id: answerID }, function (err, answer) {
        if (err) return console.error(err);

        var newanswer = new UserModel(answer);

        for (var field in req.body) newanswer[field] = b[field];

        AnswerModel.update({ _id: answerID }, newanswer, { runValidators: true }, function (err) {
            var response = errhandler(err);
            if (response == "ok") res.sendStatus(201);
            else res.status(500).json(response);
        });
    });
});

module.exports = router;