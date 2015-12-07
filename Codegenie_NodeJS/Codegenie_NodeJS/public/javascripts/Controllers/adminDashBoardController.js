(function () {
	
	var app = angular.module("adminApp");
	
    var adminDashBoardController = function ($scope, restData, $routeParams) {
        
        restData.getAllAnswers.query(function (data) {
            $scope.answers = data;
        });

        restData.getNewAnswers.get(function (data)
        {
            $scope.new = data.count;
        });

		
	};
	app.controller("adminDashBoardController", adminDashBoardController);
}());