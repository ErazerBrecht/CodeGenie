var mongoose = require("mongoose");
var validator = require("validator");
var moment = require('moment');

var validateDate = function (date) {
    var dateRegex = /^(?:(?:31(\/)(?:0?[13578]|1[02]|(?:Jan|Mar|May|Jul|Aug|Oct|Dec)))\1|(?:(?:29|30)(\/)(?:0?[1,3-9]|1[0-2]|(?:Jan|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/)(?:0?2|(?:Feb))\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/)(?:(?:0?[1-9]|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep))|(?:1[0-2]|(?:Oct|Nov|Dec)))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
    return dateRegex.test(date);
}

var userSchema = mongoose.Schema({
    name: { type: String, required: "The field 'name' was not found", unique: true },
    password: { type: String, required: "The field 'password' was not found" },
    class: { type: String, required: "The field 'class' was not found" },
    email: { type: String, unique: true, validate: [validator.isEmail, 'Invalid email'] },
    status: { type: Number, default: "0" },
    admin: { type: Boolean, default: false },
    registerdate: { type: String, default: moment().format("DD/MM/YYYY"), validate: [validateDate, "Invalid date found in 'registerdate'"] },
    lastseen: { type: String, default: moment().format("DD/MM/YYYY"), validate: [validateDate, "Invalid date in 'lastseen'"] }
});

var exerciseSchema = mongoose.Schema({
    title: { type: String, required: "The field 'title' was not found" },
    classification: { type: String, required: "The field 'classification' was not found" },
    weight: { type: Number, required: "The field 'weight' was not found" },
    deadline: { type: String, validate: [validateDate, "Invalid date in 'deadline'"] },
    created: { type: String, default: moment().format("DD/MM/YYYY"), validate: [validateDate, "Invalid date in 'created'"] },
    extra: { type: Boolean, default: false },
    questions: [{
        question: { type: String, required: "A field 'question' was not found" },
        weight: { type: Number, required: "A field 'weight' was not found" },
        extra: { type: Boolean, default: false },
        type: { type: String, required: true, default: "Checkbox", enum: ['Checkbox', 'Question', 'Code'] }
    }]
});

var answerSchema = mongoose.Schema({
    exerciseid: { type: String, required: "The field 'exerciseid' was not found" },
    userid: { type: String, required: "The field 'userid' was not found" },
    answered: { type: String, default: moment().format("DD/MM/YYYY"), validate: [validateDate, "Invalid date in 'answered'"] },
    answers: [{
        //TODO: Add question id from original exercise, clean up unecessary shit after
        answered: { type: Boolean, required: "A field 'answered' was not found" },
        received: { type: Number, required: "A field 'received' was not found" },
        extra: { type: Boolean, default: false },
        comment: { type: String, default: "" },
        type: { type: String, required: true, default: "Checkbox", enum: ['Checkbox', 'Question', 'Code'] }
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
        var errmessage = [];
        for (var field in err.errors) {
            var mes = err.errors[field].message + ": " + err.errors[field].value;
            console.log(mes);
            errmessage.push({ error: mes });
        }
        return errmessage;
    }
    else {
        return "ok";
    }
}