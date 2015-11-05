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
var isCorrectUser = auth.isCorrectUser;



//GET

router.get('/', isAdmin, function (req, res) {
    UserModel.find(function (err, users) {
        if (err) return console.error(err);

        res.status(200).json(users);
    })
});

router.get('/mine', isLoggedIn, function (req, res) {
    UserModel.findById(req.user._id, function (err, user) {
        if (err) return console.error(err);

        res.status(200).json(user);
    })
});

router.get('/exercises', isLoggedIn, function (req, res) {
    ExerciseModel.find({ class: req.user.class }, function (err, exercises) {
        if (err) return console.error(err);

        res.status(200).json(exercises);
    })
});


router.get('/exercises/:exerciseID', isLoggedIn, function (req, res) {
    var exerciseID = req.params.exerciseID;

    ExerciseModel.find({ _id: exerciseID, class: req.user.class }, function (err, exercise) {
        if (err) return console.error(err);

        res.status(200).json(exercise);
    })
});

router.get('/exercises/answers', isLoggedIn, function (req, res) {
    AnswerModel.find({ userid: req.user._id }, function (err, answer) {
        if (err) return console.error(err);

        res.status(200).json(answer);
    })
});

router.get('/exercises/answers/:answerID', isLoggedIn, function (req, res) {
    var answerID = req.params.answerID;

    AnswerModel.find({ _id: answerID, userid: req.user._id }, function (err, answer) {
        if (err) return console.error(err);

        res.status(200).json(answer);
    })
});



//POST

router.post('/answer', isLoggedIn, function (req, res) {
    var exerciseID = req.body.exerciseid;
    var answer = new AnswerModel(req.body);

    ExerciseModel.find({ _id: exerciseID, class: req.user.class }, function (err, exercise) {
        if (err) return console.error(err);

        if (exercise.hasOwnProperty('deadline')) {
            if (moment().format("DD/MM/YYYY").isAfter(exercise.deadline)) res.status(200).send("Deadline is already over.");
        }

        exercise.answered = moment().format("DD/MM/YYYY");

        for (var question in answer.questions) {
            question.received = 0;
        }

        newuser.save(function (err) {
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
    UserModel.findById(req.user._id, function (err, user) {
        if (err) return console.error(err);

        var newuser = new UserModel(user);

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