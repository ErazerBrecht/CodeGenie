var schemas = require('../mongoose/schemas');
var bodyParser = require('body-parser');
var express = require('express');
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

router.get('/user/:userID', isAdmin, function (req, res) {
    var userID = req.params.userID;
    
    UserModel.findById(userID, { password: 0 }).lean().exec(function (err, result) {
        if (err) return console.error(err);
        
        res.status(200).json(result);
    })
});

router.get('/user/:userID/answers', isAdmin, function (req, res) {
    var userID = req.params.userID;

    AnswerModel.find({ userid: userID }).lean().exec(function (err, result) {
        if (err) return console.error(err);

        res.status(200).json(result);
    })
});

//USER POST (MAINLY FOR MAKING ADMIN ACCOUNTS)

router.post("/user", isAdmin, function (req, res) {
    var newuser = new UserModel(req.body);
    
    newuser.save(function (err) {
        var response = errhandler(err);
        if (response != "ok") return res.status(400).send(response);
        res.sendStatus(201);
    });
});



//EXERCISES GET

router.get('/exercises', isAdmin, function (req, res) {
    ExerciseModel.find(function (err, result) {
        if (err) return console.error(err);
        
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

    if (req.body.questions.length == 0) return res.status(400).send("No questions were given.");

    newexercise.save(function (err) {
        var response = errhandler(err);
        if (response != "ok") return res.status(400).send(response);
        res.sendStatus(201);
    });
});

router.post("/exercises/edit/:exerciseID", isAdmin, function (req, res) {
    var exerciseID = req.params.exerciseID;


    ExerciseModel.findOne({ _id: exerciseID }).lean().exec(function (err, result) {
        if (err)
            return res.status(400).send("Exercise doesn't exist.");
        
        var newexercise = new ExerciseModel(result);
        
        for (var field in req.body) newexercise[field] = req.body[field];
        
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