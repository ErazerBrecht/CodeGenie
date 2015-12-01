(function () {
	
	var app = angular.module("adminApp");
	
    var dashBoardController = function ($scope, restData, $routeParams) {
        
        restData.getAllAnswers.query(function (data) {
            $scope.answers = data;
        });

        restData.getNewAnswers.get(function (data)
        {
            $scope.new = data.count;
        });

		
	};
	app.controller("dashBoardController", dashBoardController);
}());