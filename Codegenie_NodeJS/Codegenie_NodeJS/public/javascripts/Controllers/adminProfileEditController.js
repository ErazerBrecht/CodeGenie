(function () {

    var adminApp = angular.module("adminApp");

    var adminProfileEditController = function ($scope, restData) {
        $scope.editProfile = function () {
            $scope.message = null;
            $scope.error = null;

            restData.editUser.save($scope.user,
                function(response) {
                    $scope.message = response.data;
                },
                function (error) {
                    $scope.error = error.data;
                }
            )};
    };

    adminApp.controller("adminProfileEditController", adminProfileEditController);

}());