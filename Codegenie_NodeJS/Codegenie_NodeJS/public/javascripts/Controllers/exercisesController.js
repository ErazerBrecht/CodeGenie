(function () {
    
    var app = angular.module("adminApp");
    
    var exercisesController = function ($scope, $http, restData, $routeParams) {        
        restData.getExercises.query(function (data) {
            $scope.exercises = data;
        });

        $scope.select = function(id) {
            $scope.selected = $scope.exercises[id];
        }
        
        //Drag and drop
        $scope.centerAnchor = true;
        $scope.toggleCenterAnchor = function () { $scope.centerAnchor = !$scope.centerAnchor }
        $scope.onDropComplete = function (data) {
            var id = $scope.exercises.indexOf(data);
            $scope.selected = $scope.exercises[id];
            $scope.DeleteExercise();
            $scope.exercises.splice(id, 1);
            $scope.selected = null;
        }   
        
        //AJAX Call POST
        $scope.processForm = function () {
            $http({
                method  : 'POST',
                url     : '/admin/exercises/edit/' + $scope.selected._id,
                data    : $scope.selected,
                responseType: 'text'
            }).then(
                //SUCCESS
                function (response) {
                    alert(response.data);
                },
                //ERROR
                function (error) {
                    alert(error.data);
                }
            );
        };
        
        //AJAX Call Delete
        $scope.DeleteExercise = function () {
            $http({
                method  : 'GET',
                url     : '/admin/exercises/delete/' + $scope.selected._id,
                data    : $scope.selected,
                responseType: 'text'
            }).then(
                //SUCCESS
                function (response) {
                    alert(response.data);
                },
                //ERROR
                function (error) {
                    alert(error.data);
                }
            );
        };
    };
    
    app.controller("exercisesController", exercisesController);
})();