var schemas = require('../mongoose/schemas');
var express = require('express');
var auth = require('../passport/authlevels');
var bCrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var moment = require('moment');
var router = express.Router();

var UserModel = schemas.UserModel;
var UserSeenModel = schemas.UserSeenModel;
var ExerciseModel = schemas.ExerciseModel;
var AnswerModel = schemas.AnswerModel;

var savehandler = schemas.savehandler;
var questionExists = schemas.questionExists;

var isLoggedIn = auth.isLoggedIn;
var isAdmin = auth.isAdmin;


//GET

router.get('/', isAdmin, function (req, res) {
    UserModel.find({}, {password: 0}).lean().exec(function (err, result) {
        if (err) return console.error(err);

        res.status(200).json(result);
    })
});

router.get('/mine', isLoggedIn, function (req, res) {
    UserModel.findById(req.user._id, {password: 0}).lean().exec(function (err, result) {
        if (err) return console.error(err);

        res.status(200).json(result);
    })
});

router.get('/exercises', isLoggedIn, function (req, res) {

    var response = [];
    ExerciseModel.find({course: req.user.course}).lean().exec(function (err, exresult) {
        if (err) return console.error(err);

        UserSeenModel.findOne({userid: req.user._id}, function (err, seenresult) {
            if (err) return console.error(err);

            UserModel.findOne({_id: req.user._id}, {lastseen: 1}, function (err, userResult) {
                if (err) return console.error(err);

                var exerciselist = [];
                for (var index in exresult) {
                    var obj = exresult[index];
                    if (obj.revealdate && new Date().toISOString() < obj.revealdate.toISOString()) continue;

                    exerciselist.push({
                        "id": obj._id,
                        "index": index,
                        "seen": seenresult ? seenresult.seenexercises.some(function (seenobj) {
                            return seenobj.exerciseid.equals(obj._id);
                        }) : false
                    });
                }

                var promises = exerciselist.map(function (exobj) {
                    return new Promise(function (resolve, reject) {
                        AnswerModel.findOne({
                            exerciseid: exobj.id,
                            userid: req.user._id
                        }, {created: 1}, function (err, anresult) {
                            if (err) return reject(err);
                            if (anresult) {
                                exresult[exobj.index].solved = true;
                                exresult[exobj.index].answercreated = anresult.created;
                            }
                            else exresult[exobj.index].solved = false;

                            exresult[exobj.index].seen = exobj.seen;
                            response.push(exresult[exobj.index]);
                            resolve();
                        });
                    });
                });

                Promise.all(promises).then(function () {
                    UserModel.update({_id: req.user._id}, {$set: {'lastseen': new Date().toISOString()}}, {runValidators: true}, function (err) {
                        if (err) console.log('Error updating lastseen for user: ' + user.name);
                        res.status(200).json(response);
                    });
                }).catch(console.error);
            });
        });
    });
});


router.get('/exercises/:exerciseID', isLoggedIn, function (req, res) {
    var exerciseID = req.params.exerciseID;

    switch (exerciseID) {
        case 'new':
            UserSeenModel.findOne({userid: req.user._id}).lean().exec(function (err, seenresult) {
                if (err) return console.error(err);

                var exerciseIDs = [];

                if (seenresult) for (var index in seenresult.seenexercises) exerciseIDs.push(seenresult.seenexercises[index].exerciseid);

                ExerciseModel.find({_id: {$nin: exerciseIDs}, course: req.user.course}, function (err, exresult) {
                    if (err) return console.error(err);
                    var send = {};
                    send.exercises = exresult;
                    send.count = exresult.length;
                    res.status(200).json(send);
                })
            });
            break;
        case 'solved':
            AnswerModel.find({userid: req.user._id}, {exerciseid: 1}, function (err, anresult) {
                if (err) return console.error(err);

                var exerciseIDs = [];

                for (var index in anresult) exerciseIDs.push(anresult[index].exerciseid);

                ExerciseModel.find({_id: {$in: exerciseIDs}}, function (err, exresult) {
                    if (err) return console.error(err);

                    res.status(200).json(exresult);
                })
            });
            break;
        case 'unsolved':
            AnswerModel.find({userid: req.user._id}, {exerciseid: 1}, function (err, anresult) {
                if (err) return console.error(err);

                var exerciseIDs = [];

                for (var index in anresult) {
                    if (anresult[index].revealdate && new Date().toISOString() < anresult[index].revealdate.toISOString()) continue;
                    exerciseIDs.push(anresult[index].exerciseid);
                }

                ExerciseModel.find({_id: {$nin: exerciseIDs}, course: req.user.course}, function (err, exresult) {
                    if (err) return console.error(err);

                    res.status(200).json(exresult);
                })
            });
            break;
        default:
            ExerciseModel.find({_id: exerciseID, course: req.user.course}).lean().exec(function (err, result) {
                if (err) return console.error(err);

                res.status(200).json(result);
            });
            break;
    }
});

router.get('/exercises/:exerciseID/answers', isLoggedIn, function (req, res) {
    var exerciseID = req.params.exerciseID;

    AnswerModel.findOne({exerciseid: exerciseID, userid: req.user._id}).lean().exec(function (err, result) {
        if (err) return console.error(err);

        res.status(200).json(result);
    });
});

//TODO: Change url of this REST Endpoint
router.get('/seen/', isLoggedIn, function (req, res) {
    UserSeenModel.findOne({userid: req.user._id}).lean().exec(function (err, result) {
        if (err) return console.error(err);

        res.status(200).json(result);
    });
});

router.post('/seen/:exerciseID', isLoggedIn, function (req, res) {
    console.log("Updating seen exercises");

    UserSeenModel.findOne({userid: req.user._id}, function (err, result) {
        if (err) return console.error(err);
        if (!result) {
            //CREATE
            var newUserSeen = new UserSeenModel();
            newUserSeen.userid = req.user._id;
            newUserSeen.seenexercises = [];
            var newSeenExercise = {};
            newSeenExercise.exerciseid = req.params.exerciseID;

            newUserSeen.seenexercises.push(newSeenExercise);
            newUserSeen.save(function (err) {
                savehandler(res, err);
            });
        }
        else {
            if (!result.seenexercises.some(function (seenobj) {
                    return seenobj.exerciseid == req.params.exerciseID;
                })) {
                newSeenExercise.exerciseid = req.params.exerciseID;
                result.seenexercises.push(newSeenExercise);
            }
            else {
                for (var x = 0; x < result.seenexercises.length; x++)
                    if (result.seenexercises[x].exerciseid == req.params.exerciseID) result.seenexercises.set(x, {
                        exerciseid: result.seenexercises[x].exerciseid,
                        dateseen: new Date().toISOString()
                    });
            }

            result.save(function (err) {
                savehandler(res, err);
            });
        }
    });
});

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

router.post('/answer', isLoggedIn, function (req, res) {
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

router.post("/edit", isLoggedIn, function (req, res) {
    UserModel.findById(req.user._id, function (err, result) {
        if (err) return console.error(err);

        var newuser = new UserModel(result);

        for (var field in req.body) newuser[field] = req.body[field];

        delete newuser._id;
        delete newuser.status;
        delete newuser.course;

        newuser.password = createHash(password);

        delete newuser.registerdate;
        delete newuser.lastseen;
        delete newuser.__v;

        result.save(function (err) {
            savehandler(res, err, "Profile edited.");
        });
    });
});

var createHash = function (password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

module.exports = router;