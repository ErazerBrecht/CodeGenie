(function () {
    
    var app = angular.module("adminApp");
    
    
    var answersController = function ($scope, restData, $routeParams) {
        restData.getAllAnswers.query(function (data) {
            $scope.answers = data;
            $scope.addUserNames();
        });
        
        $scope.addUserNames = function () {
            angular.forEach($scope.answers, function (answer) {
                restData.getUserById.get({ userid: answer.userid }, function (data) {
                    answer.name = data.name;
                });

            });
        };
    }
    app.controller("answersController", answersController);
}());