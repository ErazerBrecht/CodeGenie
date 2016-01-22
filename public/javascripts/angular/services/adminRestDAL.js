/**
 * Created by Brecht on 19/01/2016.
 */
angular.module("adminApp").service("adminRestDAL", function ($resource) {
    var exercisesData;
    var userData;
    var myUserData;

    this.getMyself = function () {
        if (!myUserData)
            myUserData = $resource("/users/mine").get();
        return myUserData;
    };

    //Private function
    //Had to do this because if need to access this function inside a callback
    //this doesn't point to this service anymore but to the callback...
    function getUsersAsync() {
        if (!userData)
            userData = $resource("/admin/users").query();
        return userData;
    };

    this.getUsers = function () {
        return getUsersAsync();
    };

    //Will execute a post to the back end
    //This post will change the course of the selected users
    //It will also change it on our local list!
    //This is better, because we don't need to reload every user now! (faster/ smoother)
    this.assignUsers = function (assign) {
        return $resource("/admin/users/assign").save(assign).$promise
            .then(
                function (success) {
                    assign.users.forEach(function (value) {
                        var index = userData.map(function (e) {
                            return e._id
                        }).indexOf(value);
                        if (index > 0)
                            userData[index].course = assign.course;
                    });

                    return success.data
                },
                function (error) {
                    throw error.data;
                });
    };

    this.removeUser = function (userid) {
        return $resource('/admin/users/:userid/delete', {userid: '@userid'}).get({userid: userid}).$promise
            .then(
                function (success) {
                    //Remove deleted user
                    //We could also reload the data
                    //But than our checkboxes values are lost (in adminUsers.html)
                    var i = userData.map(function (u) {
                        return u._id
                    }).indexOf(userid);
                    userData.splice(i, 1);

                    return success.data
                },
                function (error) {
                    throw error.data;
                });
    };

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
        return $resource("/admin/exercises").save(exercise).$promise
            .then(
                function (success) {
                    success.confirm.deadline = new Date(success.confirm.deadline);
                    success.confirm.revealdate = new Date(success.confirm.revealdate);
                    exercisesData.push(success.confirm);

                    return success.data;

                },
                function (error) {
                    throw error.data;
                });
    };

    this.updateExercise = function (exercise) {
        return $resource("/admin/exercises/:id/edit/", {id: '@id'}).save({id: exercise._id}, exercise).$promise
            .then(
                //This in not strictly necessary
                //Did it because every request returns on the same way
                //Without this our controller has to get the data of the succesmessage/error
                //Our 'DAL' should always respond on the same way!
                function (success) {
                    return success.data;
                },
                function (error) {
                    throw error.data;
                });
    };

    this.deleteExercise = function (exercise) {
        return $resource("/admin/exercises/:id/delete/", {id: '@id'}).delete({id: exercise._id}).$promise
            .then(
                //This in not strictly necessary
                //Did it because every request returns on the same way
                //Without this our controller has to get the data of the succesmessage/error
                //Our 'DAL' should always respond on the same way!
                function (success) {
                    return success.data;
                },
                function (error) {
                    throw error.data;
                });
    };

    this.getAnswers = function () {
        //Always update answers!
        //No need for manuel caching (no global variable)

        var answersData = $resource("/admin/answers").query(function (data) {
            //Make sure we have our users loaded!
            //This is exactly why I <3 C#
            //I could reuse my existing function (getUsers) and just put 'await' before it...
            getUsersAsync().$promise
                .then(
                    function () {
                        data.forEach(function (answer) {
                            answer.name = userData.find(function (u) {
                                return u._id === answer.userid;
                            }).name;
                        });
                    }
                )
        });
        return answersData;
    };

    this.getAnswersByExerciseid = function (exercise) {
        var anwersData = $resource("/admin/exercises/:id/answers", {id: '@id'}).query({id: exercise._id}, function (data) {
            //Make sure we have our users loaded!
            getUsersAsync().$promise
                .then(
                    function () {
                        data.forEach(function (answer) {
                            answer.name = userData.find(function (u) {
                                return u._id === answer.userid;
                            }).name;

                            answer.totalPoints = 0;
                            answer.checkTotalpoints = 0;
                            answer.answers.forEach(function (a) {
                                answer.totalPoints += parseInt(a.weight);
                                answer.checkTotalpoints += a.received;

                                if (a.received != 0) {
                                    a.checkQuestion = true;
                                    answer.totalCheck = true;
                                }
                                if (a.comment == undefined) {
                                    a.comment = "";
                                }
                            });
                        });
                    }
                )
        });
        return anwersData;
    };

    this.updateAnswers = function (answerArray) {
        return $resource("/admin/answers/edit").save(answerArray).$promise
            .then(
                //This in not strictly necessary
                //Did it because every request returns on the same way
                //Without this our controller has to get the data of the succesmessage/error
                //Our 'DAL' should always respond on the same way!
                function (success) {
                    return success.data;
                },
                function (error) {
                    throw error.data;
                });
    }
});
