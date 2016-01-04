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
    };

    app.controller("userDashboardController", userDashboardController);
}());