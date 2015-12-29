(function () {

    var adminApp = angular.module("adminApp");

    var adminProfileEditController = function ($scope, restData, $routeParams) {
        $scope.editProfile = function () {
            restData.editUser.save($scope.user);
            //TODO ERRORS!!!!
            //Issue #30 => Arne Schoonvliet
        };
    };

    adminApp.controller("adminProfileEditController", adminProfileEditController);

}());