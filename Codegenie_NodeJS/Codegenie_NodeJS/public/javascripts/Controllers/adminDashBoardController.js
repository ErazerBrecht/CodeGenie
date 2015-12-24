(function () {
	
	var app = angular.module("adminApp");
	
    var adminDashBoardController = function ($scope, restData, $routeParams) {
        
        restData.getAllAnswers.query(function (data) {
            $scope.allAnswers = data;
        });

        restData.getNewAnswers.get(function (data)
        {
            $scope.new = data.count;
        });

        restData.getAnswersStatistics.get(function (data)
        {
            $scope.countTotalAnswers = data.count;
            $scope.answerStatistics = data.courses;
        });

        restData.getStatisticsAnswersGraph.query(function (data)
        {
            $scope.graphAnswers = data;
        });

        $scope.ykeys = ["count"];
        $scope.labels = ["Answers"];

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