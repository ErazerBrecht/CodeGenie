(function () {

    var app = angular.module("adminApp");

    var adminUsersController = function ($scope, restData, $routeParams) {
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