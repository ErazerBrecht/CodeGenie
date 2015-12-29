(function () {

    var userApp = angular.module("userApp");

    var userProfileEditController = function ($scope, userRestData, $routeParams) {
        $scope.editProfile = function () {
            $scope.message = null;
            $scope.error = null;

            userRestData.editUser.save($scope.user,
                function(response) {
                    $scope.message = response.data;
                },
                function (error) {
                    $scope.error = error.data;
                }
            )};
    };

    userApp.controller("userProfileEditController", userProfileEditController);

}());