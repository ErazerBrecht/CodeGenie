(function () {

    var userApp = angular.module("userApp");

    var userProfileEditController = function ($scope, userRestData, $routeParams) {
        $scope.editProfile = function () {
            userRestData.editUser.save($scope.user);
            //TODO ERRORS!!!!
            //Issue #30 => Arne Schoonvliet
        };
    };

    userApp.controller("userProfileEditController", userProfileEditController);

}());