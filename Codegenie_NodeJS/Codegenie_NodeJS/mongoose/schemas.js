var mongoose = require('mongoose');
var moment = require('moment');

var validateDate = function (date) {
    var dateRegex = /^(?:(?:31(\/)(?:0?[13578]|1[02]|(?:Jan|Mar|May|Jul|Aug|Oct|Dec)))\1|(?:(?:29|30)(\/)(?:0?[1,3-9]|1[0-2]|(?:Jan|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/)(?:0?2|(?:Feb))\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/)(?:(?:0?[1-9]|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep))|(?:1[0-2]|(?:Oct|Nov|Dec)))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
    //return dateRegex.test(date);
    //TODO fix this regex
    return true;
}

var typeEnum = ['Checkbox', 'Question', 'Code', 'MultipleChoice'];

var userSchema = mongoose.Schema({
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    class: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    status: { type: Number, default: "0" },
    admin: { type: Boolean, default: false },
    registerdate: { type: String, default: moment().format("DD/MM/YYYY HH:mm:ss"), validate: [validateDate, "Invalid date found in 'registerdate'"] },
    lastseen: { type: String, default: moment().format("DD/MM/YYYY HH:mm:ss"), validate: [validateDate, "Invalid date in 'lastseen'"] }
});

var exerciseSchema = mongoose.Schema({
    title: { type: String, required: true },
    classification: { type: String, required: true },
    class: { type: String, required: true },
    deadline: { type: String, validate: [validateDate, "Invalid date in 'deadline'"] },
    created: { type: String, default: moment().format("DD/MM/YYYY HH:mm:ss"), validate: [validateDate, "Invalid date in 'created'"] },
    extra: { type: Boolean, default: false },
    questions: [{
        questiontitle: { type: String, required: true },
        weight: { type: Number, required: true },
        extra: { type: Boolean, default: false },
        type: { type: String, required: true, enum: typeEnum },
        choices: [{ type: String }],
    }]
});

var answerSchema = mongoose.Schema({
    exerciseid: { type: String, required: true },
    userid: { type: String, required: true },
    title: { type: String, required: true },
    classification: { type: String, required: true },
    class: { type: String, required: true },
    extra: { type: Boolean, required: true },
    revised: { type: Boolean, default: false },
    created: { type: String, default: moment().format("DD/MM/YYYY HH:mm:ss"), validate: [validateDate, "Invalid date in 'created'"] },
    answers: [{
        questionid: { type: String, required: true },
        questiontitle: { type: String, required: true },
        received: { type: Number, default: 0 },
        weight: { type: Number, required: true },
        extra: { type: Boolean, required: true },
        type: { type: String, required: true, enum: typeEnum },
        answer: { type: Boolean },
        choices: [{ type: String }],
        text: { type: String }
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
            errmessage += err.errors[field].message + " Found " + err.errors[field].value + ".";
        }
        return errmessage;
    }
    else {
        return "ok";
    }
}

exports.questionExists = function (answer, questions) {
    for (var index in questions) {
        if (questions[index]._id == answer.questionid) return true;
    }
    return false;
}

exports.answerExists = function (answer, answers) {
    for (var index in answers) {
        if (answers[index].questionid == answer.questionid) return true;
    }
    return false;
}