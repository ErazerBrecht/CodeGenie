(function () {
	
    var app = angular.module("adminApp");

    var exerciseController = function ($scope, restData, $routeParams) {
        $scope.questions = [];

        $scope.ctor = function() {
            $scope.addButton();
        };
        
        //Add new question table into the form
        $scope.addButton = function() {
            var question = {};
            $scope.questions.push(question);
        };
        
        //Remove correct question table from the form
        $scope.removeButton = function (id) {
            $scope.questions.splice(id, 1);
        };

        $scope.ctor();
    };
	
	app.controller("exerciseController", exerciseController);
})();