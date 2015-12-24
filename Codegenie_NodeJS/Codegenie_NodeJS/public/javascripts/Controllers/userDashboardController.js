(function () {
    
    var app = angular.module("userApp");
    
    var userDashboardController = function ($scope, userRestData, $routeParams) {
        //Arne routeParams maybe...
        userRestData.getUser.get(function (data) {
            $scope.user = data;
            userRestData.getStatisticsAnswers.get(function (data) {
                $scope.totalAnswersCourse = 0;
                $scope.totalAnswers = 0;
                $scope.myAnswers = 0;

                $scope.totalAnswers = data.count;
                $scope.myAnswers = data.myself;
                angular.forEach(data.courses, function(value, key)
                {
                    if(value.course === $scope.user.course)
                        $scope.totalAnswersCourse = value.count;

                });
            });
        });

        userRestData.getStatsticsAnswersGraph.query(function (data)
        {
           $scope.graphAnswers = data;
        });

        $scope.ykeys = ["count"];
        $scope.labels = ["Answers"];
    };

    app.controller("userDashboardController", userDashboardController);
}());