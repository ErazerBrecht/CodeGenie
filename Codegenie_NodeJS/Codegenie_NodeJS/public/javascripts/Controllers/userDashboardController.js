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

        $scope.ykeys = ["total"];
        $scope.labels = ["Answers"];

        $scope.punchCardData = [
            [12, 17, 10, 20, 0, 12, 12, 12, 12, 20, 12, 10,0,0,0,0,0,0,0,0,0,0,0,37]
        ];
    };

    app.controller("userDashboardController", userDashboardController);
}());