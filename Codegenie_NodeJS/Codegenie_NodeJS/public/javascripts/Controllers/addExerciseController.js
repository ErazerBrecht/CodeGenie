(function () {
    
    var app = angular.module("adminApp");
    
    var addExerciseController = function ($scope, $http, restData, $routeParams) {        
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

        $scope.typeChanged = function(id) {
            if ($scope.exercise.questions[id].type === 'MultipleChoice') {
                $scope.exercise.questions[id].choices = [];
                $scope.addChoice(id);
            } else {
                if ($scope.exercise.questions[id].choices != null)
                    delete $scope.exercise.questions[id].choices;
            }
        };
        
        $scope.addChoice = function (id) {
            var choice = {};
            $scope.exercise.questions[id].choices.push(choice);
        }
        
        $scope.removeChoice = function (questionId, id) {
            $scope.exercise.questions[questionId].choices.splice(id, 1);
            if ($scope.exercise.questions[questionId].choices.length < 1)
                delete $scope.exercise.questions[questionId].choices;
        }
        
        $scope.processForm = function () {
           $scope.exercise.deadline = moment($scope.exercise.deadline).format('DD/MM/YYYY [23:59:59]');     //Change dateformat
           restData.postExercise.save($scope.exercise, function (response) {
                alert("Exercise created");
            });
        };
    };
    
    app.controller("addExerciseController", addExerciseController);
})();