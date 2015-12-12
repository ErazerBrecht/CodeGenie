//Loads the correct sidebar on window load,
//collapses the sidebar on window resize.
// Sets the min-height of #page-wrapper to window size
$(function () {
    $(window).bind("load resize", function () {
        var topOffset = 50;
        width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
        if (width < 768) {
            $('div.navbar-collapse').addClass('collapse');
            topOffset = 100; // 2-row-menu
        } else {
            $('div.navbar-collapse').removeClass('collapse');
        }

        var height = document.documentElement.clientHeight - 1;
        height = height - topOffset;
        if (height < 1) height = 1;
        if (height > topOffset) {
            $("#page-wrapper").css("min-height", (height) + "px");
        }
    });
});

(function () {
    
    var userApp = angular.module('userApp', ['ngRoute',  'angularMoment', 'ngResource', 'ui.ace']);
    
    userApp.config(function ($routeProvider) {
        $routeProvider
			// route for the dashboard
			.when('/', {
            templateUrl: 'views/userDashboard.html',
            controller: 'userDashboardController'
            })

            .when('/exercises', {
            templateUrl: 'views/userExercises.html',
            controller: 'userExercisesController'
            })

            .when('/profile', {
                templateUrl: 'views/profile.html',
                controller: 'editProfileController'
            })

            .otherwise({ redirectTo: "/" });
    });
}());