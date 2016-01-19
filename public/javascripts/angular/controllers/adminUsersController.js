(function () {

    var app = angular.module("adminApp");

    var adminUsersController = function ($scope, restData, adminRestDAL) {

        loadData();

        function loadData() {
            //Loading our userdata
            adminRestDAL.getUsers().$promise.then(function (collection) {
                $scope.users = collection;

                //Add punchard data from statistics API
                //TODO: Still not sure if I need to put this in our DAL!?!?

                collection.forEach(function (user) {
                    restData.getUserStatistic.get({userid: user._id}, function (statistic) {
                        var punchCard =
                            [
                                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                            ];

                        //Calculate offset of local time with GMT time
                        //DB sends hours back in GMT
                        var offset = -parseInt(((new Date().getTimezoneOffset()) / 60));

                        for (var i = 0; i < statistic.activityHourly.length; i++) {
                            if ((statistic.activityHourly[i].x + offset) > 23)
                                offset -= 24;               //24 equals 0, 25 equals 1, ....

                            else if ((statistic.activityHourly[i].x + offset) < 0)
                                offset += 24;               //-1 equals 23, -2 equals 22, ....

                            punchCard[0][statistic.activityHourly[i].x + offset] = statistic.activityHourly[i].y;
                        }

                        user.punchCardData = punchCard;

                    });
                });
            });

            $scope.assign = {};
            $scope.assign.users = [];
        }

        //Filter the users based on course
        $scope.courseFilter = function (data) {
            if (data.course === $scope.selectedCourse) {
                return true;
            } else if ($scope.selectedCourse === 'All') {
                return true;
            } else {
                data.checkbox = false;
                var index = $scope.assign.users.indexOf(data._id);
                if (index > -1) {
                    $scope.assign.users.splice(index, 1);
                }
                return false;
            }
        };

        //Add selected user to array
        //Later we can send this array to back end for changes!
        $scope.checkboxUser = function (user) {
            if (user.checkbox) {
                $scope.assign.users.push(user._id);
            }
            else {
                var index = $scope.assign.users.indexOf(user._id);
                if (index > -1) {
                    $scope.assign.users.splice(index, 1);
                }
            }
        };

        //Select every user.
        $scope.selectAll = function (user) {
            angular.forEach($scope.filteredUsers, function (value, key) {
                //Don't re-add already selected user(s)
                if (!value.checkbox) {
                    value.checkbox = true;
                    $scope.assign.users.push(value._id);
                }
            });
        };

        //Rest call
        //Move users to other course
        //Will change in db
        //Also changes in local list => No need to reload every thing!
        $scope.processForm = function () {
            //Clear error and message
            $scope.error = null;
            $scope.message = null;

            var promise = adminRestDAL.assignUsers($scope.assign);
            promise.then(
                function (response) {
                    $scope.selected = null;
                    $scope.message = response.message;
                },
                function (error) {
                    $scope.error = error;
                }
            );
        };

        $scope.remove = function (user) {
            //Clear error and message
            $scope.error = null;
            $scope.message = null;

            var promise =adminRestDAL.removeUser(user._id);
            promise.then(
                function (response) {
                    //Remove user from assigned list
                    var index = $scope.assign.users.indexOf(user._id);
                    if (index > -1) {
                        $scope.assign.users.splice(index, 1);
                    }
                    $scope.message = response.message;
                },
                function (error) {
                    $scope.error = error;
                }
            );
        };

        //Reset whole assign list + reset every checkbox
        $scope.cancel = function () {
            angular.forEach($scope.users, function (value, key) {
                value.checkbox = false;
            });

            $scope.assign = {};
            $scope.assign.users = [];
        };

    };

    app.controller("adminUsersController", adminUsersController);

}());