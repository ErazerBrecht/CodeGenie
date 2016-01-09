var schemas = require('../../mongoose/schemas');
var express = require('express');
var mongoose = require('mongoose');
var auth = require('../../passport/authlevels');
var router = express.Router();

var UserModel = schemas.UserModel;
var AnswerModel = schemas.AnswerModel;

var savehandler = schemas.savehandler;

var isAdmin = auth.isAdmin;

//ADMIN USERS

//GET

router.get('/users/', isAdmin, function (req, res) {
    UserModel.find({}, {password: 0}).lean().exec(function (err, result) {
        if (err) return console.error(err);

        res.status(200).json(result);
    })
});

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
    UserModel.findById(userID), function (err, result) {
        if (err) return console.error(err);
        if (!result) return res.status(400).json(["Not an eligible user ID."]);

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
    };
});

//POST

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

    for (var index in req.body.users)
        if (req.body.users.hasOwnProperty(index))
            userlist.push({"id": req.body.users[index], "course": req.body.course});

    var totalaffected = 0;

    var promises = userlist.map(function (usobj) {
        return new Promise(function (resolve, reject) {
            UserModel.update({_id: usobj.id}, {$set: {status: 1, course: usobj.course}}, function (err, affected) {
                if (err) return reject(err);
                totalaffected += affected.nModified;
                resolve();
            });
        });
    });

    Promise.all(promises).then(function () {
        savehandler(res, undefined, "Succesfully assigned " + totalaffected + (totalaffected == 1 ? " user." : " users."))
    }).catch(console.error);
});

module.exports = router;