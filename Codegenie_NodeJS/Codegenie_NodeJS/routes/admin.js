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

router.get('/exercises', isAdmin, function (req, res) {
    ExerciseModel.find(function (err, result) {
        if (err) return console.error(err);
        
        res.status(200).json(result);
    })
});

//USER POST

router.post("/user", isAdmin, function (req, res) {
    var newuser = new UserModel(req.body);
    
    newuser.lastseen = moment().format("DD/MM/YYYY HH:MM:SS");
    newuser.admin = true;
    
    newuser.save(function (err) {
        var response = errhandler(err);
        if (response != "ok") return res.status(500).send(response);
        res.sendStatus(201);
    });
});

//EXERCISES GET

router.get('/user/:userID', isAdmin, function (req, res) {
    var userID = req.params.userID;
    
    UserModel.findById(userID, { password: 0 }, function (err, result) {
        if (err) return console.error(err);
        
        res.status(200).json(result);
    })
});


//EXERCISES GET

router.get('/exercises/:exerciseID', isAdmin, function (req, res) {
    var exerciseID = req.params.exerciseID;
    
    ExerciseModel.findById(exerciseID, function (err, result) {
        if (err) return console.error(err);
        
        res.status(200).json(result);
    })
});

router.get('/exercises/:exerciseID/answers', isAdmin, function (req, res) {
    var exerciseID = req.params.exerciseID;
    
    AnswerModel.find({ exerciseid: exerciseID }, function (err, result) {
        if (err) return console.error(err);
        
        res.status(200).json(result);
    })
});

//EXERCISES POST

router.post("/exercises/post", isAdmin, function (req, res) {
    var newexercise = new ExerciseModel(req.body);
    
    newexercise.save(function (err) {
        var response = errhandler(err);
        if (response != "ok") return res.status(500).send(response);
        res.sendStatus(201);
    });
});

router.post("/exercises/edit/:exerciseID", isAdmin, function (req, res) {
    var exerciseID = req.params.exerciseID;
    
    ExerciseModel.findOne({ _id: exerciseID }, function (err, result) {
        if (err) return console.error(err);
        
        var newexercise = new ExerciseModel(result);
        
        for (var field in req.body) newexercise[field] = req.body[field];
        
        ExerciseModel.update({ _id: exerciseID }, newexercise, { runValidators: true }, function (err) {
            var response = errhandler(err);
            if (response != "ok") return res.status(500).send(response);
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
    
    AnswerModel.find({ _id: answerID }, function (err, result) {
        if (err) return console.error(err);
        
        res.status(200).json(result);
    })
});

//ANSWERS EDIT

router.post("/answers/edit/:answerID", isAdmin, function (req, res) {
    var answerID = req.params.answerID;
    
    AnswerModel.findOne({ _id: answerID }, function (err, result) {
        if (err) return console.error(err);
        
        var newanswer = new AnswerModel(result);
        
        for (var field in req.body) newanswer[field] = req.body[field];
        
        AnswerModel.update({ _id: answerID }, { $set: newanswer }, { runValidators: true }, function (err) {
            var response = errhandler(err);
            if (response != "ok") return res.status(500).send(response);
            res.sendStatus(201);
        });
    });
});

module.exports = router;