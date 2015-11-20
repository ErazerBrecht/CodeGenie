(function () {
	
	var app = angular.module("adminApp");
	
    var dashBoardController = function ($scope, restData, $routeParams) {
        
        restData.getAllAnswers.query(function (data) {
            $scope.answers = data;
        });

		
	};
	app.controller("dashBoardController", dashBoardController);
}());