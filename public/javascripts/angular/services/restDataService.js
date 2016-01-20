(function () {
    
	var restData = function ($resource) {
        return {
            
            //adminPanel
            getUser: $resource("/users/mine"),
            editUser: $resource("/users/edit"),
            getUserById: $resource('/admin/users/:userid', { userid: '@userid' }),
            getUserStatistic: $resource('/statistics/users/:userid', { userid: '@userid' }),
            getNewAnswers: $resource("/statistics/answers/unrevised"),
            getAnswersStatistics: $resource("/statistics/answers"),
            getAnswersByExerciseid: $resource("/admin/exercises/:id/answers", {id: '@id'}),
            getStatisticsAnswersGraph: $resource("statistics/graph"),
            updateAnswerById: $resource("/admin/answers/:id/edit/", {id: '@id'}),
            postCorrectedAnswers: $resource("/admin/answers/edit")
        };             
    };

	var module = angular.module("adminApp");
	module.factory("restData", restData);
}());