(function () {
    
	var restData = function ($resource) {
        return {
            getUser: $resource("/users/mine"),
            getAllAnswers: $resource("/admin/answers"),
            getUserById: $resource('/admin/user/:userid', {userid: '@userid'})
        };             
    };

	var module = angular.module("adminApp");
	module.factory("restData", restData);
}());