(function () {
    
    var app = angular.module("userApp");
    
    var userPanelController = function ($scope, userRestData, $routeParams) {
        
        userRestData.getUser.get(function (data) {
            $scope.user = data;
        });

        userRestData.getNewExercises.get(function (data)
        {
            $scope.newExercises = data;
        });

        $scope.discard = function(exercise)
        {
            userRestData.addLastSeen.save({ exerciseid: exercise._id }, function (data) {

            });

            var index = $scope.newExercises.exercises.indexOf(exercise);
            if (index > -1)
            {
                $scope.newExercises.exercises.splice(index, 1);
            }

            $scope.newExercises.count--;
        };
    };
    
    app.controller("userPanelController", userPanelController);

}());