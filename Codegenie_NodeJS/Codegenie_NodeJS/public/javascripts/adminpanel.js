var adminApp = angular.module('adminApp', ['ngRoute']);

adminApp.config(function($routeProvider) {
    $routeProvider
        // route for the dashboard
        .when('/', {
            templateUrl: 'views/dashboard.html',
            controller: 'dashBoardController'
        })

        // route for the question page
        .when('/exercise', {
            templateUrl: 'views/exercise.html',
            controller: 'exerciseController'
        });
});


// create the controller and inject Angular's $scope
adminApp.controller('dashBoardController', function ($scope) {
    // create a message to display in our view
    //$scope.message = 'WiP will be done soon';
});

// create the controller and inject Angular's $scope
adminApp.controller('exerciseController', function ($scope) {
    // create a message to display in our view
    $scope.message = 'Here you will be able to add exercises for the student!';
});