(function () {
    
    var app = angular.module("userApp");
    
    var userDashboardController = function ($scope, userRestData, $routeParams) {
        userRestData.getExercises.query(function (data) { 
            $scope.exercises = data;
        });
    };
    app.controller("userDashboardController", userDashboardController);
}());