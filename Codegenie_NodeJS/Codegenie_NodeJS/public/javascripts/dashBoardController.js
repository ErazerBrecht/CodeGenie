(function () {
	
	var app = angular.module("adminApp");
	
	var dashBoardController = function ($scope, restData, $routeParams) {
		/*var onUserComplete = function (data) {
			$scope.user = data;
			
			github.getRepos($scope.user)
                 .then(onRepo, onError);
		};
		
		var onRepo = function (data) {
			$scope.repos = data;
		};
		
		var onError = function (response) {
			$scope.error = "Couldn't find the data"
		};
		
		$scope.username = $routeParams.username;
		$scope.selection = "-stargazers_count";
		
		github.getUser($scope.username).then(onUserComplete, onError);*/
	};
	
	app.controller("dashBoardController", dashBoardController);
}());