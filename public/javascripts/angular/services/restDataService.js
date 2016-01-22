(function () {
    
	var restData = function ($resource) {
        return {
            //adminPanel
            editUser: $resource("/users/edit"),
            getUserStatistic: $resource('/statistics/users/:userid', { userid: '@userid' }),
            getNewAnswers: $resource("/statistics/answers/unrevised"),
            getAnswersStatistics: $resource("/statistics/answers"),
            getStatisticsAnswersGraph: $resource("statistics/graph")
        };             
    };

	var module = angular.module("adminApp");
	module.factory("restData", restData);
}());