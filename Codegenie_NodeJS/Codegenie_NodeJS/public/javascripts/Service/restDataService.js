(function () {
    
	var restData = function ($resource) {
        return {
            
            //adminPanel
            getUser: $resource("/users/mine"),
            getAllUsers: $resource("/users"),
            getAllAnswers: $resource("/admin/answers"),
            getUserById: $resource('/admin/users/:userid', { userid: '@userid' }),
            removedUserById: $resource('/admin/users/:userid/delete', { userid: '@userid' }),
            getExercises : $resource("/admin/exercises"),
            getNewAnswers: $resource("/statistics/answers/unrevised"),
            getAnswersByExerciseid: $resource("/admin/exercises/:id/answers", {id: '@id'})
            //postExercise: $resource("/admin/exercises/post"),
            //postUpdateExercise: $resource("/admin/exercises/edit/:id", {id: '@id'})
        };             
    };

	var module = angular.module("adminApp");
	module.factory("restData", restData);
}());