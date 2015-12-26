$(function () {
    
    $('#side-menu').metisMenu();

});

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
    var adminApp = angular.module('adminApp', ['ngRoute', 'angularMoment', 'ngResource', 'ngDraggable','ui.ace', 'ui.checkbox', 'ngAnimate', 'angular.morris-chart']);
    
    adminApp.config(function ($routeProvider) {
        $routeProvider
			// route for the dashboard
			.when('/', {
                templateUrl: 'views/adminDashboard.html',
                controller: 'adminDashBoardController'
            })

            // route to watch and edit the users
            .when('/users', {
                templateUrl: 'views/adminUsers.html',
                controller: 'adminUsersController'
            })

            // route to watch and edit all exercises + add exercises
            .when('/exercises', {
                templateUrl: 'views/adminExercises.html',
                controller: 'adminExercisesController'
            })
            
            .when('/answers', {
                templateUrl: 'views/adminAnswers.html',
                controller: 'adminAnswersController'
            })

           .when('/profile', {
                templateUrl: 'views/adminProfileEdit.html',
                controller: 'adminProfileEditController'
            })
			
            .otherwise({ redirectTo: "/" });
    });
}());
