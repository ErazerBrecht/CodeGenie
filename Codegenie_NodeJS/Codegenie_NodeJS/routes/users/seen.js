var schemas = require('../../mongoose/schemas');
var express = require('express');
var auth = require('../../passport/authlevels');
var router = express.Router();

var AnswerModel = schemas.AnswerModel;
var ExerciseModel = schemas.ExerciseModel;
var UserSeenModel = schemas.UserSeenModel;

var savehandler = schemas.savehandler;

var isLoggedIn = auth.isLoggedIn;

//USER SEEN

//POST

router.post('/seen/new', isLoggedIn, function (req, res) {
    AddSeen(req, res, false);
});

router.post('/seen/revised', isLoggedIn, function (req, res) {
    AddSeen(req, res, true);
});

var AddSeen = function (req, res, revised) {
    UserSeenModel.findOne({userid: req.user._id}, function (err, result) {
        if (err) return console.error(err);
        if (!result) {
            //CREATE
            var newUserSeen = new UserSeenModel({userid: req.user._id, seenexercises: []});

            newUserSeen.seenexercises.push({exerciseid: req.body.exerciseid, revised: revised});
            newUserSeen.save(function (err) {
                savehandler(res, err);
            });
        }
        else {
            //ADD
            if (!result.seenexercises.some(function (seenobj) {
                    return (seenobj.exerciseid == req.body.exerciseid && seenobj.revised == req.body.revised);
                })) {
                //DOESNT EXIST, ADD
                result.seenexercises.push({exerciseid: req.body.exerciseid, revised: revised});
            }
            else {
                //EXISTS, UPDATE SEEN
                for (var x = 0; x < result.seenexercises.length; x++)
                    if (result.seenexercises[x].exerciseid == req.body.exerciseid && result.seenexercises[x].revised == req.body.revised) result.seenexercises.set(x, {
                        exerciseid: result.seenexercises[x].exerciseid,
                        revised: result.seenexercises[x].revised,
                        dateseen: new Date()
                    });
            }

            result.save(function (err) {
                savehandler(res, err);
            });
        }
    });
}

module.exports = router;