(function () {
    
    var app = angular.module("userApp");
    
    var userExercisesController = function ($scope, userRestData, $routeParams) {
        userRestData.getExercises.query(function (data) {
            $scope.exercises = data;
        });
    };
    app.controller("userExercisesController", userExercisesController);
}());