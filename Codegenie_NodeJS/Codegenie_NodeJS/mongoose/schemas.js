var mongoose = require('mongoose');
var moment = require('moment');

var typeEnum = ['Checkbox', 'Question', 'Code', 'MultipleChoice'];

var courseEnum = ['None', 'Programming Principles', 'OO', 'Mobile-dev', 'SO4'];

/*var courseSchema = {
    course: { type: String, required: true, enum: courseEnum },
    motd: String
};*/

var userSchema = mongoose.Schema({
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    class: { type: String, required: true, default: "None" },
    course: { type: String, required: true, enum: courseEnum, default: "None" },
    email: { type: String, unique: true, sparse: true },
    status: { type: Number, default: "0" },
    admin: { type: Boolean, default: false },
    registerdate: { type: Date, default: new Date().toISOString() },
    lastseen: { type: Date, default: new Date().toISOString() }
});

var exerciseSchema = mongoose.Schema({
    title: { type: String, required: true },
    classification: { type: String, required: true },
    course: { type: String, required: true, enum: courseEnum },
    revealdate: { type: Date },
    deadline: { type: Date },
    created: { type: Date, default: new Date().toISOString() },
    extra: { type: Boolean, default: false },
    questions: [{
            questiontitle: { type: String, required: true },
            weight: { type: Number, required: true },
            extra: { type: Boolean, default: false },
            type: { type: String, required: true, enum: typeEnum },
            choices: [{
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
    created: { type: Date, default: new Date().toISOString() },
    answers: [{
            questionid: { type: mongoose.Schema.ObjectId, required: true },
            questiontitle: { type: String, required: true },
            received: { type: Number, default: 0 },
            weight: { type: Number, required: true },
            extra: { type: Boolean, required: true },
            type: { type: String, required: true, enum: typeEnum },
            result: String,
            feedback: Number,
            choices: [{ text: String }]
        }]
});

var UserModel = mongoose.model('User', userSchema);
var ExerciseModel = mongoose.model('Exercise', exerciseSchema);
var AnswerModel = mongoose.model('Answer', answerSchema);

exports.UserModel = UserModel;
exports.ExerciseModel = ExerciseModel;
exports.AnswerModel = AnswerModel;

exports.savehandler = function (res, err, successMessage) {
    if (err) {
        var errmessage = [];
        for (var field in err.errors) errmessage.push(err.errors[field].message + " Found " + err.errors[field].value + ".");
        return res.status(400).send(errmessage);
    }
    else {
        var succesResponse =  {};
        succesResponse.data = successMessage;
        return res.status(201).send(succesResponse);
    }
};

exports.questionExists = function (answer, questions) {
    for (var index in questions) {
        if (!answer.hasOwnProperty("questionid")) return false;
        if (questions[index]._id == answer.questionid) return true;
    }
    return false;
};

exports.answerExists = function (answer, answers) {
    for (var index in answers) {
        if (!answer.hasOwnProperty("questionid")) return false;
        if (answers[index].questionid == answer.questionid) return true;
    }
    return false;
};