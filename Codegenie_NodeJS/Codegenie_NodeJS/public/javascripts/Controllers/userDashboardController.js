(function () {
    
    var app = angular.module("userApp");
    
    var userDashboardController = function ($scope, userRestData) {
        userRestData.getStatisticsMyAnswersGraphWeek.get(function (data)
        {
            $scope.logins = data.logins.mylogins;
            $scope.loginsAverage = data.logins.average;
            $scope.myAnswers = data.received.length;

            //Chart data should be sent as an array of series objects.
            $scope.graphData = [
                {
                    values: data.activity,      //values - represents the array of {x,y} data points
                    key: 'Your answers', //key  - the name of the series.
                    color: '#5cb85c',  //color - optional: choose your own line color.
                }
            ];
        });

        userRestData.getStatisticsMyAnswersGraphHour.get(function (data)
        {
            //This needs to be a 2 dimensional array!!
            $scope.punchCardData = [
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
            ];

            angular.forEach(data.activity, function (value, key) {
                $scope.punchCardData[0][value.x] = value.y;
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
    };

    app.controller("userDashboardController", userDashboardController);
}());