(function () {

    var app = angular.module("adminApp");

    var adminPanelController = function ($scope, adminRestDAL) {
        $scope.user = adminRestDAL.getMyself();
    };

    app.controller("adminPanelController", adminPanelController);

}());