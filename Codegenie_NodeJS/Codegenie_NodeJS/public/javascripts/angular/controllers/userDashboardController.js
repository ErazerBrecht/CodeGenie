(function () {
    
    var app = angular.module("userApp");
    
    var userDashboardController = function ($scope, userRestData) {
        userRestData.getStatisticsMyAnswersGraph.get(function (data)
        {
            $scope.logins = data.logins.mylogins;
            $scope.loginsAverage = data.logins.average;
            $scope.myAnswers = data.received.length;

            var max = 0;

            for(var i = 0; i < data.activityWeekly.length; i++)
            {
                if(data.activityWeekly[i].y > max)
                    max = data.activityWeekly[i].y;
            }

            $scope.options = {
                chart: {
                    type: 'multiChart',
                    height: 450,
                    margin : {
                        top: 30,
                        right: 60,
                        bottom: 50,
                        left: 70
                    },
                    yDomain1: [0, max],
                    yDomain2: [0, 100],
                    color: d3.scale.category10().range(),
                    //useInteractiveGuideline: true,
                    duration: 500,
                    xAxis: {
                        "axisLabel": "Week",
                        tickFormat: function(d){
                            return d3.format(',f')(d);
                        }
                    },
                    yAxis1: {
                        "axisLabel": "Exercises",
                        tickFormat: function(d){
                            return d3.format(',.f')(d);
                        }
                    },
                    yAxis2: {
                        "axisLabel": "Percent",
                        tickFormat: function(d){
                            return d3.format(',.f')(d);
                        }
                    },
                }
            };

            //Chart data should be sent as an array of series objects.
            $scope.graphData = [
                {
                    values: data.activityWeekly,      //values - represents the array of {x,y} data points
                    key: 'Your answers', //key  - the name of the series.
                    color: '#5cb85c',  //color - optional: choose your own line color.
                    type: "bar",
                    yAxis: 1
                },
                {
                    values: data.averageWeekly,      //values - represents the array of {x,y} data points
                    key: 'Your average', //key  - the name of the series.
                    color: '#f0ad4e',  //color -
                    type: "line",
                    yAxis: 2
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
                if((value.x + offset) > 23)
                    offset -= 24;               //24 equals 0, 25 equals 1, ....

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