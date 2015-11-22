(function () {
    
    var app = angular.module("adminApp");
    
    var exercisesController = function ($scope, $http, restData, $routeParams) {        
        restData.getExercises.query(function (data) {
            $scope.exercises = data;
        });
    };
    
    app.controller("exercisesController", exercisesController);
})();