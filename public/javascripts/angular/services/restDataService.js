﻿(function () {
    
	var restData = function ($resource) {
        return {
            
            //adminPanel
            getUser: $resource("/users/mine"),
            editUser: $resource("/users/edit"),
            getUserStatistic: $resource('/statistics/users/:userid', { userid: '@userid' }),
            getNewAnswers: $resource("/statistics/answers/unrevised"),
            getAnswersStatistics: $resource("/statistics/answers"),
            getStatisticsAnswersGraph: $resource("statistics/graph"),
            updateAnswerById: $resource("/admin/answers/:id/edit/", {id: '@id'}),
            postCorrectedAnswers: $resource("/admin/answers/edit")
        };             
    };

	var module = angular.module("adminApp");
	module.factory("restData", restData);
}());