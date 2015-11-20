(function () {
    
    var app = angular.module("adminApp");
    

    var answersController = function ($scope, restData, $routeParams) {
        var userData;
        var len = 0;
        restData.getAllAnswers.query(function (data) {
            $scope.answers = data;
           
          
            len = $scope.answers.length;

            $scope.yolo();
            
        });

        $scope.yolo = function () {
            for (i = 0; i < len; i++) {
                alert($scope.answers[i].userid);
                restData.getUserById.get({ userid: $scope.answers[i].userid }, function (data) {
                    $scope.answers[i].name = data.name;      

                });
            }
        };
        
        
        
    };
    app.controller("answersController", answersController);
}());