(function () {

    var app = angular.module("adminApp");

    var answersController = function ($scope, restData, $routeParams, $http) {
        restData.getExercises.query(function (data) {
            $scope.exercises = data;

        });

        $scope.addUserNamesToSelected = function () {
            angular.forEach($scope.selected, function (answer) {
                restData.getUserById.get({userid: answer.userid}, function (data) {
                    answer.name = data.name;
                });

            });
        };

        $scope.select = function (answer) {
            restData.getAnswersByExerciseid.query({id: answer._id}, function(data){
                $scope.selected = data;
                $scope.addUserNamesToSelected();
            });
        };

        /*$scope.processForm = function () {
         //Clear error and message
         $scope.error = null;
         $scope.message = null;

         $scope.selected.exerciseid = $scope.selected._id;

         $http({
         method  : 'POST',
         url     : '/users/answer/',
         data    : $scope.selected,
         responseType: 'text'
         }).then(
         //SUCCESS
         function (response) {
         $scope.message = response.data;
         },
         //ERROR
         function (error) {
         $scope.error = error.data;
         }
         );

         };*/


    }
    app.controller("answersController", answersController);
}());