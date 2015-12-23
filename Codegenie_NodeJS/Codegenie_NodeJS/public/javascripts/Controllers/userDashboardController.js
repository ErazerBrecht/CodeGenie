(function () {
    
    var app = angular.module("userApp");
    
    var userDashboardController = function ($scope, userRestData, $routeParams) {
        //Arne routeParams maybe...
        userRestData.getUser.get(function (data) {
            $scope.user = data;
            userRestData.getStatisticsAnswers.get(function (data) {
                $scope.totalAnswers = data.count;
                $scope.myAnswers = data.myself;
                angular.forEach(data.courses, function(value, key)
                {
                    if(value.course = $scope.user.course)
                        $scope.totalAnswersCourse = value.count;

                });
            });
        });

        $scope.xkey = 'y';

        $scope.ykeys = ["a", "b"];

        $scope.labels = ["Series A", "Series B"];

        $scope.myModel = [
            { y: "2006", a: 100, b: 90 },
            { y: "2007", a: 75,  b: 65 },
            { y: "2008", a: 50,  b: 40 },
            { y: "2009", a: 75,  b: 65 },
            { y: "2010", a: 50,  b: 40 },
            { y: "2011", a: 75,  b: 65 },
            { y: "2012", a: 100, b: 90 }
        ];

    };

    app.controller("userDashboardController", userDashboardController);
}());