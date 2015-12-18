(function () {
    
    var app = angular.module("userApp");
    var newAnswer = {};
    
    var userExercisesController = function ($scope, userRestData, $routeParams, $http) {
        userRestData.getExercises.query(function (data) {
            $scope.exercises = data;

            //Convert deadline dates to real date types
            angular.forEach($scope.exercises, function (value, key) {
                value.deadline = new Date(value.deadline);

                if(value.solved)
                {
                    userRestData.getAnswer.get({ exerciseid: value._id }, function (data) {
                        value.answers = data.answers;
                        value.answerDate = new Date(data.created);
                    });
                }
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
                    var questions = $scope.selected.questions;

                    //Rename _id field to questionid
                    angular.forEach(questions, function (value, key) {
                        value.questionid = value._id;
                        delete value._id;
                    });

                    $scope.selected.answers = questions;
                }
            }
        };

        $scope.getTileClass = function (id) {
            var tempExercise = $scope.exercises[id];

            if(tempExercise.solved)
            {
                if(tempExercise.answerDate > tempExercise.deadline)
                    return "orange";
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

            $scope.selected.exerciseid = $scope.selected._id;

            $http({
                method  : 'POST',
                url     : '/users/answer/',
                data    : $scope.selected,
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