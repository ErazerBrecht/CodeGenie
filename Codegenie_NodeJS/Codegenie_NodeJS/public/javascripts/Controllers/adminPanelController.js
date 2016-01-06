(function () {
	
	var app = angular.module("adminApp");
	
	var adminPanelController = function ($scope, restData) {
        
        restData.getUser.get(function (data) {
            $scope.user = data;
        });
	};
	
	app.controller("adminPanelController", adminPanelController);

}());