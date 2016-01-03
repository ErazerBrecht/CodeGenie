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
                angular.forEach($scope.users, function(value, key)
                {
                    value.lastseen = new Date(value.lastseen);
                });
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

        $scope.selectAll = function(user)
        {
            angular.forEach($scope.filteredUsers, function(value, key)
            {
                if(!value.checkbox) {
                    value.checkbox = true;
                    $scope.assign.users.push(value._id);
                }
            });
        };

        $scope.courseFilter = function (data) {
            if (data.course === $scope.selectedCourse) {
                return true;
            } else if ($scope.selectedCourse === 'All') {
                return true;
            } else {
                data.checkbox = false;
                var index = $scope.assign.users.indexOf(data._id);
                if (index > -1)
                {
                    $scope.assign.users.splice(index, 1);
                }
                return false;
            }
        };

        $scope.processForm = function () {
            //Clear error and message
            $scope.error = null;
            $scope.message = null;

            restData.postAssignUser.save($scope.assign,
                function(response){
                    $scope.message = response.data;
                    getData();
                },
                function(err){
                    $scope.error = err.data;
                }
            );

            /*$http({
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
            );*/

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
            //Clear error and message
            $scope.error = null;
            $scope.message = null;

            restData.removedUserById.get({ userid: user._id }, function (data) {
                //TODO: RESPONSE!!!
                //Issue #30
                //Arne Schoonvliet
            });

            /*
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
            );*/
        };

    };

    app.controller("adminUsersController", adminUsersController);

}());