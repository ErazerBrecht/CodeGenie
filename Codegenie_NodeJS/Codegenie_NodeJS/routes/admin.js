var schemas = require('../mongoose/schemas');
var bodyParser = require('body-parser');
var express = require('express');
var mongoose = require('mongoose');
var auth = require('../passport/authlevels');
var router = express.Router();

var UserModel = schemas.UserModel;
var ExerciseModel = schemas.ExerciseModel;
var AnswerModel = schemas.AnswerModel;

var errhandler = schemas.errhandler;
var answerExists = schemas.answerExists;

var isAdmin = auth.isAdmin;


router.get('/', isAdmin, function (req, res) {
    res.render('adminpanel', { title: 'CodeGenie' });
});

//USERS GET

router.get('/users/:userID', isAdmin, function (req, res) {
    var userID = req.params.userID;
    
    UserModel.findById(userID, { password: 0 }).lean().exec(function (err, result) {
        if (err) return console.error(err);
        
        res.status(200).json(result);
    })
});

router.get('/users/:userID/answers', isAdmin, function (req, res) {
    var userID = req.params.userID;
    
    if (req.query.display == "summary") {
        AnswerModel.aggregate(
            [
                { "$match": { "userid": mongoose.Types.ObjectId(userID) } },
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
        AnswerModel.find({ userid: userID }).lean().exec(function (err, result) {
            if (err) return console.error(err);
            
            res.status(200).json(result);
        })
    }
});

//USER POST (MAINLY FOR MAKING ADMIN ACCOUNTS)

router.post("/users", isAdmin, function (req, res) {
    var newuser = new UserModel(req.body);
    
    newuser.save(function (err) {
        var response = errhandler(err);
        if (response != "ok") return res.status(400).send(response);
        res.sendStatus(201);
    });
});

router.post("/users/assign", isAdmin, function (req, res) {
    var userlist = [];
    for (var index in req.body.users) userlist.push({ "id": req.body.users[index], "class": req.body.class });
    
    var promises = userlist.map(function (usobj) {
        return new Promise(function (resolve, reject) {
            UserModel.findOne({ _id: usobj.id }, { $set: { status: 1, class: usobj.class } }, function (err, anresult) {
                if (err) return reject(err);
                resolve();
            });
        });
    });
    
    Promise.all(promises).then(function () { res.sendStatus(200); }).catch(console.error);
});



//EXERCISES GET

router.get('/exercises', isAdmin, function (req, res) {
    ExerciseModel.find().lean().exec(function (err, result) {
        if (err) return console.error(err);
        for (var index in result) {
            if (result[index].revealdate && new Date().toISOString() < result[index].revealdate) result[index].revealed = false;
            else result[index].revealed = true;
        };
        
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
    
    AnswerModel.find({ exerciseid: exerciseID }).lean().exec(function (err, result) {
        if (err) return console.error(err);
        
        res.status(200).json(result);
    })
});

router.get("/exercises/delete/:exerciseID", isAdmin, function (req, res) {
    var exerciseID = req.params.exerciseID;
    
    ExerciseModel.remove({ _id: exerciseID }, function (err) {
        if (err) return res.status(400).send("Exercise doesn't exist.");
        
        res.sendStatus(200);
    });
});

//EXERCISES POST

router.post("/exercises/post", isAdmin, function (req, res) {
    var newexercise = new ExerciseModel(req.body);
    
    if (!req.body.hasOwnProperty("questions") || req.body.questions.length == 0) return res.status(400).send("No questions were sent. Please make at least one question!");
    
    newexercise.deadline.setHours(23);
    newexercise.deadline.setMinutes(59);
    newexercise.deadline.setSeconds(59);
    
    newexercise.save(function (err) {
        var response = errhandler(err);
        if (response != "ok") return res.status(400).send(response);
        res.sendStatus(201);
    });
});

router.post("/exercises/edit/:exerciseID", isAdmin, function (req, res) {
    var exerciseID = req.params.exerciseID;
    
    
    ExerciseModel.findOne({ _id: exerciseID }).lean().exec(function (err, result) {
        if (err) return res.status(400).send("Exercise doesn't exist.");
        
        var newexercise = new ExerciseModel(result);
        
        for (var field in req.body) newexercise[field] = req.body[field];
        
        newexercise.deadline.setHours(23);
        newexercise.deadline.setMinutes(59);
        newexercise.deadline.setSeconds(59);
        
        ExerciseModel.update({ _id: exerciseID }, newexercise, { runValidators: true }, function (err) {
            var response = errhandler(err);
            if (response != "ok") return res.status(400).send(response);
            res.sendStatus(201);
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
            AnswerModel.find({ revised: true }).lean().exec(function (err, result) {
                if (err) return console.error(err);
                
                res.status(200).json(result);
            })
            break;
        case 'unrevised':
            AnswerModel.find({ revised: false }).lean().exec(function (err, result) {
                if (err) return console.error(err);
                
                res.status(200).json(result);
            })
            break;
        default:
            AnswerModel.find({ _id: answerID }).lean().exec(function (err, result) {
                if (err) return console.error(err);
                
                res.status(200).json(result);
            })
            break;
    }
});

router.get("/answers/delete/:answerID", isAdmin, function (req, res) {
    var answerID = req.params.answerID;
    
    AnswerModel.remove({ _id: answerID }, function (err) {
        if (err) return console.error(err);
        
        res.sendStatus(200);
    });
});

//ANSWERS POST

router.post("/answers/edit/:answerID", isAdmin, function (req, res) {
    var answerID = req.params.answerID;
    
    AnswerModel.findOne({ _id: answerID }).lean().exec(function (err, result) {
        if (err) return console.error(err);
        
        if (result.deadline) {
            if (new Date(new Date().toISOString()).getTime() < new Date(result.deadline).getTime()) return res.status(200).send("Deadline is already over.");
        }
        
        var newanswer = new AnswerModel(result);
        
        for (var field in req.body) newanswer[field] = req.body[field];
        
        AnswerModel.update({ _id: answerID }, { $set: newanswer }, { runValidators: true }, function (err) {
            var response = errhandler(err);
            if (response != "ok") return res.status(400).send(response);
            res.sendStatus(201);
        });
    });
});

module.exports = router;