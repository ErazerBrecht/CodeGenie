(function () {
    
    var app = angular.module("userApp");
    
    var userExercisesController = function ($scope, userRestData, $routeParams) {
        userRestData.getExercises.query(function (data) {
            $scope.exercises = data;
        });

        $scope.select = function (id) {
            $scope.selected = $scope.exercises[id];
        }
        
        

        $scope.initEditors = function() {
            var editor;
            $('.editor').each(function (index) {
                editor = ace.edit(this);
                editor.setTheme("ace/theme/sqlserver");
                editor.getSession().setMode("ace/mode/csharp");
            });
        }
       
    };

    app.controller("userExercisesController", userExercisesController);
    
}());