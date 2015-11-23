(function () {
    
    var app = angular.module("userApp");
    
    var userPanelController = function ($scope, userRestData, $routeParams) {
        
        userRestData.getUser.get(function (data) {
            $scope.user = data;
        });
    };
    
    app.controller("userPanelController", userPanelController);

}());