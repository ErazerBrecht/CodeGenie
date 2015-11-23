(function () {
    
    var app = angular.module("userApp");
    
    var userExercisesController = function ($scope, userRestData, $routeParams) {
        userRestData.getExercises.query(function (data) {
            $scope.exercises = data;
        });

        $scope.select = function (id) {
            $scope.selected = $scope.exercises[id];
        }

       
    };
    app.controller("userExercisesController", userExercisesController);
}());