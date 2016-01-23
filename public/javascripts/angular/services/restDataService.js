(function () {
    
	var restData = function ($resource) {
        return {
            //adminPanel
            getNewAnswers: $resource("/statistics/answers/unrevised"),
            getAnswersStatistics: $resource("/statistics/answers"),
            getStatisticsAnswersGraph: $resource("statistics/graph")
        };             
    };

	var module = angular.module("adminApp");
	module.factory("restData", restData);
}());