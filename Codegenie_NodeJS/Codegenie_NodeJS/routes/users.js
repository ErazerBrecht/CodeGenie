var schemas = require('../mongoose/schemas');
var bodyParser = require('body-parser');
var express = require('express');
var auth = require('../passport/authlevels');
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
    UserModel.find({}, { password: 0 }, function (err, result) {
        if (err) return console.error(err);
        
        for (var user in result) result[user]["password"] = undefined;
        
        res.status(200).json(result);
    })
});

router.get('/mine', isLoggedIn, function (req, res) {
    UserModel.findById(req.user._id, { password: 0 }, function (err, result) {
        if (err) return console.error(err);
        
        res.status(200).json(result);
    })
});

router.get('/exercises', isLoggedIn, function (req, res) {
    ExerciseModel.find({ class: req.user.class }, function (err, result) {
        if (err) return console.error(err);
        
        res.status(200).json(result);
    })
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
                
                ExerciseModel.find({ _id: { $nin: exerciseIDs }, class: req.user.class }, function (err, exresult) {
                    if (err) return console.error(err);
                    
                    res.status(200).json(exresult);
                })
            })
            break;
        default:
            ExerciseModel.find({ _id: exerciseID, class: req.user.class }, function (err, result) {
                if (err) return console.error(err);
                
                res.status(200).json(result);
            })
            break;
    }
});

router.get('/answers', isLoggedIn, function (req, res) {
    AnswerModel.find({ userid: req.user._id }, function (err, result) {
        if (err) return console.error(err);
        
        res.status(200).json(result);
    })
});

router.get('/answers/:answerID', isLoggedIn, function (req, res) {
    var answerID = req.params.answerID;
    
    AnswerModel.find({ _id: answerID, userid: req.user._id }, function (err, result) {
        if (err) return console.error(err);
        
        res.status(200).json(result);
    })
});



//POST

router.post('/answer', isLoggedIn, function (req, res) {
    var exerciseID = req.body.exerciseid;
    var answer = req.body;
    var newanswer = new AnswerModel;
    
    ExerciseModel.findOne({ _id: exerciseID, class: req.user.class }, function (err, result) {
        if (err) return console.error(err);
        if (!result) return res.status(500).send("Not an eligible exercise ID");
        if (!answer.answers) return res.status(500).send("There were no answers given.");
        
        if (result.deadline) {
            if (new Date(moment().format("DD/MM/YYYY")).getTime() > new Date(result.deadline).getTime()) return res.status(200).send("Deadline is already over.");
        }
        
        newanswer.userid = req.user._id;
        newanswer.exerciseid = exerciseID;
        newanswer.title = result.title;
        newanswer.extra = result.extra;
        newanswer.classification = result.classification;
        newanswer.class = result.classification;
        newanswer.created = moment().format("DD/MM/YYYY");
        
        for (var answerIndex in answer.answers) {
            if (!questionExists(answer.answers[answerIndex], result.questions)) {
                return res.status(500).send("There was a problem processing answer with questionid: " + an.questionid);
            }
            for (var questionIndex in result.questions) {
                var an = answer.answers[answerIndex];
                var qu = result.questions[questionIndex];
                if (an.questionid == qu._id) {
                    an.received = 0;
                    an.title = qu.title;
                    an.type = qu.type;
                    an.weight = qu.weight;
                    an.extra = qu.extra;
                    newanswer.answers.push(an);
                }
            }
        }
        
        //TODO: check if questionids that were posted are actually unique
        if (newanswer.answers.length != result.questions.length) return res.status(500).send("There were some questions missing.");
        
        console.log(newanswer.answers);
        
        newanswer.save(function (err) {
            var response = errhandler(err);
            if (response != "ok") return res.status(500).send(response);
            return res.sendStatus(201);
        });
    })
});

router.post("/edit", isLoggedIn, function (req, res) {
    UserModel.findById(req.user._id, function (err, result) {
        if (err) return console.error(err);
        
        var newuser = new UserModel(result);
        
        for (var field in req.body) newuser[field] = req.body[field];
        
        newuser._id = undefined;
        newuser.admin = undefined; //prevent user from editing random/protected information, everything else is allowed.
        newuser.password = undefined;
        newuser.status = undefined;
        
        newuser.registerdate = undefined;
        newuser.lastseen = undefined;
        newuser.__v = undefined;
        
        UserModel.update({ _id: req.user._id }, { $set: newuser }, { runValidators: true }, function (err) {
            var response = errhandler(err);
            if (response != "ok") return res.status(500).send(response);
            res.sendStatus(201);
        });
    });
});

module.exports = router;