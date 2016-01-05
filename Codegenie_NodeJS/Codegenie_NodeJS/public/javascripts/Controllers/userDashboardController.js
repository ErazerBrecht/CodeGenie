(function () {
    
    var app = angular.module("userApp");
    
    var userDashboardController = function ($scope, userRestData, $routeParams) {
        userRestData.getStatisticsMyAnswersGraphWeek.get(function (data)
        {
            $scope.logins = data.logins.mylogins;
            $scope.loginsAverage = data.logins.average;
            $scope.myAnswers = data.received.length;
            $scope.graphAnswers = data.activity;
        });

        userRestData.getStatisticsMyAnswersGraphHour.get(function (data)
        {
            $scope.punchCardData = [
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
            ];

            angular.forEach(data.activity, function (value, key) {
                $scope.punchCardData[0][value.filter] = value.total;
            });
        });

        $scope.ykeys = ["total"];
        $scope.labels = ["Answers"];
    };

    app.controller("userDashboardController", userDashboardController);
}());