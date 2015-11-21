var schemas = require('../mongoose/schemas');
var bodyParser = require('body-parser');
var express = require('express');
var auth = require('../passport/authlevels');
var router = express.Router();

var UserModel = schemas.UserModel;
var ExerciseModel = schemas.ExerciseModel;
var AnswerModel = schemas.AnswerModel;

var errhandler = schemas.errhandler;

var isLoggedIn = auth.isLoggedIn;


router.get('/', isLoggedIn, function (req, res) {
    var response = { users: 0, admins: 0, exercises: 0, answers: 0, classes: [] };
    
    //TODO: fix this godzilla of a query (why does it have to be async)
    ExerciseModel.count(function (err, c) {
        response.exercises = c;
        
        AnswerModel.count(function (err, c) {
            response.answers = c;
            
            UserModel.count(function (err, c) {
                response.users = c;
                
                UserModel.count({ admin: true }, function (err, c) {
                    response.admins = c;
                    
                    UserModel.find({}, { class: 1 }, function (err, result) {
                        var ar = countclasses(result);
                        for (var index in ar[0]) response.classes.push({ class: ar[0][index], count: ar[1][index] });
                        
                        res.status(200).json(response);
                    });
                });
            });
        });
    });
});

router.get('/exercises', isLoggedIn, function (req, res) {
    var response = { count: 0, classes: [] };
    
    ExerciseModel.count(function (err, c) {
        response.count = c;
        
        ExerciseModel.find({}, { class: 1 }, function (err, result) {
            var ar = countclasses(result);
            for (var index in ar[0]) response.classes.push({ class: ar[0][index], count: ar[1][index] });
            
            res.status(200).json(response);
        });
    });
});

router.get('/exercises/:exerciseID', isLoggedIn, function (req, res) {
    var exerciseID = req.params.exerciseID;
    var response = {
        count: 0, 
        title: "",
        classification: "",
        class: "",
        weight: 0,
        received: 0,
        extra: false,
        questions: [{
                questiontitle: "",
                weight: 0,
                extra: false,
                type: "",
                mean: 0
            }]
    };
    
    AnswerModel.find({ exerciseid: exerciseID/*, revised: true*/ }, function (err, result) {
        if (!result.length) return res.status(200).json([]);
        response.count = result.length;
        
        AnswerModel.aggregate(
            [
                {
                    "$group": {
                        "_id": "$_id",
                        "received": { $avg: "$received" },
                        "answers": { $push: "$list" }
                    }
                },
                { $unwind: "$list" },
                { $unwind: "$list" },
                {
                    "$group": {
                        "_id": { "name": "$_id", "value": "$list.questionid" },
                        "val": { $avg: "$received" },
                        "valAvg": { $avg: "$list.received" }
                    }
                },
                { "$sort": { "_id": 1 } },
                {
                    "$group": {
                        "_id": "$_id.name",
                        "received": { $avg: "$received" },
                        "answers": {
                            $push: {
                                "type": "$_id._id",
                                "value": "$valAvg"
                            }
                        }
                    }
                }
            ],
            function (err, results) {
                if (err) console.error(err);
                else console.log(results);
            }
        );
        
        res.status(200).json(response);
    });
});

router.get('/answers', isLoggedIn, function (req, res) {
    var response = { count: 0, classes: [] };
    
    AnswerModel.count(function (err, c) {
        AnswerModel.count = c;
        
        AnswerModel.find({}, { class: 1 }, function (err, result) {
            var ar = countclasses(result);
            for (var index in ar[0]) response.classes.push({ class: ar[0][index], count: ar[1][index] });
            
            res.status(200).json(response);
        });
    });
});


function countclasses(arr) {
    var a = [], b = [];
    
    for (i = 0; i < arr.length; i++) {
        var obj = arr[i].class;
        console.log(obj);
        if (a.indexOf(obj) == -1) {
            a.push(obj);
            b.push(1);
        }
        else b[a.indexOf(obj)] += 1;
    }
    
    return [a, b];
}

module.exports = router;