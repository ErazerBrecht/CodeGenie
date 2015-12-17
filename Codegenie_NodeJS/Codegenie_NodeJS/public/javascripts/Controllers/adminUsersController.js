(function () {

    var app = angular.module("adminApp");

    var adminUsersController = function ($scope, restData, $routeParams, $http) {
        restData.getAllUsers.query(function (data) {
            $scope.users = data;
            $scope.assign = {};
            $scope.assign.users = [];
        });

        $scope.checkboxUser =  function (id)
        {
            if ($scope.users[id].checkbox)
            {
                $scope.assign.users.push($scope.users[id]._id);
            }
            else
            {
                 var index = $scope.assign.users.indexOf($scope.users[id]._id);
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