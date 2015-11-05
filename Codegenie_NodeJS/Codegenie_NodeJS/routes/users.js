var schemas = require('../mongoose/schemas');
var bodyParser = require('body-parser');
var express = require('express');
var auth = require('../passport/authlevels');
var moment = require('moment');
var router = express.Router();

var UserModel = schemas.UserModel;
var ExerciseModel = schemas.ExerciseModel;
var AnswerModel = schemas.AnswerModel;

var errhandler = schemas.errhandler;
var questionExists = schemas.questionExists;

var isLoggedIn = auth.isLoggedIn;
var isAdmin = auth.isAdmin;
var isCorrectUser = auth.isCorrectUser;



//GET

router.get('/', isAdmin, function (req, res) {
    UserModel.find(function (err, result) {
        if (err) return console.error(err);

        res.status(200).json(result);
    })
});

router.get('/mine', isLoggedIn, function (req, res) {
    UserModel.findById(req.user._id, function (err, result) {
        if (err) return console.error(err);

        res.status(200).json(result);
    })
});

router.get('/exercises', isLoggedIn, function (req, res) {
    ExerciseModel.find({ class: req.user.class }, function (err, result) {
        if (err) return console.error(err);

        res.status(200).json(result);
    })
});


router.get('/exercises/:exerciseID', isLoggedIn, function (req, res) {
    var exerciseID = req.params.exerciseID;

    ExerciseModel.find({ _id: exerciseID, class: req.user.class }, function (err, result) {
        if (err) return console.error(err);

        res.status(200).json(result);
    })
});

router.get('/answers', isLoggedIn, function (req, res) {
    AnswerModel.find({ userid: req.user._id }, function (err, result) {
        if (err) return console.error(err);

        res.status(200).json(result);
    })
});

router.get('/answers/:answerID', isLoggedIn, function (req, res) {
    var answerID = req.params.answerID;

    AnswerModel.find({ _id: answerID, userid: req.user._id }, function (err, result) {
        if (err) return console.error(err);

        res.status(200).json(result);
    })
});



//POST

router.post('/answer', isLoggedIn, function (req, res) {
    var exerciseID = req.body.exerciseid;
    var answer = req.body;
    var newanswer = new AnswerModel;

    ExerciseModel.findOne({ _id: exerciseID, class: req.user.class }, function (err, result) {
        if (err) return console.error(err);
        if (!result) return res.status(500).send("Not an eligible exercise ID");

        if (result.hasOwnProperty('deadline')) {
            if (moment().format("DD/MM/YYYY").isAfter(result.deadline)) res.status(200).send("Deadline is already over.");
        }

        newanswer.userid = req.user._id;
        newanswer.exerciseid = exerciseID;
        newanswer.answered = moment().format("DD/MM/YYYY");

        var answerlist = answer.answers;
        for (var index in answerlist) {
            if (questionExists(answerlist[index], result.questions)) {
                answerlist[index].received = 0;
                newanswer.answers.push(answerlist[index]);
            }
        }

        newanswer.save(function (err) {
            var response = errhandler(err);
            if (response == "ok") res.sendStatus(201);
            else res.status(500).json(response);
        });
    })
});

router.post("/post", isAdmin, function (req, res) {
    var newuser = new UserModel(req.body);

    newuser.lastseen = moment().format("DD/MM/YYYY");
    newuser.admin = false;

    newuser.save(function (err) {
        var response = errhandler(err);
        if (response == "ok") res.sendStatus(201);
        else res.status(500).json(response);
    });
});

router.post("/edit", isLoggedIn, function (req, res) {
    UserModel.findById(req.user._id, function (err, result) {
        if (err) return console.error(err);

        var newuser = new UserModel(result);

        for (var field in req.body) newuser[field] = req.body[field];

        if (!req.user.admin) newuser.admin = false;

        UserModel.update({ _id: userID }, newuser, { runValidators: true }, function (err) {
            var response = errhandler(err);
            if (response == "ok") res.sendStatus(201);
            else res.status(500).json(response);
        });
    });
});

module.exports = router;