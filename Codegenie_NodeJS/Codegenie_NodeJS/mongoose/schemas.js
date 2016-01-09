var mongoose = require('mongoose');
var moment = require('moment');

var typeEnum = ['Checkbox', 'Question', 'Code', 'MultipleChoice'];

var courseEnum = ['None', 'Programming Principles', 'OO', 'Mobile-dev', 'SO4', 'Admin'];

var userSchema = mongoose.Schema({
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    class: { type: String, required: true, default: "None" },
    course: { type: String, required: true, enum: courseEnum, default: "None" },
    email: { type: String, unique: true, sparse: true },
    logins: Number,
    status: { type: Number, default: "0" },
    registerdate: { type: Date, default: new Date() },
    lastseen: { type: Date, default: new Date() }
});

var userSeenSchema = mongoose.Schema({
    userid: { type: mongoose.Schema.ObjectId, required: true },
    seenexercises: [{
            _id: false,
            exerciseid: { type: mongoose.Schema.ObjectId, required: true },
            dateseen: { type: Date, default: new Date() },
            revised: { type: Boolean, default: false }
    }]
});

var exerciseSchema = mongoose.Schema({
    title: { type: String, required: true },
    classification: { type: String, required: true },
    course: { type: String, required: true, enum: courseEnum },
    revealdate: { type: Date },
    deadline: { type: Date },
    created: { type: Date, default: new Date() },
    extra: { type: Boolean, default: false },
    questions: [{
            questiontitle: { type: String, required: true },
            weight: { type: Number, required: true },
            extra: { type: Boolean, default: false },
            type: { type: String, required: true, enum: typeEnum },
            choices: [{
                    _id: false,
                    text: { type: String, required: true },
                    correct: { type: Boolean, default: false }
                }]
        }]
});

var answerSchema = mongoose.Schema({
    exerciseid: { type: mongoose.Schema.ObjectId, required: true },
    userid: { type: mongoose.Schema.ObjectId, required: true },
    title: { type: String, required: true },
    classification: { type: String, required: true },
    course: { type: String, required: true, enum: courseEnum },
    extra: { type: Boolean, required: true },
    revised: { type: Boolean, default: false },
    created: { type: Date, default: new Date() },
    answers: [{
            questionid: { type: mongoose.Schema.ObjectId, required: true },
            questiontitle: { type: String, required: true },
            received: { type: Number, default: 0 },
            weight: { type: Number, required: true },
            extra: { type: Boolean, required: true },
            type: { type: String, required: true, enum: typeEnum },
            result: String,
            comment: String,
            feedback: Number,
            choices: [{ text: String }]
        }]
});

var UserModel = mongoose.model('User', userSchema);
var UserSeenModel = mongoose.model('UserSeen', userSeenSchema);
var ExerciseModel = mongoose.model('Exercise', exerciseSchema);
var AnswerModel = mongoose.model('Answer', answerSchema);

exports.UserModel = UserModel;
exports.UserSeenModel = UserSeenModel;
exports.ExerciseModel = ExerciseModel;
exports.AnswerModel = AnswerModel;

exports.savehandler = function (res, err, successMessage) {
    if (err) {
        var errorMessage = [];
        for (var field in err.errors) errorMessage.push(err.errors[field].message + " Found " + err.errors[field].value + ".");
        return res.status(400).json(errorMessage);
    }
    else return res.status(201).json({ "data": successMessage });
};

exports.questionExists = function (answer, questions) {
    for (var index in questions) {
        if (!answer.hasOwnProperty("questionid")) return false;
        if (questions[index]._id == answer.questionid) return true;
    }
    return false;
};