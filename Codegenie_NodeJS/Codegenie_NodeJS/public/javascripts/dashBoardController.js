(function () {
	
	var app = angular.module("adminApp");
	
	var dashBoardController = function ($scope, restData, $routeParams) {
		var getAllAnswers = function () {
			restData.getAllAnswers()
					.then(onDataComplete, onError);
		};
		var onDataComplete = function (data) {
			$scope.answers = data;
		};
		var onError = function (response) {
			$scope.error = "Couldn't find the data"
		};
		getAllAnswers();
	};
	app.controller("dashBoardController", dashBoardController);
}());