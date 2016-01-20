(function () {

    var app = angular.module("adminApp");

    var adminExercisesController = function ($scope, $http, restData, adminRestDAL) {
        //Constructor => Load all exercises
        loadData();

        //Get the exercises from our REST API
        function loadData() {
            //Save exercises in a scope variable
            //Now we can databind to this data!
            $scope.exercises = adminRestDAL.getExercises();
        }

        //Variable for getting the date of today
        //Databindable
        $scope.today = new Date();

        //Function for closing the error / successful messages (response)
        $scope.dismissMessage = function () {
            $scope.message = null;
        };

        //Function for adding a new exercise
        $scope.add = function () {
            //Make new exercise
            $scope.selected = {};
            $scope.selected.deadline = new Date();
            $scope.selected.questions = [];
            $scope.error = null;
            $scope.message = null;
        };

        //Callback (onclick) when you select a existing exercise
        $scope.select = function (exercise) {
            $scope.selected = exercise;
            $scope.error = null;
            $scope.message = null;
        };

        //THIS IS TO SLOWWW! => Unusable
        //Solution: Manually set the error and message to null when changing the exercise...
        //Will execute every time "selected" is changed
        //$scope.$watch('selected', function(newValue, oldValue) {
        //    $scope.error = null;
        //    $scope.message = null;
        //});

        //Callback (onclick) for adding a extra question to the selected exercise
        $scope.addButton = function () {
            var question = {};
            $scope.selected.questions.push(question);
        };

        //Callback (onclick) Remove correct question from the selected exercise. UI aromatically updates (databindig)
        $scope.removeButton = function (id) {
            $scope.selected.questions.splice(id, 1);
            if ($scope.selected.questions.length < 1) {
                delete $scope.selected.questions;
            }
        };


        //Callback, is fired when we change the type of question
        //When we want a multiple choice question, we need to init a new array for storing the choices
        $scope.typeChanged = function (id) {
            if ($scope.selected.questions[id].type === 'MultipleChoice') {
                $scope.selected.questions[id].choices = [];
                $scope.addChoice(id);
            } else {
                if ($scope.selected.questions[id].choices != null)
                    delete $scope.exercise.questions[id].choices;
            }
        };

        //Callback (onclick), Add a new choice to the multiple choice
        $scope.addChoice = function (id) {
            var choice = {};
            $scope.selected.questions[id].choices.push(choice);
        };

        //Callback (onclick), Remove a choice from the multiple choice
        $scope.removeChoice = function (questionId, id) {
            $scope.selected.questions[questionId].choices.splice(id, 1);
            if ($scope.selected.questions[questionId].choices.length < 1)
                delete $scope.selected.questions[questionId].choices;
        };

        $scope.centerAnchor = true;
        $scope.toggleCenterAnchor = function () {
            $scope.centerAnchor = !$scope.centerAnchor
        };

        //Drag and drop
        //Callback when tiles is droped on dropzone
        //This will delete the exercise
        $scope.onDropComplete = function (data) {
            var id = $scope.exercises.indexOf(data);
            $scope.DeleteExercise($scope.exercises[id]);
            $scope.exercises.splice(id, 1);
            $scope.selected = null;
        };

        //Callback (onclick), Cancel current changes, go back to tiles overview
        $scope.cancel = function () {
            $scope.selected = null;
            $scope.error = null;
            $scope.message = null;
        };

        //AJAX Call POST
        //Adding the exercise
        $scope.processForm = function () {
            $scope.message = null;
            $scope.error = null;

            //If id is undefined => selected is new exercise that needs to be added
            if ($scope.selected._id === undefined) {

                adminRestDAL.addExercise($scope.selected)
                    .then(
                        function (response) {
                            $scope.selected = null;
                            $scope.message = response;
                        },
                        function (error) {
                            $scope.error = error;
                        }
                    );
            }

            //If not selected is a existing exercise, that needs to be updated
            else {
                adminRestDAL.updateExercise($scope.selected)
                    .then(
                        function (response) {
                            $scope.message = response;
                        },
                        function (error) {
                            $scope.error = error;
                        }
                    );

            }
        };

        //AJAX Call Delete
        //Deletes an exercise
        $scope.DeleteExercise = function (deletedExercise) {
            $scope.message = null;
            $scope.error = null;

            //TODO: Change this to DAL
            restData.deleteExercise.get({id: deletedExercise._id}, deletedExercise,
                function (response) {
                    $scope.message = response.data;
                },
                function (error) {
                    $scope.error = error.data;
                }
            );
        };

        //Function used by front end to determine color of tile
        $scope.getTileClass = function (exercise) {
            if (exercise.revealed === false)
                return "grey";
            else if (exercise.deadline < new Date())
                return "red";
            return "blue";
        };


        /*
         Unused code:
         Was used for scrolling to the Exercise form
         Still here because maybe one day we'll need it again...
         function scrollToExercise() {
         $location.hash('exerciseRow');
         $anchorScroll();
         };
         */
    };

    app.controller("adminExercisesController", adminExercisesController);
})
();