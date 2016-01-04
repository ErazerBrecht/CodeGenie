var schemas = require('../mongoose/schemas');
var express = require('express');
var mongoose = require('mongoose');
var auth = require('../passport/authlevels');
var router = express.Router();

var UserModel = schemas.UserModel;
var ExerciseModel = schemas.ExerciseModel;
var UserSeenModel = schemas.UserSeenModel;
var AnswerModel = schemas.AnswerModel;

var savehandler = schemas.savehandler;

var isAdmin = auth.isAdmin;


router.get('/', isAdmin, function (req, res) {
    res.render('adminpanel', {title: 'CodeGenie'});
});

//USERS GET

router.get('/users/:userID', isAdmin, function (req, res) {
    var userID = req.params.userID;

    UserModel.findById(userID, {password: 0}).lean().exec(function (err, result) {
        if (err) return console.error(err);

        res.status(200).json(result);
    })
});

router.get('/users/:userID/delete', isAdmin, function (req, res) {
    var userID = req.params.userID;

    UserModel.find({_id: userID}).remove(function (err) {
        if (err) return console.error(err);

        AnswerModel.find({userid: userID}).remove(function (err, affected) {
            if (err) return console.error(err);
            savehandler(res, err, "Succesfully deleted " + affected + (affected == 1 ? " user." : " users."));
        });
    });
});

router.get('/users/:userID/answers', isAdmin, function (req, res) {
    var userID = req.params.userID;

    if (req.query.display == "summary") {
        AnswerModel.aggregate(
            [
                {"$match": {"userid": mongoose.Types.ObjectId(userID)}},
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
        AnswerModel.find({userid: userID}).lean().exec(function (err, result) {
            if (err) return console.error(err);

            res.status(200).json(result);
        })
    }
});

//USER POST (MAINLY FOR MAKING ADMIN ACCOUNTS)

router.post("/users", isAdmin, function (req, res) {
    var newuser = new UserModel(req.body);

    newuser.save(function (err) {
        savehandler(res, err, "User created.");
    });
});

router.post("/users/assign", isAdmin, function (req, res) {
    var userlist = [];

    if (req.body.course == undefined) return res.status(400).json(['Found no course']);
    else if (req.body.users == undefined || req.body.users.length == 0) return res.status(400).json(['Found no users to assign']);

    for (var index in req.body.users) userlist.push({"id": req.body.users[index], "course": req.body.course});

    var totalaffected = 0;

    var promises = userlist.map(function (usobj) {
        return new Promise(function (resolve, reject) {
            UserModel.update({_id: usobj.id}, {$set: {status: 1, course: usobj.course}}, function (err, affected) {
                if (err) return reject(err);
                totalaffected += affected.result.n;
                resolve();
            });
        });
    });
    
    //Promise.all(promises).then(function () { res.status(200).json(["Succesfully assigned " + totalaffected + (totalaffected == 1 ? " user." : " users.")]); }).catch(console.error);
    Promise.all(promises).then(function () { savehandler(res, undefined, "Succesfully assigned " + totalaffected + (totalaffected == 1 ? " user." : " users."))});
});


//EXERCISES GET

router.get('/exercises', isAdmin, function (req, res) {
    ExerciseModel.find().lean().exec(function (err, result) {
        if (err) return console.error(err);

        for (var index in result) result[index].revealed = !(result[index].revealdate && new Date().toISOString() < result[index].revealdate.toISOString());

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

    AnswerModel.find({exerciseid: exerciseID}).lean().exec(function (err, result) {
        if (err) return console.error(err);

        res.status(200).json(result);
    })
});

router.get("/exercises/delete/:exerciseID", isAdmin, function (req, res) {
    var exerciseID = req.params.exerciseID;

    ExerciseModel.find({_id: exerciseID}).remove(function (err, affected) {
        if (err) return res.status(400).json(["Exercise doesn't exist."]);

        AnswerModel.find({exerciseid: exerciseID}).remove(function (err, affectedanswers) {
            if (err) return res.status(400).json(["Error removing the answers."]);

            // Maybe move this so we don't have to go through all the seenmodels,
            // only remove when the user gets /users/exercises and the corresponding exercise cant be found?
            // would also work when the user switches courses
            UserSeenModel.find({}).stream()
                .on('data', function (doc) {
                    doc.seenexercises.remove({exerciseid: req.params.exerciseID});
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

//EXERCISES POST

router.post("/exercises/post", isAdmin, function (req, res) {
    var newexercise = new ExerciseModel(req.body);

    if (!req.body.hasOwnProperty("questions") || req.body.questions.length == 0) return res.status(400).json(["No questions were sent. Please make at least one question!"]);

    newexercise.deadline.setHours(23);
    newexercise.deadline.setMinutes(59);
    newexercise.deadline.setSeconds(59);

    if(newexercise.revealdate != undefined)
    {
        newexercise.revealdate.setHours(0);
        newexercise.revealdate.setMinutes(0);
        newexercise.revealdate.setSeconds(0);
    }

    newexercise.save(function (err) {
        savehandler(res, err, "Exercise created.");
    });
});

router.post("/exercises/edit/:exerciseID", isAdmin, function (req, res) {
    var exerciseID = req.params.exerciseID;

    ExerciseModel.findOne({_id: exerciseID}, function (err, result) {
        if (err || !result) return res.status(400).json(["Exercise doesn't exist."]);

        for (var field in req.body) result[field] = req.body[field];

        result.deadline.setHours(23);
        result.deadline.setMinutes(59);
        result.deadline.setSeconds(59);

        result.save(function (err) {
            savehandler(res, err, "Exercise edited.");
        });
    });
});


//ANSWERS GET

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

router.get("/answers/delete/:answerID", isAdmin, function (req, res) {
    var answerID = req.params.answerID;

    AnswerModel.find({_id: answerID}).remove(function (err, affected) {
        if (err) return console.error(err);
        savehandler(res, err, "Succesfully deleted " + affected.nModified + (affected.nModified == 1 ? " answer." : " answers."));
    });
});

//ANSWERS POST

router.post("/answers/edit/:answerID", isAdmin, function (req, res) {
    var answerID = req.params.answerID;

    AnswerModel.findOne({_id: answerID}, function (err, result) {
        if (err) return console.error(err);

        console.log(result);
        ExerciseModel.findOne({_id: result.exerciseid}, function(exError, exResult){
            if(exError) return console.error(exError);

            if (exResult.deadline) if (new Date().toISOString() < exResult.deadline.toISOString()) return res.status(400).json(["Deadline not over yet. Users could still make changes."]);
            //TODO remove this? not sure if user should still be able to edit his answers after deadline
            //Brecht: Keep this :)

            for (var field in req.body) result[field] = req.body[field];

            result.save(function (err) { savehandler(res, err, "Answer edited."); });
        });
    });
});

module.exports = router;