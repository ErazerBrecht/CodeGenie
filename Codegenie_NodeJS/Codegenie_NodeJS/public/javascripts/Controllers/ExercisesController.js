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
        $scope.draggableObjects = [{ name: 'one' }, { name: 'two' }, { name: 'three' }];
        $scope.onDropComplete1 = function (data) {
            var id = $scope.draggableObjects.indexOf(data);
            $scope.draggableObjects.splice(id, 1);
        }   
        
        //AJAX Call
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
    };
    
    app.controller("exercisesController", exercisesController);
})();