var schemas = require('../mongoose/schemas');
var express = require('express');
var mongoose = require('mongoose');
var auth = require('../passport/authlevels');
var router = express.Router();
var moment = require('moment');

var UserModel = schemas.UserModel;
var ExerciseModel = schemas.ExerciseModel;
var AnswerModel = schemas.AnswerModel;

var isLoggedIn = auth.isLoggedIn;


router.get('/', isLoggedIn, function (req, res) {
    var response = {users: 0, admins: 0, exercises: 0, answers: 0, classes: []};

    ExerciseModel.count(function (err, c) {
        response.exercises = c;

        AnswerModel.count(function (err, c) {
            response.answers = c;

            UserModel.count(function (err, c) {
                response.users = c;

                UserModel.count({admin: true}, function (err, c) {
                    response.admins = c;

                    UserModel.find({}, {class: 1}).lean().exec(function (err, result) {
                        var ar = countclasses(result);
                        for (var index in ar[0]) response.classes.push({class: ar[0][index], count: ar[1][index]});

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
                        "exerciseid": "$exerciseid",
                        "created": "$created",
                        "year": {$year: "$created"},
                        "week": {$week: "$created"}
                    },
                    "revised": {$push: "$revised"}
                }
            },
            {
                $sort: {"_id.created": -1}
            },
            {$unwind: "$revised"},
            {
                $group: {
                    "_id": {"filter": {$cond: [{$eq: [filter, "year"]}, "$_id.year", "$_id.week"]}},
                    "count": {$sum: 1}
                }
            },
            {
                $project: {
                    "_id": 0,
                    "count": "$count",
                    "filter": "$_id.filter"
                }
            }
        ],
        function (err, aggresult) {
            if (err) console.error(err);
            else {
                var response = [];
                if (aggresult.length != 0) {

                    var first = aggresult[0].filter;
                    var last = aggresult[aggresult.length - 1].filter;

                    do {
                        var found = false;
                        for (var x = 0; x < aggresult.length; x++) {
                            if (aggresult[x].filter == first) {
                                response.push({"x": first, "y": aggresult[x].count});
                                found = true;
                            }
                        }
                        if (!found) response.push({"x": first, "y": 0});

                        filter == "year" ? first += 1 : first = (first % 52) + 1;
                    } while (first != (filter == "year" ? last + 1 : (last % 52) + 1));
                }

                res.status(200).json(response);
            }
        });
});

router.get('/course/:course', isLoggedIn, function (req, res) {
    var course = req.params.course;
    var limit = parseInt(req.query.limit ? req.query.limit : 3);

    AnswerModel.aggregate(
        [
            {"$match": {"course": course, "revised": true}},
            {
                $group: {
                    "_id": "$userid",
                    "answers": {$push: "$answers"},
                }
            },
            {$unwind: "$answers"},
            {$unwind: "$answers"},
            {
                $group: {
                    "_id": "$_id",
                    "received": {$sum: "$answers.received"}
                }
            },
            {
                $project: {
                    "_id": 0,
                    "userid": "$_id",
                    "received": "$received"
                }
            },
            {
                $sort: {"received": -1}
            },
            {
                $limit: limit
            }
        ],
        function (err, aggresultTopReceived) {
            if (err) console.error(err);
            else {
                AnswerModel.aggregate(
                    [
                        {"$match": {"course": course}},
                        {
                            $group: {
                                "_id": { "userid": "$userid", "exerciseid": "$exerciseid" }
                            }
                        },
                        {
                            $group: {
                                "_id": "$_id.userid",
                                "count": {$sum: 1}
                            }
                        },
                        {
                            $project: {
                                "_id": 0,
                                "userid": "$_id",
                                "count": "$count"
                            }
                        },
                        {
                            $sort: {"count": -1}
                        },
                        {
                            $limit: limit
                        }
                    ],
                    function (err, aggresultTopAmount) {
                        if (err) console.error(err);
                        else {
                            console.log(aggresultTopAmount)
                            topReceived = [];
                            topAmount = [];

                            for (var x = 0; x <  aggresultTopReceived.length; x++)
                                topReceived.push({
                                    "userid":  aggresultTopReceived[x].userid,
                                    "index": x
                                })

                            for (var x = 0; x <  aggresultTopAmount.length; x++)
                                topAmount.push({
                                    "userid":  aggresultTopAmount[x].userid,
                                    "index": x
                                })

                            var promisesTopReceived = topReceived.map(function (obj) {
                                return new Promise(function (resolve, reject) {
                                    UserModel.findOne({_id: obj.userid}, {name: 1}, function (err, usresult) {
                                        if (err) return reject(err);
                                        if (usresult)  aggresultTopReceived[obj.index].name = usresult.name;
                                        resolve();
                                    });
                                });
                            });

                            var promisesTopAmount = topAmount.map(function (obj) {
                                return new Promise(function (resolve, reject) {
                                    UserModel.findOne({_id: obj.userid}, {name: 1}, function (err, usresult) {
                                        if (err) return reject(err);
                                        if (usresult)  aggresultTopAmount[obj.index].name = usresult.name;
                                        resolve();
                                    });
                                });
                            });

                            Promise.all(promisesTopReceived).then(function () {
                                Promise.all(promisesTopAmount).then(function () {
                                    res.status(200).json({"topReceived": aggresultTopReceived, "topAmount": aggresultTopAmount});
                                }).catch(console.error);
                            }).catch(console.error);
                        }
                    });
            }
        });
});

router.get('/users/mine', isLoggedIn, function (req, res) {
    var userID = req.user._id;
    var filter = req.query.filter;

    SendUserStatistic(userID, res, filter);
});

router.get('/users/:userID', isLoggedIn, function (req, res) {
    var userID = req.params.userID;
    var filter = req.query.filter;

    SendUserStatistic(userID, res, filter);
});

router.get('/exercises', isLoggedIn, function (req, res) {
    var response = {count: 0, courses: []};

    ExerciseModel.count(function (err, c) {
        response.count = c;

        ExerciseModel.find({}, {course: 1}).lean().exec(function (err, result) {
            var ar = countcourses(result);
            for (var index in ar[0]) response.courses.push({course: ar[0][index], count: ar[1][index]});

            res.status(200).json(response);
        });
    });
});

router.get('/exercises/:exerciseID/graph', isLoggedIn, function (req, res) {
    var exerciseID = req.params.exerciseID;
    var filter = req.query.filter;

    AnswerModel.aggregate(
        [
            {"$match": {"exerciseid": mongoose.Types.ObjectId(exerciseID)}},
            {
                $group: {
                    "_id": {
                        "exerciseid": "$exerciseid",
                        "created": "$created",
                        "year": {$year: "$created"},
                        "week": {$week: "$created"},
                        "revised": {$cond: [{$eq: ['$revised', true]}, 1, 0]},
                        "unrevised": {$cond: [{$eq: ['$revised', false]}, 1, 0]}
                    },
                    "revised": {$push: "$revised"}
                }
            },
            {
                $sort: {"_id.created": -1}
            },
            {$unwind: "$revised"},
            {
                $group: {
                    "_id": {$cond: [{$eq: [filter, "year"]}, "$_id.year", "$_id.week"]},
                    "count": {$sum: 1},
                    "revised": {$sum: "$_id.revised"},
                    "unrevised": {$sum: "$_id.unrevised"}
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
                var responseCount = [];
                var responseRevised = [];
                var responseUnrevised = [];

                if (aggresult.length != 0) {

                    var first = aggresult[0].filter;
                    var last = aggresult[aggresult.length - 1].filter;

                    do {
                        var found = false;
                        for (var x = 0; x < aggresult.length; x++) {
                            if (aggresult[x].filter == first) {
                                responseCount.push({"x": first, "y": aggresult[x].count});
                                responseRevised.push({"x": first, "y": aggresult[x].revised});
                                responseUnrevised.push({"x": first, "y": aggresult[x].unrevised});
                                found = true;
                            }
                        }
                        if (!found) {
                            responseCount.push({"x": first, "y": 0});
                            responseRevised.push({"x": first, "y": 0});
                            responseUnrevised.push({"x": first, "y": 0});
                        }

                        filter == "year" ? first += 1 : first = (first % 52) + 1;
                    } while (first != (filter == "year" ? last + 1 : (last % 52) + 1));
                }

                res.status(200).json({
                    "total": responseCount,
                    "revised": responseRevised,
                    "unrevised": responseUnrevised
                });
            }
        }
    );
});

router.get('/exercises/:exerciseID/average', isLoggedIn, function (req, res) {
    var exerciseID = req.params.exerciseID;
    var limit = parseInt(req.query.limit ? req.query.limit : 3);
    var response = {
        count: 0,
        title: "",
        classification: "",
        course: "",
        extra: false,
        top: [],
        questions: [{
            questiontitle: "",
            weight: 0,
            extra: false,
            type: "",
            average: 0,
            feedback: 0
        }]
    };

    AnswerModel.find({exerciseid: exerciseID, revised: true}).lean().exec(function (err, result) {
        if (!result.length) return res.status(200).json([]);
        response.count = result.length;

        response.title = result[0].title;
        response.classification = result[0].classification;
        response.course = result[0].course;
        response.extra = result[0].extra;

        var final = [];
        var questiontemplate = result[0].answers;
        for (var i = 0; i < questiontemplate.length; i++) {
            var obj = questiontemplate[i];
            if (!final.hasOwnProperty(obj)) {
                var filtered = {questiontitle: "", extra: false, type: "", weight: 0, average: 0, feedback: 0};

                filtered.questiontitle = obj.questiontitle;
                filtered.extra = obj.extra;
                filtered.type = obj.type;
                filtered.weight = obj.weight;

                final.push(filtered);
            }
        }

        AnswerModel.aggregate(
            [
                {"$match": {"exerciseid": mongoose.Types.ObjectId(exerciseID), "revised": true}},
                {
                    $group: {
                        "_id": "$exerciseid",
                        "answers": {$push: "$answers"}
                    }
                },
                {$unwind: "$answers"},
                {$unwind: "$answers"},
                {
                    $group: {
                        "_id": "$answers.questiontitle",
                        "received": {$avg: "$answers.received"},
                        "feedback": {$avg: "$answers.feedback"}
                    }
                },
                {
                    $group: {
                        "_id": "$_id",
                        "average": {$avg: "$received"},
                        "feedback": {$avg: "$feedback"}
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
                                final[x].average = aggobj.average;
                                final[x].feedback = aggobj.feedback;
                            }
                        }
                    }

                    response.questions = final;

                    AnswerModel.aggregate(
                        [
                            {"$match": {"exerciseid": mongoose.Types.ObjectId(exerciseID), "revised": true}},
                            {
                                $group: {
                                    "_id": "$userid",
                                    "answers": {$push: "$answers"},
                                }
                            },
                            {$unwind: "$answers"},
                            {$unwind: "$answers"},
                            {
                                $group: {
                                    "_id": "$_id",
                                    "received": {$sum: "$answers.received"}
                                }
                            },
                            {
                                $project: {
                                    "_id": 0,
                                    "userid": "$_id",
                                    "received": "$received"
                                }
                            },
                            {
                                $sort: {"received": -1}
                            },
                            {
                                $limit: limit
                            }
                        ],
                        function (err, aggresultTop) {
                            if (err) console.error(err);
                            else {
                                topUsers = [];

                                for (var x = 0; x < aggresultTop.length; x++)
                                    topUsers.push({
                                        "userid": aggresultTop[x].userid,
                                        "received": aggresultTop[x].received,
                                        "index": x
                                    })

                                var promises = topUsers.map(function (obj) {
                                    return new Promise(function (resolve, reject) {
                                        UserModel.findOne({_id: obj.userid}, {name: 1}, function (err, usresult) {
                                            if (err) return reject(err);
                                            if (usresult) aggresultTop[obj.index].name = usresult.name;
                                            resolve();
                                        });
                                    });
                                });

                                Promise.all(promises).then(function () {
                                    response.top = aggresultTop;

                                    res.status(200).json(response);
                                }).catch(console.error);
                            }
                        });
                }
            }
        );
    });
});

router.get('/answers', isLoggedIn, function (req, res) {
    var response = {count: 0, courses: []};

    AnswerModel.count(function (err, c) {
        response.count = c;

        AnswerModel.find({userid: req.user._id}).lean().exec(function (err, myAnswers) {
            response.myself = myAnswers.length;

            AnswerModel.find({}, {course: 1}).lean().exec(function (err, result) {
                var ar = countcourses(result);
                for (var index in ar[0]) response.courses.push({course: ar[0][index], count: ar[1][index]});

                res.status(200).json(response);
            });
        });
    });
});

router.get('/answers/revised', isLoggedIn, function (req, res) {
    var response = {count: 0, courses: []};

    AnswerModel.count({revised: true}, function (err, c) {
        response.count = c;

        AnswerModel.find({revised: true}, {course: 1}).lean().exec(function (err, result) {
            var ar = countcourses(result);
            for (var index in ar[0]) response.courses.push({course: ar[0][index], count: ar[1][index]});

            res.status(200).json(response);
        });
    });
});

router.get('/answers/unrevised', isLoggedIn, function (req, res) {
    var response = {count: 0, courses: []};

    AnswerModel.count({revised: false}, function (err, c) {
        response.count = c;

        AnswerModel.find({revised: false}, {course: 1}).lean().exec(function (err, result) {
            var ar = countcourses(result);
            for (var index in ar[0]) response.courses.push({course: ar[0][index], count: ar[1][index]});

            res.status(200).json(response);
        });
    });
});

function SendUserStatistic(userID, res, filter) {
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
                    "answers": {$push: "$answers"},
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
        function (err, aggresultReceived) {
            if (err) console.error(err);
            else {
                AnswerModel.aggregate(
                    [
                        {"$match": {"userid": mongoose.Types.ObjectId(userID)}},
                        {
                            $group: {
                                "_id": {
                                    "exerciseid": "$exerciseid",
                                    "created": "$created",
                                    "week": {$week: "$created"},
                                    "hour": {$hour: "$created"},
                                }
                            }
                        },
                        {
                            $sort: {"_id.created": -1}
                        },
                        {
                            $group: {
                                "_id": {$cond: [{$eq: [filter, "week"]}, "$_id.week", "$_id.hour"]},
                                "count": {$sum: 1}
                            }
                        },
                        {
                            $project: {
                                "_id": 0,
                                "filter": "$_id",
                                "count": "$count"
                            }
                        }
                    ],
                    function (err, aggresultActivity) {
                        if (err) console.error(err);
                        else {
                            UserModel.aggregate(
                                [
                                    {
                                        $group: {
                                            "_id": "$_id",
                                            "logins": {$avg: "$logins"}
                                        }
                                    },
                                    {
                                        $group: {
                                            "_id": 0,
                                            "logins": {$avg: "$logins"}
                                        }
                                    },
                                    {
                                        $project: {
                                            "_id": 0,
                                            "logins": "$logins"
                                        }
                                    }
                                ],
                                function (err, aggresultLogins) {
                                    if (err) console.error(err);
                                    else {
                                        UserModel.findById(userID, function (err, result) {
                                            if (err) return console.error(err);
                                            var activityArray = [];
                                            if (aggresultActivity.length != 0) {

                                                var first = aggresultActivity[0].filter;
                                                var last = aggresultActivity[aggresultActivity.length - 1].filter;

                                                do {
                                                    var found = false;
                                                    for (var x = 0; x < aggresultActivity.length; x++) {
                                                        if (aggresultActivity[x].filter == first) {
                                                            activityArray.push({
                                                                "x": first,
                                                                "y": aggresultActivity[x].count
                                                            });
                                                            found = true;
                                                        }
                                                    }
                                                    if (!found) activityArray.push({"x": first, "y": 0});

                                                    filter == "week" ? first = (first % 52) + 1 : first = (first + 1) % 24;
                                                } while (first != (filter == "week" ? (last % 52) + 1 : (last + 1) % 24));
                                            }

                                            res.status(200).json({
                                                "received": aggresultReceived,
                                                "activity": activityArray,
                                                "logins": {
                                                    "average": aggresultLogins[0].logins,
                                                    "mylogins": result.logins
                                                }
                                            });
                                        });
                                    }
                                });
                        }
                    });
            }
        }
    );
}

function countcourses(arr) {
    var a = [], b = [];

    for (var i = 0; i < arr.length; i++) {
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

    for (var i = 0; i < arr.length; i++) {
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