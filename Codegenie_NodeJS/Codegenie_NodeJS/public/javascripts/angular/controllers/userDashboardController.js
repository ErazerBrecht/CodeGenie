(function () {
    
    var app = angular.module("userApp");
    
    var userDashboardController = function ($scope, userRestData) {
        userRestData.getStatisticsMyAnswersGraph.get(function (data)
        {
            $scope.logins = data.logins.mylogins;
            $scope.loginsAverage = data.logins.average;
            $scope.myAnswers = data.received.length;

            //Chart data should be sent as an array of series objects.
            $scope.graphData = [
                {
                    values: data.activityWeekly,      //values - represents the array of {x,y} data points
                    key: 'Your answers', //key  - the name of the series.
                    color: '#5cb85c',  //color - optional: choose your own line color.
                }
            ];

            //This needs to be a 2 dimensional array!!
            $scope.punchCardData = [
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
            ];

            //Calculate offset of local time with GMT time
            //DB sends hours back in GMT
            var offset = -parseInt(((new Date().getTimezoneOffset())/60));

            angular.forEach(data.activityHourly, function (value, key) {
                $scope.punchCardData[0][value.x + offset] = value.y;
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