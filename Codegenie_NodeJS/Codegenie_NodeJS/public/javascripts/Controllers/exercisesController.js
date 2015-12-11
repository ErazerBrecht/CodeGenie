(function () {
    
    var app = angular.module("adminApp");

    var exercisesController = function ($scope, $http, restData, $routeParams) {
        loadData();

        function loadData() {
            restData.getExercises.query(function (data) {
                $scope.exercises = data;
                var addExercise = {};
                addExercise.title = "Add Exercise";
                $scope.exercises.unshift(addExercise);
            });
        };

        $scope.select = function(id) {
            $scope.selected = $scope.exercises[id];
            $scope.selected.deadline = new Date($scope.selected.deadline);
            $scope.error = null;
            $scope.message = null;
        };

        $scope.addButton = function () {
            var question = {};
            if ($scope.selected.questions == null)
                $scope.selected.questions = [];

            $scope.selected.questions.push(question);
        };

        $scope.typeChanged = function(id) {
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
        $scope.toggleCenterAnchor = function () { $scope.centerAnchor = !$scope.centerAnchor }
        $scope.onDropComplete = function (data) {
            var id = $scope.exercises.indexOf(data);
            if(id === 0) {
                $scope.exercises[0] = {};
                $scope.exercises[0].title = "Add Exercise";
            }
            else {
                $scope.DeleteExercise($scope.exercises[id]);
                $scope.exercises.splice(id, 1);
            }
            $scope.selected = null;
        }

        //AJAX Call POST
        $scope.processForm = function () {
            $scope.message = null;
            $scope.error = null;

            if ($scope.selected._id === undefined) {
                $http({
                    method  : 'POST',
                    url     : '/admin/exercises/post/',
                    data    : $scope.selected
                    //responseType: 'text'
                }).then(
                    //SUCCESS
                    function (response) {
                        loadData();     //Reload all exercises, this is done to add new exercise with id from the server...
                        $scope.message = response.data;
                    },
                    //ERROR
                    function (error) {
                        $scope.error = error.data;
                    }
                );
            }

            else{
                $http({
                    method  : 'POST',
                    url     : '/admin/exercises/edit/' + $scope.selected._id,
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
            }
        };

        //AJAX Call Delete
        $scope.DeleteExercise = function(deletedExercise) {
            $scope.message = null;
            $scope.error = null;

            $http({
                method  : 'GET',
                url     : '/admin/exercises/delete/' + deletedExercise._id,
                data    : deletedExercise,
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
        };
    };

    app.controller("exercisesController", exercisesController);
})();