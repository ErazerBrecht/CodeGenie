(function () {

    var adminApp = angular.module("adminApp");

    var adminProfileEditController = function ($scope, adminRestDAL) {
        $scope.editProfile = function () {
            $scope.message = null;
            $scope.error = null;

            adminRestDAL.editMyself($scope.user)
                .then(
                    function (response) {
                        $scope.message = response;
                    },
                    function (error) {
                        $scope.error = error;
                    }
                )
        };
    };

    adminApp.controller("adminProfileEditController", adminProfileEditController);

}());