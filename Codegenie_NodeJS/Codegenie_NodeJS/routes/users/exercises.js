var schemas = require('../../mongoose/schemas');
var express = require('express');
var auth = require('../../passport/authlevels');
var router = express.Router();

var UserModel = schemas.UserModel;
var UserSeenModel = schemas.UserSeenModel;
var ExerciseModel = schemas.ExerciseModel;
var AnswerModel = schemas.AnswerModel;

var isLoggedIn = auth.isLoggedIn;

//USER EXERCISES

//GET

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

                if (seenresult)
                    for (var index in seenresult.seenexercises)
                        exerciseIDs.push(seenresult.seenexercises[index].exerciseid);

                ExerciseModel.find({
                    _id: {$nin: exerciseIDs},
                    course: req.user.course
                }).lean().exec(function (err, exresult) {
                    if (err) return console.error(err);

                    var send = {};
                    var newexarray = [];
                    for (var x in exresult) {
                        var obj = exresult[x];
                        if (obj.revealdate && new Date().toISOString() < obj.revealdate.toISOString()) continue;
                        newexarray.push(obj);
                    }

                    res.status(200).json(newexarray);
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

module.exports = router;