(function () {

    var userApp = angular.module("userApp");

    var editUserProfileController = function ($scope, userRestData, $routeParams) {
        $scope.editProfile = function () {
            userRestData.editUser.save($scope.user);
            //TODO ERRORS!!!!
        };
    };

    userApp.controller("editUserProfileController", editUserProfileController);

}());