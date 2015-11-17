(function () {
    
    var app = angular.module("adminApp");
    
    var answersController = function ($scope, restData, $routeParams) {
        var getAllAnswers = function () {
            restData.getAllAnswers()
					.then(onDataComplete, onError);
        };
        var onDataComplete = function (data) {
            $scope.answers = data;
            alert($scope.answers.length);
            for (i = 0; i < $scope.answers.length; i++) {
                getUserById($scope.answers[i].userid);
            }
            
        };
        var onError = function (response) {
            $scope.error = "Couldn't find the data"
        };
        
        var getUserById = function (userId) {
            restData.getUserById(userId)
                    .then(onUserDataComplete, onError);
        };
        var onUserDataComplete = function (data) {
            $scope.userData = data;  
        };
        getAllAnswers();
        alert($scope.userData.name);
    };
    app.controller("answersController", answersController);
}());