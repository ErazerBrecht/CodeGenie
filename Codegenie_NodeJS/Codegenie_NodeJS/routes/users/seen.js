var schemas = require('../../mongoose/schemas');
var express = require('express');
var auth = require('../../passport/authlevels');
var router = express.Router();

var UserSeenModel = schemas.UserSeenModel;

var savehandler = schemas.savehandler;

var isLoggedIn = auth.isLoggedIn;

//GET

//TODO: Change url of this REST Endpoint
router.get('/seen/', isLoggedIn, function (req, res) {
    UserSeenModel.findOne({userid: req.user._id}).lean().exec(function (err, result) {
        if (err) return console.error(err);

        res.status(200).json(result);
    });
});

router.post('/seen/:exerciseID', isLoggedIn, function (req, res) {
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
                newSeenExercise = {};
                newSeenExercise.exerciseid = req.params.exerciseID;
                result.seenexercises.push(newSeenExercise);
            }
            else {
                for (var x = 0; x < result.seenexercises.length; x++)
                    if (result.seenexercises[x].exerciseid == req.params.exerciseID) result.seenexercises.set(x, {
                        exerciseid: result.seenexercises[x].exerciseid,
                        dateseen: new Date()
                    });
            }

            result.save(function (err) {
                savehandler(res, err);
            });
        }
    });
});

module.exports = router;