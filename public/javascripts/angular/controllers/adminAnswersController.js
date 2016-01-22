(function () {

    var app = angular.module("adminApp");


    var adminAnswersController = function ($scope, restData, adminRestDAL) {
        //Constructor => Load all exercises
        loadData();

        //Get the exercises from our REST API
        function loadData() {
            //Save exercises in a scope variable
            //Now we can databind to this data!
            $scope.exercises = adminRestDAL.getExercises();
        };

        //When admin selects an exercise
        //Load all answers of this exercise
        $scope.select = function (exercise) {
            $scope.selected = adminRestDAL.getAnswersByExerciseid(exercise);
        };

        //This is the callback when changing the checkbox next to the username
        //This will change the points to maximum or to minimum of that total answer
        //Easy to revise a lot of answer quickly.
        //Start with max points => Untick what is incorrect
        //Start with min points => Tick what is correct
        $scope.change = function (answer) {
            if (answer.checkTotalpoints == 0) {
                answer.checkTotalpoints = answer.totalPoints;
                angular.forEach(answer.answers, function (a) {
                    a.received = a.weight;
                    a.checkQuestion = true;
                });

            }
            else {
                answer.checkTotalpoints = 0;
                angular.forEach(answer.answers, function (a) {
                    a.received = 0;
                    a.checkQuestion = false;
                });
                answer.totalCheck = false;

            }
        };

        //This is the callback when changed the checkbox next to the question
        //This will change the points of that question to maximum or minimum!
        $scope.changePoints = function (a, answer) {
            if (answer.checkTotalpoints == 0) {
                answer.checkTotalpoints += a.weight;
                a.received = a.weight;
                answer.totalCheck = true;
            }
            else {
                if (a.received != 0) {
                    a.received = 0;
                    answer.checkTotalpoints -= a.weight;
                    if (answer.checkTotalpoints == 0) {
                        answer.totalCheck = false;
                    }
                }
                else {
                    a.received = a.weight;
                    answer.checkTotalpoints += a.weight;
                }
            }
        };

        //Dynamically change the color
        //Blue = Standard (not - revisable)
        //Red = Expired (revisable)
        $scope.getTileClass = function (selected) {
            var tempExercise = selected;

            if (tempExercise.deadline < new Date())
                return "red";

            return "blue";

        };

        //Submit button callback
        //Will post the answers back to the server but revised
        //It sends every answer from that exercise back
        //This was ask by T.Dams
        //Makes it easy to revise quickly!
        $scope.processForm = function () {
            //Clear error and message
            $scope.error = null;
            $scope.message = null;

            angular.forEach($scope.selected, function (answer) {
                answer.revised = true;
            });

            adminRestDAL.updateAnswers($scope.selected)
                .then(
                    function (response) {
                        $scope.message = response;
                    },
                    function (error) {
                        $scope.error = error;
                    }
                );

            $scope.selected = undefined;
        };

        //Cancel button callback
        //Will take you back to the overview of all solved exercises!
        //Also resets changes
        $scope.cancel = function () {
            $scope.selected = null;
            $scope.error = null;
            $scope.message = null;
        };
    };

    var adminAnswerFilter = function () {
        return function (items, all, course, extra, expired) {
            var filtered = [];
            var today = new Date();
            if (!all)
                return items;

            angular.forEach(items, function (item) {
                //TODO: Filter exercises where every answer has been revised!
                if ((course == "All" || course == item.course) && (extra == item.extra) && ((!expired && item.deadline > today) || (expired && item.deadline < today))) {
                    filtered.push(item);
                }
            });
            return filtered;

        };
    };
    app.controller("adminAnswersController", adminAnswersController);
    app.filter("adminAnswerFilter", adminAnswerFilter);
}());