(function () {

    var app = angular.module("userApp");
    var newAnswer = {};

    var userExercisesController = function ($scope, userRestData) {
        $scope.today = new Date();

        $scope.beautify = function (ans) {
            var array = ans.result.split(/\n/);
            array[0] = array[0].trim();
            ans.result = array.join("\n");
            var options =
            {
                "brace_style": "expand"             //Changed to braces on seperate line => C# STYLE
            }
            ans.result = js_beautify(ans.result, options);

            angular.forEach($scope.selected.answers, function (value, key) {
                if (value.questionid == ans.questionid) {
                    $scope.selected.answers.result = ans.result;
                }

            });

        };

        //for making textarea automatic bigger and smaller
        function textAreaAdjust(o) {
            o.style.height = "1px";
            o.style.height = (25 + o.scrollHeight) + "px";
        };

        $scope.dismissMessage = function () {
            $scope.message = null;
        };

        $scope.select = function (exercise) {
            //Prevent double click
            if ($scope.selected === undefined || $scope.selected._id != exercise._id) {
                $scope.selected = exercise;

                //Clear error and message
                $scope.error = null;
                $scope.message = null;

                if (!$scope.selected.solved) {
                    //Convert question object to answer object
                    var questions = $scope.selected.questions;

                    //Update your exercises seen array with this exercise
                    userRestData.addLastSeenNew.save({exerciseid: $scope.selected._id, }, function (data) {

                    });

                    //Rename _id field to questionid
                    angular.forEach(questions, function (value, key) {
                        value.questionid = value._id;
                        delete value._id;
                    });

                    $scope.selected.answers = questions;
                }
                else if($scope.selected.revised)
                {
                    userRestData.addLastSeenRevised.save({exerciseid: $scope.selected._id, }, function (data) {

                    });
                }
            }
        };

        $scope.getTileClass = function (selected) {
            var tempExercise = selected
            if(tempExercise.revised) {
                return "lightblue";
            }
            if (tempExercise.solved) {
                if (tempExercise.answerDate > tempExercise.deadline)
                    return "orange";
                return "green";
            }
            else {
                if (tempExercise.deadline < new Date()) {
                    return "red";
                }
                else if (!tempExercise.seen)
                    return "blue";

                return "purple";
            }
        };

        $scope.processForm = function () {
            //Clear error and message
            $scope.error = null;
            $scope.message = null;

            angular.forEach($scope.selected.answers, function (value, key) {
                if (value.type == "Code") {
                    $scope.beautify(value);
                }

            });

            $scope.selected.exerciseid = $scope.selected._id;

            userRestData.postAnswer.save($scope.selected,
                function (response) {
                    $scope.message = response.data;
                },
                function (err) {
                    $scope.error = err.data;
                }
            );
        };
    };

    var userExercisesFilter = function()
    {
        return function( items, solved, expired, revised) {
            var filtered = [];
            var today = new Date();

            angular.forEach(items, function(item) {
                if(revised === true) {
                    if(revised === item.revised)
                        filtered.push(item);
                    return;
                }
                if(solved === item.solved && ((!expired && item.deadline > today) || (expired && item.deadline < today)))
                    filtered.push(item);
            });

            return filtered;
        };
    }

    app.controller("userExercisesController", userExercisesController);
    app.filter("userExercisesFilter", userExercisesFilter);
}());