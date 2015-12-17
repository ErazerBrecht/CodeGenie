(function () {

    var app = angular.module("adminApp");

    var adminUsersController = function ($scope, restData, $routeParams, $http) {
        restData.getAllUsers.query(function (data) {
            $scope.users = data;
            $scope.assign = {};
            $scope.assign.users = [];
        });

        $scope.checkboxUser =  function (user)
        {
            if (user.checkbox)
            {
                $scope.assign.users.push(user._id);
            }
            else
            {
                 var index = $scope.assign.users.indexOf(user._id);
                 if (index > -1)
                 {
                     $scope.assign.users.splice(index, 1);
                 }
            }
        };

        $scope.processForm = function () {
            //Clear error and message
            $scope.error = null;
            $scope.message = null;

            $http({
                method  : 'POST',
                url     : '/admin/users/assign/',
                data    : $scope.assign,
                responseType: 'text'
            }).then(
                //SUCCESS
                function (response) {
                    $scope.message = response.data;
                },
                //ERROR
                function (error) {
                    $scope.error = error.data;
                }
            );

        };

        $scope.cancel = function () {
            angular.forEach($scope.users, function (value, key) {
                value.checkbox = false;
            });

            $scope.assign = {};
            $scope.assign.users = [];
        }

    };

    app.controller("adminUsersController", adminUsersController);

}());