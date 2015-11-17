(function () {
	var adminApp = angular.module('adminApp', ['ngRoute', 'angularMoment']);

	adminApp.config(function($routeProvider) {
		$routeProvider
			// route for the dashboard
			.when('/', {
				templateUrl: 'views/dashboard.html',
				controller: 'dashBoardController'
			})

			// route for the question page
			.when('/exercise', {
				templateUrl: 'views/exercise.html',
				controller: 'exerciseController'
            })
            .when('/answers', {
                templateUrl: 'views/answers.html',
                controller: 'answersController'
            })
			.otherwise({ redirectTo: "/" });
	});
}());
