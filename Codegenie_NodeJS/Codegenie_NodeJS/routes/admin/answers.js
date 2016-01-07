var schemas = require('../../mongoose/schemas');
var express = require('express');
var mongoose = require('mongoose');
var auth = require('../../passport/authlevels');
var router = express.Router();

var ExerciseModel = schemas.ExerciseModel;
var AnswerModel = schemas.AnswerModel;

var savehandler = schemas.savehandler;

var isAdmin = auth.isAdmin;

//ADMIN ANSWERS

//GET

router.get('/answers', isAdmin, function (req, res) {
    AnswerModel.find(function (err, result) {
        if (err) return console.error(err);

        res.status(200).json(result);
    })
});

router.get('/answers/:answerID', isAdmin, function (req, res) {
    var answerID = req.params.answerID;

    switch (answerID) {
        case 'revised':
            AnswerModel.find({revised: true}).lean().exec(function (err, result) {
                if (err) return console.error(err);

                res.status(200).json(result);
            });
            break;
        case 'unrevised':
            AnswerModel.find({revised: false}).lean().exec(function (err, result) {
                if (err) return console.error(err);

                res.status(200).json(result);
            });
            break;
        default:
            AnswerModel.find({_id: answerID}).lean().exec(function (err, result) {
                if (err) return console.error(err);

                res.status(200).json(result);
            });
            break;
    }
});

router.get("/answers/:answerID/delete", isAdmin, function (req, res) {
    var answerID = req.params.answerID;

    AnswerModel.find({_id: answerID}).remove(function (err, affected) {
        if (err) return console.error(err);
        savehandler(res, err, "Succesfully deleted " + affected.nModified + (affected.nModified == 1 ? " answer." : " answers."));
    });
});

//POST

router.post("/answers/edit", isAdmin, function (req, res) {
    var answerID = req.params.answerID;
    var answerArray = req.body;

    var totalAffected = 0;
    var totalWitheld = 0;

    var promises = answerArray.map(function (usobj) {
        return new Promise(function (resolve, reject) {
            AnswerModel.findOne({_id: usobj._id}, function (anError, result) {
                if (anError) reject(anError);

                ExerciseModel.findOne({_id: result.exerciseid}, function (exError, exResult) {
                    if (exError) reject(exError);

                    if (exResult.deadline && new Date() < exResult.deadline) {
                        totalWitheld++;
                        resolve()
                    }
                    else {
                        for (var field in req.body) result[field] = req.body[field];

                        result.save(function (saveError, affected) {
                            if (saveError) reject(saveError);
                            totalAffected++;
                            resolve();
                        });
                    }
                });
            });
        });
    });

    Promise.all(promises).then(function () {
        savehandler(res, undefined, "Succesfully edited " + totalAffected + (totalAffected == 1 ? " answer," : " answers,") + totalWitheld + (totalWitheld == 1 ? " answer" : " answers") + " were not edited because the deadline is not over yet.");
    }).catch(console.error);
});

router.post("/answers/:answerID/edit", isAdmin, function (req, res) {
    var answerID = req.params.answerID;

    AnswerModel.findOne({_id: answerID}, function (err, result) {
        if (err) return console.error(err);

        console.log(result);
        ExerciseModel.findOne({_id: result.exerciseid}, function (exError, exResult) {
            if (exError) return console.error(exError);

            if (exResult.deadline) if (new Date() < exResult.deadline) return res.status(400).json(["Deadline not over yet. Users could still make changes."]);

            for (var field in req.body) result[field] = req.body[field];

            result.save(function (err) {
                savehandler(res, err, "Answer edited.");
            });
        });
    });
});

module.exports = router;