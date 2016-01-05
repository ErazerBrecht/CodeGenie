(function () {
	
	var app = angular.module("adminApp");
	
    var adminDashBoardController = function ($scope, restData, $routeParams) {
        
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
        };

        restData.getAnswersStatistics.get(function (data)
        {
            $scope.countTotalAnswers = data.count;
            $scope.answerStatistics = data.courses;
        });

        restData.getStatisticsAnswersGraph.query(function (data)
        {
            $scope.graphData = [
                {
                    values: data,      //values - represents the array of {x,y} data points
                    key: 'Total answers', //key  - the name of the series.
                    color: '#337ab7',  //color - optional: choose your own line color.
                }
            ];
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

        $scope.getClass = function(statistic)
        {
            switch(statistic.course){
                case "Programming Principles":
                    return "panel-primary";
                    break;
                case "OO":
                    return "panel-yellow"
                    break;
                case "Mobile-dev":
                    return "panel-green"
                    break;
                case "SO4":
                    return "panel-red"
                    break;
            }
        };

	};
	app.controller("adminDashBoardController", adminDashBoardController);
}());