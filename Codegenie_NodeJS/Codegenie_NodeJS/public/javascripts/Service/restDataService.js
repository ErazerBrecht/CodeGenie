(function () {
    
	var restData = function ($resource) {
        return {
            
            //adminPanel
            getUser: $resource("/users/mine"),
            getAllAnswers: $resource("/admin/answers"),
            getUserById: $resource('/admin/user/:userid', { userid: '@userid' }),
            getExercises : $resource("/admin/exercises")

        };             
    };

	var module = angular.module("adminApp");
	module.factory("restData", restData);
}());