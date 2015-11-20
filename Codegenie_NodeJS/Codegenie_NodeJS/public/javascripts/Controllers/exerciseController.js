(function () {
    
    var app = angular.module("adminApp");
    
    var exerciseController = function ($scope, $http, restData, $routeParams) {        
        //Add new question table into the form
        $scope.addButton = function () {
            var question = {};
            if ($scope.exercise == null)
                $scope.exercise = {}
            if ($scope.exercise.questions == null)
                $scope.exercise.questions = [];

            $scope.exercise.questions.push(question);
        };
        
        //Remove correct question table from the form
        $scope.removeButton = function (id) {
            $scope.exercise.questions.splice(id, 1);
            if ($scope.exercise.questions.length < 1) {
                delete $scope.exercise.questions;
            }
        };
        
        $scope.processForm = function () {
            $http({
                method  : 'POST',
                url     : '/admin/exercises/post',
                data    : $scope.exercise, // pass in data as strings   
                responseType: 'text'        
            }).then(
                //SUCCESS
                function(response) {
                    alert(response.data);
                },
                //ERROR
                function(error) {
                    alert(error.data);
                }
            );
        };
    };
    
    app.controller("exerciseController", exerciseController);
})();