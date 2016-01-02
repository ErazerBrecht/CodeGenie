(function () {

    var app = angular.module("adminApp");

    var adminExercisesController = function ($scope, $http, restData, $anchorScroll, $routeParams) {
        loadData();

        function loadData() {
            restData.getExercises.query(function (data) {
                $scope.exercises = data;

                angular.forEach($scope.exercises, function (value, key) {
                    value.deadline = new Date(value.deadline);
                });
            });
        };

        $scope.today = new Date();

        $scope.dismissMessage = function () {
            $scope.message = null;
        };

        $scope.add = function () {
            $scope.selected = {}
            $scope.selected.deadline = new Date();
            $scope.error = null;
            $scope.message = null;
        };

        $scope.select = function (exercise) {
            $scope.selected = exercise;
            //$scope.selected.deadline = new Date($scope.selected.deadline);
            $scope.error = null;
            $scope.message = null;
        };

        //THIS IS TO SLOWWW!
        //Will execute every time "selected" is changed
        //$scope.$watch('selected', function(newValue, oldValue) {
        //    $scope.error = null;
        //    $scope.message = null;
        //});

        $scope.addButton = function () {
            var question = {};
            if ($scope.selected.questions == null)
                $scope.selected.questions = [];

            $scope.selected.questions.push(question);
        };

        //Remove correct question table from the form
        $scope.removeButton = function (id) {
            $scope.selected.questions.splice(id, 1);
            if ($scope.selected.questions.length < 1) {
                delete $scope.selected.questions;
            }
        };


        $scope.typeChanged = function (id) {
            if ($scope.selected.questions[id].type === 'MultipleChoice') {
                $scope.selected.questions[id].choices = [];
                $scope.addChoice(id);
            } else {
                if ($scope.selected.questions[id].choices != null)
                    delete $scope.exercise.questions[id].choices;
            }
        };

        $scope.addChoice = function (id) {
            var choice = {};
            $scope.selected.questions[id].choices.push(choice);
        };

        $scope.removeChoice = function (questionId, id) {
            $scope.selected.questions[questionId].choices.splice(id, 1);
            if ($scope.selected.questions[questionId].choices.length < 1)
                delete $scope.selected.questions[questionId].choices;
        };

        //Drag and drop
        $scope.centerAnchor = true;
        $scope.toggleCenterAnchor = function () {
            $scope.centerAnchor = !$scope.centerAnchor
        }
        $scope.onDropComplete = function (data) {
            var id = $scope.exercises.indexOf(data);
            $scope.DeleteExercise($scope.exercises[id]);
            $scope.exercises.splice(id, 1);
            $scope.selected = null;
        };

        $scope.cancel = function () {
            $scope.selected = null;
            $scope.error = null;
            $scope.message = null;
        };

        //AJAX Call POST
        $scope.processForm = function () {
            $scope.message = null;
            $scope.error = null;

            if ($scope.selected._id === undefined) {

                restData.postExercise.save($scope.selected,
                    function(response){
                        loadData(); //Reload all exercises, this is done to add new exercise with id from the server... => Otherwise this exercise can't be updated till the page is refreshed
                        $scope.selected = null;
                        $scope.message = response.data;
                    },
                    function(error){
                        $scope.error = error.data;
                    }
                );
            }

            else {

                restData.postUpdateExercise.save({id: $scope.selected._id},$scope.selected,
                    function(response){
                        $scope.message = response.data;
                    },
                    function(error){
                        $scope.error = error.data;
                    }
                );

            }
        };

        //AJAX Call Delete
        $scope.DeleteExercise = function (deletedExercise) {
            $scope.message = null;
            $scope.error = null;

            restData.deleteExercise.get({id: deletedExercise._id}, deletedExercise,
                function(response){
                    $scope.message = response.data;
                },
                function(error){
                    $scope.error = error.data;
                }
            );

            /*$http({
                method: 'GET',
                url: '/admin/exercises/delete/' + deletedExercise._id,
                data: deletedExercise,
                responseType: 'text'
            }).then(
                //SUCCESS
                function (response) {
                    $scope.message = response.data;
                },
                //ERROR
                function (error) {
                    //Scroll to top to show error
                    $anchorScroll();
                    $scope.error = error.data;
                }
            );*/
        };

        $scope.getTileClass = function (exercise) {
            if (exercise.deadline < new Date()) {
                return "red";
            }

            return "blue";

            //TODO Add gray for invisible exercises
        };
    };

    app.controller("adminExercisesController", adminExercisesController);
})
();