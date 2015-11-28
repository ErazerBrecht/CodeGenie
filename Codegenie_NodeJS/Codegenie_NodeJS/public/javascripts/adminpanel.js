$(function () {
    
    $('#side-menu').metisMenu();

});

//Loads the correct sidebar on window load,
//collapses the sidebar on window resize.
// Sets the min-height of #page-wrapper to window size
$(function () {
    $(window).bind("load resize", function () {
        topOffset = 50;
        width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
        if (width < 768) {
            $('div.navbar-collapse').addClass('collapse');
            topOffset = 100; // 2-row-menu
        } else {
            $('div.navbar-collapse').removeClass('collapse');
        }
        
        height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
        height = height - topOffset;
        if (height < 1) height = 1;
        if (height > topOffset) {
            $("#page-wrapper").css("min-height", (height) + "px");
        }
    });
});

(function () {
    var adminApp = angular.module('adminApp', ['ngRoute', 'angularMoment', 'ngResource', 'ngDraggable']);
    
    adminApp.config(function ($routeProvider) {
        $routeProvider
			// route for the dashboard
			.when('/', {
                templateUrl: 'views/dashboard.html',
                controller: 'dashBoardController'
            })

            // route to watch and edit all exercises
            .when('/exercises', {
                templateUrl: 'views/exercises.html',
                controller: 'exercisesController'
            })
			
            // route to add new exercises
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
