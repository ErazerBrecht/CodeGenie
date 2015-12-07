(function () {
    
	var restData = function ($resource) {
        return {
            
            //adminPanel
            getUser: $resource("/users/mine"),
            getAllAnswers: $resource("/admin/answers"),
            getUserById: $resource('/admin/user/:userid', { userid: '@userid' }),
            getExercises : $resource("/admin/exercises"),
            getNewAnswers: $resource("/statistics/answers/unrevised"),
            postExercise: $resource("/admin/exercises/post", {
                responseType : 'text'
            }),
            postUpdateExercise: $resource("/admin/exercises/edit/:id", {id: '@id'})
        };             
    };

	var module = angular.module("adminApp");
	module.factory("restData", restData);
}());