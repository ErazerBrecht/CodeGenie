(function () {

    var app = angular.module("userApp");

    var userStatisticsController = function ($scope, userRestData, $routeParams) {
        userRestData.getUser.get(function (data) {
            $scope.user = data;
            userRestData.getStatisticsAnswers.get(function (data) {
                $scope.totalAnswersCourse = 0;
                $scope.totalAnswers = 0;
                $scope.myAnswers = 0;

                $scope.totalAnswers = data.count;
                $scope.myAnswers = data.myself;
                angular.forEach(data.courses, function (value, key) {
                    if (value.course === $scope.user.course)
                        $scope.totalAnswersCourse = value.count;

                });
            });
        });

        $scope.options = {
            "chart": {
                "type": "multiBarChart",
                "height": 450,
                "margin": {
                    "top": 20,
                    "right": 20,
                    "bottom": 40,
                    "left": 55
                },
                "useInteractiveGuideline": true,
                "dispatch": {},
                "xAxis": {
                    "axisLabel": "Week"
                },
                "yAxis": {
                    "axisLabel": "Exercises",
                    "axisLabelDistance": -10
                }
            },
            "title": {
                "enable": false,
                "text": null
            },
            "subtitle": {
                "enable": false,
                "text": null,
                "css": {
                    "text-align": "center",
                    "margin": "10px 13px 0px 7px"
                }
            },
            "caption": {
                "enable": false,
                "html": null,
                "css": {
                    "text-align": "justify",
                    "margin": "10px 13px 0px 7px"
                }
            }
        };

        userRestData.getStatisticsAnswersGraph.query(function (data) {
            //For testing purposes
            var Hardcoded = [
                {
                    x: 50,
                    y: 9
                },
                {
                    x: 51,
                    y: 10
                },
                {
                    x: 52,
                    y: 5
                },
                {
                    x: 1,
                    y: 2
                }
            ]

            //Chart data should be sent as an array of series objects.
            $scope.graphData = [
                {
                    values: data,      //values - represents the array of {x,y} data points
                    key: 'Total', //key  - the name of the series.
                    color: '#337ab7',  //color - optional: choose your own line color.
                },
                {
                    values: Hardcoded,      //values - represents the array of {x,y} data points
                    key: 'Hardcoded ', //key  - the name of the series.
                    color: '#f0ad4e',  //color - optional: choose your own line color.
                }
            ];
        });
    };

    app.controller("userStatisticsController", userStatisticsController);
}());