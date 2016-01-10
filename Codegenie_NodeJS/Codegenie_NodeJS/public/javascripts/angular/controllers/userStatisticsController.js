(function () {

    var app = angular.module("userApp");

    var userStatisticsController = function ($scope, userRestData) {
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

            //Get ranking
            //Placed it here because, $scope.user.course is already loaded here!
            userRestData.getRanking.get({course: $scope.user.course}, function (data) {
                $scope.rankingScore = data.topReceived;
                $scope.rankingAmount = data.topAmount;
            });
        });

        userRestData.getStatisticsAnswersGraph.get(function (data) {
            var max = 0;

            for(var i = 0; i < data.graphWeekly.length; i++)
            {
                if(data.graphWeekly[i].y > max)
                    max = data.graphWeekly[i].y;
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
                    values: data.graphWeekly,      //values - represents the array of {x,y} data points
                    key: 'Total answers', //key  - the name of the series.
                    color: '#337ab7',  //color - optional: choose your own line color.
                    type: "bar",
                    yAxis: 1
                },
                {
                    values: data.graphAverageWeekly,      //values - represents the array of {x,y} data points
                    key: 'Total average', //key  - the name of the series.
                    color: '#f0ad4e',  //color -
                    type: "line",
                    yAxis: 2
                }
            ];
        });
    };

    app.controller("userStatisticsController", userStatisticsController);
}());