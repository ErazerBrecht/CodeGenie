(function () {
	
	var app = angular.module("adminApp");
	
	var adminPanelController = function ($scope, restData, $routeParams) {
		
		var getUser = function () {
			restData.getUser()
					.then(onDataComplete, onError);
		};
		
		var onDataComplete = function (data) {
			$scope.user = data;
			
		};
		var onError = function (response) {
			$scope.error = "Couldn't find the data"
		};

		getUser();
	};
	
	app.controller("adminPanelController", adminPanelController);

}());