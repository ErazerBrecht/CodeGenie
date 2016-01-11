(function () {
    
    var app = angular.module("userApp");
    
    var userDashboardController = function ($scope, userRestData) {
        //Get data from REST API
        //statistics/graph
        //Get answers data per week for in graph (x, y) notation
        //Also contains the average score per week in graph notation
        userRestData.getStatisticsMyAnswersGraph.get(function (data)
        {
            $scope.logins = data.logins.mylogins;
            $scope.loginsAverage = data.logins.average;
            $scope.myAnswers = data.received.length;

            //Variable to keep track of maximum amount answers in a week
            var max = 0;

            //Calculate this maximum amount...
            for(var i = 0; i < data.activityWeekly.length; i++)
            {
                if(data.activityWeekly[i].y > max)
                    max = data.activityWeekly[i].y;
            }

            //Options for graph
            //Check documentation of nvd3-angular (krispo)
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
                        "axisLabel": "Percent",           //This doesn't work, I should open a issue on their GitHub...
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
                    key: 'Your answers',              //key  - the name of the series.
                    color: '#5cb85c',                 //color - optional: choose your own line color.
                    type: "bar",
                    yAxis: 1
                },
                {
                    values: data.averageWeekly,      //values - represents the array of {x,y} data points
                    key: 'Your average',             //key  - the name of the series.
                    color: '#f0ad4e',                //color
                    type: "line",
                    yAxis: 2
                }
            ];

            //'Predefined' array layout (model)
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
                else if ((value.x + offset) < 0)
                    offset += 24;               //-1 equals 23, -2 equals 22, ....

                //Update data in the array to the correct value!
                $scope.punchCardData[0][value.x + offset] = value.y;
            });

        });
    };

    app.controller("userDashboardController", userDashboardController);
}());