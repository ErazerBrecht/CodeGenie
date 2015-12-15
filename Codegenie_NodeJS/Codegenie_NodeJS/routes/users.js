var schemas = require('../mongoose/schemas');
var bodyParser = require('body-parser');
var express = require('express');
var auth = require('../passport/authlevels');
var bCrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
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
    UserModel.find({}, { password: 0 }).lean().exec(function (err, result) {
        if (err) return console.error(err);
        
        res.status(200).json(result);
    })
});

router.get('/mine', isLoggedIn, function (req, res) {
    UserModel.findById(req.user._id, { password: 0 }).lean().exec(function (err, result) {
        if (err) return console.error(err);
        
        res.status(200).json(result);
    })
});

router.get('/exercises', isLoggedIn, function (req, res) {
    
    var response = [];
    ExerciseModel.find({ course: req.user.course }).lean().exec(function (err, exresult) {
        if (err) return console.error(err);
        
        UserModel.findOne({ _id: req.user._id }, { lastseen: 1 }, function (err, userResult) {
            if (err) return console.error(err);
            
            var exerciselist = [];
            for (var index in exresult) {
                var obj = exresult[index];
                if (obj.revealdate && new Date().toISOString() < obj.revealdate.toISOString()) continue;
                exerciselist.push({ "id": obj._id, "index": index, "lastseen": userResult.lastseen });
            }

            var promises = exerciselist.map(function (exobj) {
                return new Promise(function (resolve, reject) {
                    AnswerModel.findOne({ exerciseid: exobj.id, userid: req.user._id }, function (err, anresult) {
                        if (err) return reject(err);
                        if (anresult) exresult[exobj.index].solved = true;
                        else exresult[exobj.index].solved = false;
                        
                        if (exobj.lastseen.toISOString() > exresult[exobj.index].created.toISOString()) exresult[exobj.index].seen = true;
                        else exresult[exobj.index].seen = false;
                        response.push(exresult[exobj.index]);
                        resolve();
                    });
                });
            });
            
            Promise.all(promises).then(function () {
                UserModel.update({ _id: req.user._id }, { $set: { 'lastseen': new Date().toISOString() } }, { runValidators: true }, function (err) {
                    if (err) console.log('Error updating lastseen for user: ' + user.name);
                    res.status(200).json(response);
                });
            }).catch(console.error);
        });
    });
});


router.get('/exercises/:exerciseID', isLoggedIn, function (req, res) {
    var exerciseID = req.params.exerciseID;
    switch (exerciseID) {
        case 'solved':
            AnswerModel.find({ userid: req.user._id }, { exerciseid: 1 }, function (err, anresult) {
                if (err) return console.error(err);
                
                var exerciseIDs = [];
                
                for (var index in anresult) exerciseIDs.push(anresult[index].exerciseid);
                
                ExerciseModel.find({ _id: { $in: exerciseIDs } }, function (err, exresult) {
                    if (err) return console.error(err);
                    
                    res.status(200).json(exresult);
                })
            })
            break;
        case 'unsolved':
            AnswerModel.find({ userid: req.user._id }, { exerciseid: 1 }, function (err, anresult) {
                if (err) return console.error(err);
                
                var exerciseIDs = [];
                
                for (var index in anresult) exerciseIDs.push(anresult[index].exerciseid);
                
                ExerciseModel.find({ _id: { $nin: exerciseIDs }, course: req.user.course }, function (err, exresult) {
                    if (err) return console.error(err);
                    
                    res.status(200).json(exresult);
                })
            })
            break;
        default:
            ExerciseModel.find({ _id: exerciseID, course: req.user.course }).lean().exec(function (err, result) {
                if (err) return console.error(err);
                
                res.status(200).json(result);
            })
            break;
    }
});

router.get('/answers', isLoggedIn, function (req, res) {
    if (req.query.display == "summary") {
        AnswerModel.aggregate(
            [
                { "$match": { "userid": mongoose.Types.ObjectId(req.user._id) } },
                {
                    $group: {
                        "_id": {
                            "exerciseid": "$exerciseid",
                            "exercisetitle": "$title",
                            "created": "$created",
                            "revised": "$revised"
                        },
                        "answers": { $push: "$answers" }
                    }
                },
                { $unwind: "$answers" },
                { $unwind: "$answers" },
                {
                    $group: {
                        "_id": {
                            "exerciseid": "$_id.exerciseid",
                            "exercisetitle": "$_id.exercisetitle",
                            "created": "$_id.created",
                            "revised": "$_id.revised"
                        },
                        "weight": { $sum: "$answers.weight" },
                        "received": { $sum: "$answers.received" }
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
        AnswerModel.find({ userid: req.user._id }).lean().exec(function (err, result) {
            if (err) return console.error(err);
            
            res.status(200).json(result);
        })
    }
});

router.get('/answers/:answerID', isLoggedIn, function (req, res) {
    var answerID = req.params.answerID;
    switch (answerID) {
        case "revised":
            AnswerModel.find({ userid: req.user._id, revised: true }).lean().exec(function (err, result) {
                if (err) return console.error(err);
                
                res.status(200).json(result);
            });
            break;
        default:
            AnswerModel.find({ _id: answerID, userid: req.user._id }).lean().exec(function (err, result) {
                if (err) return console.error(err);
                
                res.status(200).json(result);
            });
            break;
    }
});



//POST

router.post('/answer', isLoggedIn, function (req, res) {
    var exerciseID = req.body.exerciseid;
    
    AnswerModel.findOne({ userid: req.user._id, exerciseid: exerciseID }).lean().exec(function (err, anresult) {
        if (err) return console.error(err);
        if (!anresult) {
            //CREATE ANSWER
            ExerciseModel.findOne({ _id: exerciseID, course: req.user.course }).lean().exec(function (err, result) {
                if (err) return console.error(err);
                if (!result) return res.status(400).send("Not an eligible exercise ID");
                
                var answer = req.body;
                var newanswer = new AnswerModel();
                
                if (!answer.answers) return res.status(400).send("There were no answers given.");
                
                var ded = result.deadline;
                console.log(ded.setYear(new Date().getYear()));
                console.log(ded);
                
                if (result.deadline) if (new Date().toISOString() > result.deadline.toISOString()) return res.status(400).send("Deadline is already over.");
                if (result.revealdate) if (new Date().toISOString() < result.revealdate.toISOString()) return res.status(400).send("Not an eligible exercise ID");
                
                newanswer.userid = req.user._id;
                newanswer.exerciseid = exerciseID;
                newanswer.title = result.title;
                newanswer.extra = result.extra;
                newanswer.classification = result.classification;
                newanswer.course = result.course;
                newanswer.created = new Date().toISOString();
                for (var answerIndex in answer.answers) {
                    if (!questionExists(answer.answers[answerIndex], result.questions)) {
                        return res.status(400).send("There was a problem processing answer with questionid: " + answer.answers[answerIndex].questionid);
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
                if (newanswer.answers.length != result.questions.length) return res.status(400).send("There were some questions missing.");
                
                newanswer.save(function (err) {
                    var response = errhandler(err);
                    if (response != "ok") return res.status(400).send(response);
                    return res.sendStatus(201);
                });
            })
        //CREATE ANSWER END
        }
        else {
            //EDIT ANSWER
            AnswerModel.findOne({ userid: req.user._id, exerciseid: exerciseID }).lean().exec(function (err, result) {
                if (err) return console.error(err);
                if (!result) return res.status(400).send("Not an eligible exercise ID");
                
                if (result.deadline) if (new Date().toISOString() > result.deadline.toISOString()) return res.status(400).send("Deadline is already over.");
                if (result.revealdate) if (new Date().toISOString() < result.revealdate.toISOString()) return res.status(400).send("Not an eligible exercise ID");
                
                var editedanswer = result.answers;
                var newanswerlist = req.body.answers;
                
                for (var i in newanswerlist) {
                    for (var x in editedanswer) {
                        if (newanswerlist[i].questiontitle == editedanswer[x].questiontitle) {
                            editedanswer[x].result = newanswerlist[i].result;
                            editedanswer[x].choices = newanswerlist[i].choices;
                        }
                    }
                }
                
                AnswerModel.findOneAndUpdate({ userid: req.user._id, exerciseid: exerciseID }, { $set: { answers: editedanswer } }, { upsert: false }, function (err) {
                    var response = errhandler(err);
                    if (response != "ok") return res.status(400).send(response);
                    res.sendStatus(200);
                });
            });
            //EDIT ANSWER END
        }
    })
});

router.post("/edit", isLoggedIn, function (req, res) {
    UserModel.findById(req.user._id).lean().exec(function (err, result) {
        if (err) return console.error(err);
        
        var newuser = new UserModel(result);
        
        for (var field in req.body) newuser[field] = req.body[field];
        
        delete newuser._id;
        delete newuser.admin; //prevent user from editing random/protected information, everything else is allowed.
        delete newuser.status;
        delete newuser.class;
        
        newuser.password = createhash(password);
        
        delete newuser.registerdate;
        delete newuser.lastseen;
        delete newuser.__v;
        
        UserModel.update({ _id: req.user._id }, { $set: newuser }, { runValidators: true }, function (err) {
            var response = errhandler(err);
            if (response != "ok") return res.status(400).send(response);
            res.sendStatus(201);
        });
    });
});

var createHash = function (password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

module.exports = router;