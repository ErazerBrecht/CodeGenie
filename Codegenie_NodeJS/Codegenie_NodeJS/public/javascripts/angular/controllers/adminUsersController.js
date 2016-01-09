(function () {

    var app = angular.module("adminApp");

    var adminUsersController = function ($scope, restData) {

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
                    restData.getUserStatistic.get({ userid: value._id }, function (response) {
                        //This needs to be a 2 dimensional array!!
                        var punchCard =
                            [
                                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                            ];

                        //Calculate offset of local time with GMT time
                        //DB sends hours back in GMT
                        var offset = -parseInt(((new Date().getTimezoneOffset()) / 60));

                        for (var i = 0; i < response.activityHourly.length; i++) {
                            if ((response.activityHourly[i].x + offset) > 23)
                                offset -= 24;               //24 equals 0, 25 equals 1, ....

                            else if ((response.activityHourly[i].x + offset) < 0)
                                offset += 24;               //-1 equals 23, -2 equals 22, ....

                            punchCard[0][response.activityHourly[i].x + offset] = response.activityHourly[i].y;
                        }

                        value.punchCardData = punchCard;

                    });
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
                    ctor();
                },
                function(err){
                    $scope.error = err.data;
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
            //Clear error and message
            $scope.error = null;
            $scope.message = null;

            restData.removedUserById.get({ userid: user._id },
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
                function(err){
                    $scope.error = err.data;
                }
            );
        };

    };

    app.controller("adminUsersController", adminUsersController);

}());