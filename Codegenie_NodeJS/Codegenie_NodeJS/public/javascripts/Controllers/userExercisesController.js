(function () {
    
    var app = angular.module("userApp");
    var answer = {};
    var newAnswer = {};
    var userData;
    
    var userExercisesController = function ($scope, userRestData, $routeParams, $http) {
        userRestData.getExercises.query(function (data) {
            $scope.exercises = data;
        });
        
        userRestData.getUser.get(function (data) {
            $scope.userData = data;
        });
        
        
        $scope.select = function (id) {
            $scope.selected = $scope.exercises[id];
            $scope.answers = $scope.exercises[id].questions;
            
            angular.forEach($scope.answers, function (value, key) {
                value.questionid = value._id;
                delete value._id;
            });
            
            answer.exerciseid = $scope.selected._id;
            
            
            
            answer.answers = $scope.answers;
            $scope.answer = answer;
 
        }
        
        $scope.processForm = function () {
            userRestData.postAnswer.save($scope.answer, function (response) {
                alert("Created");
            });
            
        };
    };
    
    app.controller("userExercisesController", userExercisesController);
   
}());