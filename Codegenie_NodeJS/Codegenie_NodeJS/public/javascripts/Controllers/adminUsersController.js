(function () {

    var app = angular.module("adminApp");

    var adminUsersController = function ($scope, restData, $routeParams, $http) {

        ctor();

        function ctor(){
            getData();
            $scope.assign = {};
            $scope.assign.users = [];
        }

        function getData() {
            restData.getAllUsers.query(function (data) {
                $scope.users = data;
            });
        };

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
                    //IS THIS THE RIGHT WAY??
                    //Just reload everything? Or should I change all courses manually
                    getData();
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
        };

        $scope.remove = function(user)
        {
            //THIS REMOVES EVERY USER!?
            //It sends the id twice maybe this is the problem
            //restData.removedUserById.get({ userid: user._id }, function (data) {
                //RESPONSE!!!
            //});

            //Clear error and message
            $scope.error = null;
            $scope.message = null;

            $http({
                method  : 'GET',
                url     : '/admin/users/'+ user._id +'/delete/',
                responseType: 'text'
            }).then(
                //SUCCESS
                function (response) {
                    $scope.message = response.data;

                    //Remove deleted user
                    //We could also reload the data
                    //But than our checkboxes values are lost
                    var i = $scope.users.map(function(u) {
                        return u._id
                    }).indexOf(user._id);

                    $scope.users.splice(i, 1);

                    //Remove user from assigned list
                    var index = $scope.assign.users.indexOf(user._id);
                    if (index > -1)
                    {
                        $scope.assign.users.splice(index, 1);
                    }

                },
                //ERROR
                function (error) {
                    $scope.error = error.data;
                }
            );
        };

    };

    app.controller("adminUsersController", adminUsersController);

}());