(function () {
    
    var app = angular.module("userApp");
    
    var userPanelController = function ($scope, userRestData, $routeParams) {
        
        userRestData.getUser.get(function (data) {
            $scope.user = data;
        });

        userRestData.getNewExercises.get(function (data)
        {
            $scope.newExercises = data;
        });
    };
    
    app.controller("userPanelController", userPanelController);

}());