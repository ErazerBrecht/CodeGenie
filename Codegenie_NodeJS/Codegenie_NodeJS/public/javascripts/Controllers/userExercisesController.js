(function () {
    
    var app = angular.module("userApp");
    var newAnswer = {};
    
    var userExercisesController = function ($scope, userRestData, $routeParams, $http) {
        userRestData.getExercises.query(function (data) {
            $scope.exercises = data;
        });
        
        $scope.select = function (id) {
            $scope.selected = $scope.exercises[id];

            //Clear error and message
            $scope.error = null;
            $scope.message = null;

            //Convert question object to answer object
            $scope.answers = $scope.selected.questions;

            //Rename _id field to questionid
            angular.forEach($scope.answers, function (value, key) {
                value.questionid = value._id;
                delete value._id;
            });
            
            newAnswer.exerciseid = $scope.selected._id;
            newAnswer.answers = $scope.answers;

            $scope.answer = newAnswer;
        }
        
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