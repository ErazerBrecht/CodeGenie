(function () {
	
	var app = angular.module("adminApp");
	
    var adminDashBoardController = function ($scope, restData) {
        
        restData.getAllAnswers.query(function (data) {
            $scope.allAnswers = data;
        });

        restData.getNewAnswers.get(function (data)
        {
            $scope.new = data.count;
            addUserNames();
        });


        function addUserNames() {
            angular.forEach($scope.allAnswers, function (answer) {
                restData.getUserById.get({userid: answer.userid}, function (data) {
                    answer.name = data.name;
                });
            });
        }
        restData.getAnswersStatistics.get(function (data)
        {
            $scope.countTotalAnswers = data.count;
            $scope.answerStatistics = data.courses;
        });

        restData.getStatisticsAnswersGraph.get(function (data)
        {
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

        $scope.getClass = function(statistic)
        {
            switch(statistic.course){
                case "Programming Principles":
                    return "panel-primary";
                    break;
                case "OO":
                    return "panel-yellow";
                    break;
                case "Mobile-dev":
                    return "panel-green";
                    break;
                case "SO4":
                    return "panel-red";
                    break;
            }
        };

	};
	app.controller("adminDashBoardController", adminDashBoardController);
}());