﻿var schemas = require('../mongoose/schemas');
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



//GET

router.get('/', isAdmin, function (req, res) {
    UserModel.find(function (err, result) {
        if (err) return console.error(err);

        for (var user in result) result[user]["password"] = undefined;

        res.status(200).json(result);
    })
});

router.get('/mine', isLoggedIn, function (req, res) {
    UserModel.findById(req.user._id, function (err, result) {
        if (err) return console.error(err);

        result["password"] = undefined;

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
    switch (exerciseID) {
        case 'solved':
            console.log(req.user._id);
            AnswerModel.find({ userid: req.user._id }, function (err, result) {
                if (err) return console.error(err);

                res.status(200).json(result);
            })
            break;
        case 'unsolved':
            ExerciseModel.find({ userid: req.user._id, class: req.user.class }, function (err, result) {
                if (err) return console.error(err);

                res.status(200).json(result);
            })
            break;
        default:
            ExerciseModel.find({ _id: exerciseID, class: req.user.class }, function (err, result) {
                if (err) return console.error(err);

                res.status(200).json(result);
            })
            break;
    }
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

        if (result.deadline) {
            if (new Date(moment().format("DD/MM/YYYY")).getTime() > new Date(result.deadline).getTime()) return res.status(200).send("Deadline is already over.");
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
            else return res.status(500).send("There was a problem processing answer with questionid: " + answerlist[index].questionid);
        }

        newanswer.save(function (err) {
            var response = errhandler(err);
            if (response != "ok") return res.status(500).json(response);
            return res.sendStatus(201);
        });
    })
});

router.post("/edit", isLoggedIn, function (req, res) {
    UserModel.findById(req.user._id, function (err, result) {
        if (err) return console.error(err);

        var newuser = new UserModel(result);

        for (var field in req.body) newuser[field] = req.body[field];

        newuser._id = undefined;
        newuser.admin = undefined; //prevent user from editing random/protected information, everything else is allowed.
        newuser.password = undefined;
        newuser.status = undefined;

        newuser.registerdate = undefined;
        newuser.lastseen = undefined;
        newuser.__v = undefined;

        UserModel.update({ _id: req.user._id }, { $set: newuser }, { runValidators: true }, function (err) {
            var response = errhandler(err);
            if (response == "ok") res.sendStatus(201);
            else res.status(500).json(response);
        });
    });
});

module.exports = router;