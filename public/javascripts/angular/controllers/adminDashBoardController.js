(function () {
	
	var app = angular.module("adminApp");
	
    var adminDashBoardController = function ($scope, restData, adminRestDAL) {

        //Get all Answers
        //Future, use/make statistic to get the last 10 of every course
        //Now we load them all, with much Answers this can take a while
        //In the frontend we only show 10...
        $scope.allAnswers = adminRestDAL.getAnswers();

        //Get all unrevised answers to calculate the count.
        //Future, use statistic to get the count
        //Now we load them all, with much Answers this can take a while
        restData.getNewAnswers.get(function (data)
        {
            $scope.new = data.count;
        });

        //Get statics for total answers and total answers per course
        restData.getAnswersStatistics.get(function (data)
        {
            $scope.countTotalAnswers = data.count;
            $scope.answerStatistics = data.courses;
        });

        //Get answers data per week for in graph (x, y) notation
        //Also contains the average score per week in graph notation
        restData.getStatisticsAnswersGraph.get(function (data)
        {
            //Variable to keep track of maximum amount answers in a week
            var max = 0;

            //Calculate this maximum amount...
            for(var i = 0; i < data.graphWeekly.length; i++)
            {
                if(data.graphWeekly[i].y > max)
                    max = data.graphWeekly[i].y;
            }

            //Options for graph
            //Check documentation
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
                    //Use calculated max as max value in y - axis 1.
                    // If we let nvd3 do this automatically, he will use the minimum value in the data array
                    //Which means that there always will be a bar invisible
                    //We want zero as begin point...
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
                        "axisLabel": "Percent",                     //This doesn't work, I should open a issue on their GitHub...
                        tickFormat: function(d){
                            return d3.format(',.f')(d);
                        }
                    },
                }
            };

            //Chart data should be sent as an array of series objects.
            $scope.graphData = [
                {
                    values: data.graphWeekly,           //values - represents the array of {x,y} data points
                    key: 'Total answers',               //key  - the name of the series.
                    color: '#337ab7',                   //color - optional: choose your own bar color.
                    type: "bar",
                    yAxis: 1
                },
                {
                    values: data.graphAverageWeekly,    //values - represents the array of {x,y} data points
                    key: 'Total average',               //key  - the name of the series.
                    color: '#f0ad4e',                   //color
                    type: "line",
                    yAxis: 2
                }
            ];
        });

        //Function to automatically change the colorof the panel
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