var mongoose = require('mongoose');
var moment = require('moment');

var typeEnum = ['Checkbox', 'Question', 'Code', 'MultipleChoice'];

var courseEnum = ['Programming Principles', 'OO', 'Mobile-dev', 'SO4'];

var userSchema = mongoose.Schema({
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    class: { type: String, required: true },
    //course: { type: String, required: true, enum: courseEnum },
    email: { type: String, unique: true, sparse: true },
    status: { type: Number, default: "0" },
    admin: { type: Boolean, default: false },
    registerdate: { type: Date, default: new Date().toISOString() },
    lastseen: { type: Date, default: new Date().toISOString() }
});

var exerciseSchema = mongoose.Schema({
    title: { type: String, required: true },
    classification: { type: String, required: true },
    class: { type: String, required: true },
    //course: { type: String, required: true, enum: courseEnum },
    deadline: { type: Date },
    created: { type: Date, default: new Date().toISOString() },
    extra: { type: Boolean, default: false },
    questions: [{
            questiontitle: { type: String, required: true },
            weight: { type: Number, required: true },
            extra: { type: Boolean, default: false },
            type: { type: String, required: true, enum: typeEnum },
            choices: [{
                    text: String,
                    correct: { type: Boolean, default: false }
                }]
        }]
});

var answerSchema = mongoose.Schema({
    exerciseid: { type: String, required: true },
    userid: { type: String, required: true },
    title: { type: String, required: true },
    classification: { type: String, required: true },
    class: { type: String, required: true },
    //course: { type: String, required: true, enum: courseEnum },
    extra: { type: Boolean, required: true },
    revised: { type: Boolean, default: false },
    created: { type: Date, default: new Date().toISOString() },
    answers: [{
            questionid: { type: String, required: true },
            questiontitle: { type: String, required: true },
            received: { type: Number, default: 0 },
            weight: { type: Number, required: true },
            extra: { type: Boolean, required: true },
            type: { type: String, required: true, enum: typeEnum },
            result: {type: String},
            choices: [{ text: String }]
        }]
});

var UserModel = mongoose.model('User', userSchema);
var ExerciseModel = mongoose.model('Exercise', exerciseSchema);
var AnswerModel = mongoose.model('Answer', answerSchema);

exports.UserModel = UserModel;
exports.ExerciseModel = ExerciseModel;
exports.AnswerModel = AnswerModel;

exports.errhandler = function (err) {
    if (err) {
        var errmessage = "";
        for (var field in err.errors) {
            errmessage += err.errors[field].message + " Found " + err.errors[field].value + ".\n";
        }
        return errmessage;
    }
    else return "ok";
}

exports.questionExists = function (answer, questions) {
    for (var index in questions) {
        if (!answer.hasOwnProperty("questionid")) return false;
        if (questions[index]._id == answer.questionid) return true;
    }
    return false;
}

exports.answerExists = function (answer, answers) {
    for (var index in answers) {
        if (!answer.hasOwnProperty("questionid")) return false;
        if (answers[index].questionid == answer.questionid) return true;
    }
    return false;
}