var schemas = require('../../mongoose/schemas');
var express = require('express');
var mongoose = require('mongoose');
var auth = require('../../passport/authlevels');
var router = express.Router();

var UserModel = schemas.UserModel;
var ExerciseModel = schemas.ExerciseModel;
var UserSeenModel = schemas.UserSeenModel;
var AnswerModel = schemas.AnswerModel;

var savehandler = schemas.savehandler;

var isAdmin = auth.isAdmin;

//ADMIN EXERCISES

//GET

router.get('/exercises', isAdmin, function (req, res) {
    ExerciseModel.find().lean().exec(function (err, result) {
        if (err) return console.error(err);

        for (var index in result)
            if (result.hasOwnProperty(index))
                result[index].revealed = !(result[index].revealdate && new Date() < result[index].revealdate);

        res.status(200).json(result);
    })
});

router.get('/exercises/:exerciseID', isAdmin, function (req, res) {
    var exerciseID = req.params.exerciseID;

    ExerciseModel.findById(exerciseID).lean().exec(function (err, result) {
        if (err) return console.error(err);

        res.status(200).json(result);
    })
});

router.get('/exercises/:exerciseID/answers', isAdmin, function (req, res) {
    var exerciseID = req.params.exerciseID;

    ExerciseModel.findById(exerciseID).lean().exec(function (err, result) {
        if (err) return console.error(err);
        if (!result) return res.status(400).json(["Not an eligible exercise ID."]);

        AnswerModel.find({exerciseid: exerciseID}).lean().exec(function (err, result) {
            if (err) return console.error(err);

            res.status(200).json(result);
        })
    })
});

router.get("/exercises/:exerciseID/delete", isAdmin, function (req, res) {
    var exerciseID = req.params.exerciseID;

    ExerciseModel.findById(exerciseID).lean().exec(function (err, result) {
        if (err) return console.error(err);
        if (!result) return res.status(400).json(["Not an eligible exercise ID."]);

        ExerciseModel.find({_id: exerciseID}).remove(function (err, affected) {
            if (err) return res.status(400).json(["Exercise doesn't exist."]);

            AnswerModel.find({exerciseid: exerciseID}).remove(function (err, affectedanswers) {
                if (err) return res.status(400).json(["Error removing the answers."]);

                // Maybe move this so we don't have to go through all the seenmodels,
                // only remove when the user gets /users/exercises and the corresponding exercise cant be found?
                // would also work when the user switches courses
                UserSeenModel.find({}).stream()
                    .on('data', function (doc) {
                        doc.seenexercises.remove({exerciseid: exerciseID});
                        doc.save();
                    })
                    .on('error', function (err) {
                        console.error(err);
                    })
                    .on('end', function () {
                        savehandler(res, undefined, "Succesfully deleted " + affected.result.n + (affected.result.n == 1 ? " exercise." : " exercises.") + " and " + affectedanswers.result.n + (affectedanswers.result.n == 1 ? " answer." : " answers."));
                    });
            });
        });
    });
});

router.get('/exercises/:exerciseID/unsolved', isAdmin, function (req, res) {
    var exerciseID = req.params.exerciseID;

    ExerciseModel.findById(exerciseID).lean().exec(function (err, exerciseResult) {
        if (err) return console.error(err);
        if (!exerciseResult) return res.status(400).json(["Exercise not found."]);

        AnswerModel.find({
            course: exerciseResult.course,
            exerciseid: exerciseID
        }).lean().exec(function (err, answerResult) {
            if (err) return console.error(err);

            var userList = [];

            for (var i in answerResult)
                if (answerResult.hasOwnProperty(i))
                    userList.push(answerResult[i].userid);

            UserModel.find({
                "_id": {$nin: userList},
                course: exerciseResult.course
            }).lean().exec(function (err, userResult) {
                if (err) return console.error(err);

                res.status(200).json(userResult)
            });
        });
    })
});

//POST

router.post("/exercises/", isAdmin, function (req, res) {
    var newexercise = new ExerciseModel(req.body);

    if (!req.body.hasOwnProperty("questions") || req.body.questions.length == 0) return res.status(400).json(["No questions were sent. Please make at least one question!"]);

    if (!deadline) newexercise.deadline = new Date();
    else {
        newexercise.deadline.setHours(23);
        newexercise.deadline.setMinutes(59);
        newexercise.deadline.setSeconds(59);
    }

    if (newexercise.revealdate != undefined) {
        newexercise.revealdate.setHours(0);
        newexercise.revealdate.setMinutes(0);
        newexercise.revealdate.setSeconds(0);
    }

    newexercise.save(function (err) {
        savehandler(res, err, "Exercise created.");
    });
});

router.post("/exercises/:exerciseID/edit", isAdmin, function (req, res) {
    var exerciseID = req.params.exerciseID;

    ExerciseModel.findOne({_id: exerciseID}, function (err, result) {
        if (err || !result) return res.status(400).json(["Exercise doesn't exist."]);

        for (var field in req.body)
            if (req.body.hasOwnProperty(field))
                result[field] = req.body[field];

        result.deadline.setHours(23);
        result.deadline.setMinutes(59);
        result.deadline.setSeconds(59);

        result.save(function (err) {
            savehandler(res, err, "Exercise edited.");
        });
    });
});

module.exports = router;