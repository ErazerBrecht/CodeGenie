(function () {

    var userApp = angular.module("userApp");

    var editProfileController = function ($scope, $routeParams) {
        userRestData.getUser.get(function (data) {
            $scope.user = data;
        });
    };

    userApp.controller("editProfileController", editProfileController);

}());