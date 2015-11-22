(function () {
	var adminApp = angular.module('adminApp', ['ngRoute', 'angularMoment', 'ngResource']);

	adminApp.config(function($routeProvider) {
		$routeProvider
			// route for the dashboard
			.when('/', {
				templateUrl: 'views/dashboard.html',
				controller: 'dashBoardController'
			})

			// route for the question page
			.when('/addexercise', {
				templateUrl: 'views/addexercise.html',
				controller: 'addExerciseController'
            })
            .when('/answers', {
                templateUrl: 'views/answers.html',
                controller: 'answersController'
            })
			.otherwise({ redirectTo: "/" });
	});
}());
