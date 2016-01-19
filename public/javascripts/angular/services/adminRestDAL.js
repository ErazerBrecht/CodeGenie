/**
 * Created by Brecht on 19/01/2016.
 */
angular.module("adminApp").service("adminRestDAL", function ($resource, $q) {
    var exercisesData;
    var userData;

    this.getUsers = function () {
        if (!userData)
            userData = $resource("/admin/users").query();
        console.log(userData);
        return userData;
    }

    this.getExercises = function () {
        if (!exercisesData)
            exercisesData = $resource("/admin/exercises").query(function (data) {
                //Convert every field that is a date, to a data type
                data.forEach(function (value, key) {
                    value.deadline = new Date(value.deadline);
                    if (value.revealdate != undefined)
                        value.revealdate = new Date(value.revealdate);
                });
            });
        return exercisesData;
    }

    this.addExercise = function (exercise) {
        var deferred = $q.defer();
        $resource("/admin/exercises").save(exercise, function (success) {
            success.confirm.deadline = new Date(success.confirm.deadline);
            success.confirm.revealdate = new Date(success.confirm.revealdate);
            exercisesData.push(success.confirm);
            deferred.resolve({
                message: success.data
            });
        }, function (error) {
            deferred.reject(error.data);
        });

        return deferred.promise;
    }

    this.getAnswers = function () {
        //Always update answers!
        //No need for manuel caching (no global variable)

        var answersData = $resource("/admin/answers").query(function (data) {
            data.forEach(function (answer) {
                answer.name = userData.find(function (u) {
                    return u._id === answer.userid;
                }).name;
            });
        });
        return answersData;
    }
});
