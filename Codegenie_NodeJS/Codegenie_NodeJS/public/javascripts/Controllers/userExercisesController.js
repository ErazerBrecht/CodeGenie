(function () {
    
    var app = angular.module("userApp");
    var newAnswer = {};
    
    var userExercisesController = function ($scope, userRestData, $routeParams, $http) {
        userRestData.getExercises.query(function (data) {
            $scope.exercises = data;

            //Convert deadline dates to real date types
            angular.forEach($scope.exercises, function (value, key) {
                value.deadline = new Date(value.deadline);
            });
        });
        
        $scope.select = function (id) {
            //Prevent double click
            if($scope.selected === undefined || $scope.selected._id != $scope.exercises[id]._id) {
                $scope.selected = $scope.exercises[id];

                //Clear error and message
                $scope.error = null;
                $scope.message = null;

                if (!$scope.selected.solved) {
                    //Convert question object to answer object
                    $scope.questions = $scope.selected.questions;

                    //Rename _id field to questionid
                    angular.forEach($scope.questions, function (value, key) {
                        value.questionid = value._id;
                        delete value._id;
                    });

                    newAnswer.exerciseid = $scope.selected._id;
                    newAnswer.answers = $scope.questions;

                    $scope.answer = newAnswer;
                }
            }
        };

        $scope.getTileClass = function (id) {
            var tempExercise = $scope.exercises[id];

            if(tempExercise.solved)
            {
                //TODO: Koppel antwoord bij de oefening.
                //TODO: Check if the user wasn't to late
                return "green";
            }
            else
            {
                if(tempExercise.deadline < new Date())
                {
                    return "red";
                }
                //TODO Check if the reveal date is newer than the user lastseen date
                //return "blue";
                return "purple";
            }
        };
        
        $scope.processForm = function () {
            //Clear error and message
            $scope.error = null;
            $scope.message = null;

            $http({
                method  : 'POST',
                url     : '/users/answer/',
                data    : $scope.answer,
                responseType: 'text'
            }).then(
                //SUCCESS
                function (response) {
                    $scope.message = response.data;
                },
                //ERROR
                function (error) {
                    $scope.error = error.data;
                }
            );
            
        };
    };
    
    app.controller("userExercisesController", userExercisesController);
}());