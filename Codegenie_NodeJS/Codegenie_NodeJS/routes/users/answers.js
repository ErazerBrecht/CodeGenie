var schemas = require('../../mongoose/schemas');
var express = require('express');
var auth = require('../../passport/authlevels');
var mongoose = require('mongoose');
var router = express.Router();

var ExerciseModel = schemas.ExerciseModel;
var AnswerModel = schemas.AnswerModel;

var savehandler = schemas.savehandler;
var questionExists = schemas.questionExists;

var isLoggedIn = auth.isLoggedIn;

//USER ANSWERS

//GET

router.get('/answers', isLoggedIn, function (req, res) {
    if (req.query.display == "summary") {
        AnswerModel.aggregate(
            [
                {"$match": {"userid": mongoose.Types.ObjectId(req.user._id)}},
                {
                    $group: {
                        "_id": {
                            "exerciseid": "$exerciseid",
                            "exercisetitle": "$title",
                            "created": "$created",
                            "revised": "$revised"
                        },
                        "answers": {$push: "$answers"}
                    }
                },
                {$unwind: "$answers"},
                {$unwind: "$answers"},
                {
                    $group: {
                        "_id": {
                            "exerciseid": "$_id.exerciseid",
                            "exercisetitle": "$_id.exercisetitle",
                            "created": "$_id.created",
                            "revised": "$_id.revised"
                        },
                        "weight": {$sum: "$answers.weight"},
                        "received": {$sum: "$answers.received"}
                    }
                },
                {
                    $project: {
                        "_id": 0,
                        "exerciseid": "$_id.exerciseid",
                        "exercisetitle": "$_id.exercisetitle",
                        "created": "$_id.created",
                        "revised": "$_id.revised",
                        "weight": "$weight",
                        "received": "$received"
                    }
                }
            ],
            function (err, aggresult) {
                if (err) console.error(err);
                else {
                    res.status(200).json(aggresult);
                }
            }
        );
    }
    else {
        AnswerModel.find({userid: req.user._id}).lean().exec(function (err, result) {
            if (err) return console.error(err);

            res.status(200).json(result);
        })
    }
});

router.get('/answers/:answerID', isLoggedIn, function (req, res) {
    var answerID = req.params.answerID;
    switch (answerID) {
        case "revised":
            AnswerModel.find({userid: req.user._id, revised: true}).lean().exec(function (err, result) {
                if (err) return console.error(err);

                res.status(200).json(result);
            });
            break;
        default:
            AnswerModel.find({_id: answerID, userid: req.user._id}).lean().exec(function (err, result) {
                if (err) return console.error(err);

                res.status(200).json(result);
            });
            break;
    }
});

//POST

router.post('/answers', isLoggedIn, function (req, res) {
    var exerciseID = req.body.exerciseid;

    AnswerModel.findOne({userid: req.user._id, exerciseid: exerciseID}).lean().exec(function (err, anresult) {
        if (err) return console.error(err);
        if (!anresult) {
            //CREATE ANSWER
            ExerciseModel.findOne({_id: exerciseID, course: req.user.course}).lean().exec(function (err, result) {
                if (err) return console.error(err);
                if (!result) return res.status(400).json(["Not an eligible exercise ID"]);

                var answer = req.body;
                var newanswer = new AnswerModel();

                if (!answer.answers) return res.status(400).json(["There were no answers given."]);

                //User needs to be able to post after deadline.
                //if (result.deadline) if (new Date().toISOString() > result.deadline.toISOString()) return res.status(400).json(["Deadline is already over."]);
                if (result.revealdate) if (new Date().toISOString() < result.revealdate.toISOString()) return res.status(400).json(["Not an eligible exercise ID"]);

                newanswer.userid = req.user._id;
                newanswer.exerciseid = exerciseID;
                newanswer.title = result.title;
                newanswer.extra = result.extra;
                newanswer.classification = result.classification;
                newanswer.course = result.course;
                newanswer.created = new Date().toISOString();
                for (var answerIndex in answer.answers) {
                    if (!questionExists(answer.answers[answerIndex], result.questions)) {
                        return res.status(400).json(["There was a problem processing answer with questionid: " + answer.answers[answerIndex].questionid]);
                    }
                    for (var questionIndex in result.questions) {
                        var an = answer.answers[answerIndex];
                        var qu = result.questions[questionIndex];
                        if (an.questionid == qu._id) {
                            an.received = 0;
                            an.questiontitle = qu.questiontitle;
                            an.type = qu.type;
                            an.weight = qu.weight;
                            an.extra = qu.extra;
                            newanswer.answers.push(an);
                        }
                    }
                }

                //(MAYBE)TODO: check if questionids that were posted are actually unique
                if (newanswer.answers.length != result.questions.length) return res.status(400).json(["There were some questions missing."]);

                newanswer.save(function (err) {
                    savehandler(res, err, "Answer created.");
                });
            });
            //CREATE ANSWER END
        }
        else {
            //EDIT ANSWER
            AnswerModel.findOne({userid: req.user._id, exerciseid: exerciseID}, function (err, result) {
                if (err) return console.error(err);
                if (!result) return res.status(400).json(["Not an eligible exercise ID"]);

                if (result.deadline) if (new Date().toISOString() > result.deadline.toISOString()) return res.status(400).json(["Deadline is already over."]);
                if (result.revealdate) if (new Date().toISOString() < result.revealdate.toISOString()) return res.status(400).json(["Not an eligible exercise ID"]);

                var newanswerlist = req.body.answers;

                for (var i = 0; i < newanswerlist.length; i++) {
                    for (var x = 0; x < result.answers.length; x++) {
                        if (result.answers[x].questiontitle === newanswerlist[i].questiontitle) {
                            result.answers[x].result = newanswerlist[i].result;
                            result.answers[x].choices = newanswerlist[i].choices; //If this doesn't get updated, the user can't edit his answers to any multiplechoice questions.
                        }
                    }
                }

                result.save(function (err) {
                    savehandler(res, err, "Answer edited.");
                });
            });
            //EDIT ANSWER END
        }
    })
});

module.exports = router;