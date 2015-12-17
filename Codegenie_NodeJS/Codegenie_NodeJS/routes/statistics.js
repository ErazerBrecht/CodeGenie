﻿var schemas = require('../mongoose/schemas');
var bodyParser = require('body-parser');
var express = require('express');
var mongoose = require('mongoose');
var auth = require('../passport/authlevels');
var router = express.Router();
var moment = require('moment');

var UserModel = schemas.UserModel;
var ExerciseModel = schemas.ExerciseModel;
var AnswerModel = schemas.AnswerModel;

var savehandler = schemas.savehandler;

var isLoggedIn = auth.isLoggedIn;


router.get('/', isLoggedIn, function (req, res) {
    var response = { users: 0, admins: 0, exercises: 0, answers: 0, classes: [] };
    
    ExerciseModel.count(function (err, c) {
        response.exercises = c;
        
        AnswerModel.count(function (err, c) {
            response.answers = c;
            
            UserModel.count(function (err, c) {
                response.users = c;
                
                UserModel.count({ admin: true }, function (err, c) {
                    response.admins = c;
                    
                    UserModel.find({}, { class: 1 }).lean().exec(function (err, result) {
                        var ar = countclasses(result);
                        for (var index in ar[0]) response.classes.push({ class: ar[0][index], count: ar[1][index] });
                        
                        res.status(200).json(response);
                    });
                });
            });
        });
    });
});

router.get('/graph', isLoggedIn, function (req, res) {
    var filter = req.query.filter;
    
    AnswerModel.aggregate(
        [
            {
                $group: {
                    "_id": {
                        "year": { $year: "$created" },
                        "week": { $week: "$created" }
                    },
                    "revised": { $push: "$revised" }
                }
            },
            { $unwind: "$revised" },
            {
                $group: {
                    "_id": { $cond: [{ $eq: [filter, "year"] }, "$_id.year", "$_id.week"] },
                    "count": { $sum: 1 }
                }
            },
            {
                $project: {
                    "_id": 0,
                    "count": "$count",
                    "filter": "$_id"
                }
            }
        ],
        function (err, aggresult) {
            if (err) console.error(err);
            else {
                res.status(200).json(aggresult);
            }
        });
});

router.get('/users/:userID', isLoggedIn, function (req, res) {
    var userID = req.params.userID;
    
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
});

router.get('/exercises', isLoggedIn, function (req, res) {
    var response = { count: 0, courses: [] };
    
    ExerciseModel.count(function (err, c) {
        response.count = c;
        
        ExerciseModel.find({}, { course: 1 }).lean().exec(function (err, result) {
            var ar = countcourses(result);
            for (var index in ar[0]) response.courses.push({ course: ar[0][index], count: ar[1][index] });
            
            res.status(200).json(response);
        });
    });
});

router.get('/exercises/graph/:exerciseID', isLoggedIn, function (req, res) {
    var exerciseID = req.params.exerciseID;
    var filter = req.query.filter;
    
    AnswerModel.aggregate(
        [
            { "$match": { "exerciseid": mongoose.Types.ObjectId(exerciseID) } },
            {
                $group: {
                    "_id": {
                        "year": { $year: "$created" },
                        "week": { $week: "$created" },
                        "revised": { $cond: [{ $eq: ['$revised', true] }, 1, 0] },
                        "unrevised": { $cond: [{ $eq: ['$revised', false] }, 1, 0] },
                    },
                    "revised": { $push: "$revised" }
                }
            },
            { $unwind: "$revised" },
            {
                $group: {
                    "_id": { $cond: [{ $eq: [filter, "year"] }, "$_id.year", "$_id.week"] },
                    "count": { $sum: 1 },
                    "revised": { $sum: "$_id.revised" },
                    "unrevised": { $sum: "$_id.unrevised" }
                }
            },
            {
                $project: {
                    "_id": 0,
                    "count": "$count",
                    "filter": "$_id",
                    "revised": "$revised",
                    "unrevised": "$unrevised"
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
});

router.get('/exercises/average/:exerciseID', isLoggedIn, function (req, res) {
    var exerciseID = req.params.exerciseID;
    var response = {
        count: 0,
        title: "",
        classification: "",
        course: "",
        weight: 0,
        received: 0,
        extra: false,
        questions: [{
                questiontitle: "",
                weight: 0,
                extra: false,
                type: "",
                average: 0
            }]
    };
    
    AnswerModel.findOne({ exerciseid: exerciseID, revised: true }).lean().exec(function (err, result) {
        if (!result) return res.status(200).json([]);
        response.count = result.length;
        
        response.title = result.title;
        response.classification = result.classification;
        response.course = result.course;
        response.weight = result.weight;
        response.received = result.received;
        response.extra = result.extra;
        
        var final = [];
        var questiontemplate = result.answers;
        for (var i = 0; i < questiontemplate.length; i++) {
            var obj = questiontemplate[i];
            if (!final.hasOwnProperty(obj)) {
                var filtered = { questiontitle: "", extra: false, type: "", weight: 0, average: 0 };
                
                filtered.questiontitle = obj.questiontitle;
                filtered.extra = obj.extra;
                filtered.type = obj.type;
                filtered.weight = obj.weight;
                
                final.push(filtered);
            }
        }
        
        AnswerModel.aggregate(
            [
                { "$match": { "exerciseid": mongoose.Types.ObjectId(exerciseID), "revised": true } },
                {
                    $group: {
                        "_id": "$exerciseid",
                        "answers": { $push: "$answers" }
                    }
                },
                { $unwind: "$answers" },
                { $unwind: "$answers" },
                {
                    $group: {
                        "_id": "$answers.questiontitle",
                        "received": { $avg: "$answers.received" },
                        "feedback": { $avg: "$answers.feedback" }
                    }
                },
                {
                    $group: {
                        "_id": "$_id",
                        "received": { $avg: "$received" },
                        "feedback": { $avg: "$feedback" }
                    }
                }
            ],
            function (err, aggresult) {
                if (err) console.error(err);
                else {
                    for (var i = 0; i < aggresult.length; i++) {
                        for (var x = 0; x < final.length; x++) {
                            var aggobj = aggresult[i];
                            if (aggobj._id == final[x].questiontitle) {
                                final[x].received = aggobj.received;
                                final[x].feedback = aggobj.feedback;
                            }
                        }
                    }
                    
                    response.questions = final;
                    
                    res.status(200).json(response);
                }
            }
        );
    });
});

router.get('/answers', isLoggedIn, function (req, res) {
    var response = { count: 0, courses: [] };
    
    AnswerModel.count(function (err, c) {
        response.count = c;
        
        AnswerModel.find({}, { course: 1 }).lean().exec(function (err, result) {
            var ar = countcourses(result);
            for (var index in ar[0]) response.courses.push({ course: ar[0][index], count: ar[1][index] });
            
            res.status(200).json(response);
        });
    });
});

router.get('/answers/revised', isLoggedIn, function (req, res) {
    var response = { count: 0, courses: [] };
    
    AnswerModel.count({ revised: true }, function (err, c) {
        response.count = c;
        
        AnswerModel.find({ revised: true }, { course: 1 }).lean().exec(function (err, result) {
            var ar = countcourses(result);
            for (var index in ar[0]) response.courses.push({ course: ar[0][index], count: ar[1][index] });
            
            res.status(200).json(response);
        });
    });
});

router.get('/answers/unrevised', isLoggedIn, function (req, res) {
    var response = { count: 0, courses: [] };
    
    AnswerModel.count({ revised: false }, function (err, c) {
        response.count = c;
        
        AnswerModel.find({ revised: false }, { course: 1 }).lean().exec(function (err, result) {
            var ar = countcourses(result);
            for (var index in ar[0]) response.courses.push({ course: ar[0][index], count: ar[1][index] });
            
            res.status(200).json(response);
        });
    });
});

function countcourses(arr) {
    var a = [], b = [];
    
    for (i = 0; i < arr.length; i++) {
        var obj = arr[i].course;
        if (a.indexOf(obj) == -1) {
            a.push(obj);
            b.push(1);
        }
        else b[a.indexOf(obj)] += 1;
    }
    
    return [a, b];
}

function countclasses(arr) {
    var a = [], b = [];
    
    for (i = 0; i < arr.length; i++) {
        var obj = arr[i].class;
        if (a.indexOf(obj) == -1) {
            a.push(obj);
            b.push(1);
        }
        else b[a.indexOf(obj)] += 1;
    }
    
    return [a, b];
}

module.exports = router;