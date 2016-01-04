(function () {
    
    var app = angular.module("userApp");
    var newAnswer = {};
    
    var userExercisesController = function ($scope, userRestData, $routeParams, $http) {
        $scope.today = new Date();

        userRestData.getExercises.query(function (data) {
            $scope.exercises = data;

            //Convert deadline dates to real date types
            angular.forEach($scope.exercises, function (value, key) {
                value.deadline = new Date(value.deadline);

                if(value.solved)
                {
                    userRestData.getAnswer.get({ exerciseid: value._id }, function (data) {
                        value.answers = data.answers;
                        value.answerDate = new Date(data.created);
                    });
                }
            });
        });



        //Testing ace editor
        $scope.aceLoaded = function(_editor){

        };
        $scope.aceChanged = function(e) {

        };

        $scope.beautify = function() {
            $scope.test = "hallo";
            alert($scope.test);
            var val = $scope.test;
            var array = val.split(/\n/);
            array[0] = array[0].trim();
            val = array.join("\n");
            var options =
            {
                "brace_style": "expand"             //Changed to braces on seperate line => C# STYLE
            }
            $scope.test = js_beautify(val, options);
        }

        $scope.dismissMessage = function () {
            $scope.message = null;
        };

        $scope.select = function (exercise) {
            //Prevent double click
            if($scope.selected === undefined || $scope.selected._id != exercise._id) {
                $scope.selected = exercise;

                //Clear error and message
                $scope.error = null;
                $scope.message = null;

                if (!$scope.selected.solved) {
                    //Convert question object to answer object
                    var questions = $scope.selected.questions;

                    //Rename _id field to questionid
                    angular.forEach(questions, function (value, key) {
                        value.questionid = value._id;
                        delete value._id;
                    });

                    $scope.selected.answers = questions;
                }
            }
        };

        $scope.getTileClass = function (selected) {
            var tempExercise = selected

            if(tempExercise.solved)
            {
                if(tempExercise.answerDate > tempExercise.deadline)
                    return "orange";
                return "green";
            }
            else
            {
                if(tempExercise.deadline < new Date())
                {
                    return "red";
                }
                //TODO Check if the reveal date is newer than the user lastseen date
                //return "blue";
                return "purple";
            }
        };
        
        $scope.processForm = function () {
            //Clear error and message
            $scope.error = null;
            $scope.message = null;

            $scope.selected.exerciseid = $scope.selected._id;

            userRestData.postAnswer.save($scope.selected,
                function(response){
                    $scope.message = response.data;
                },
                function(err){
                    $scope.error = err.data;
                }
            );
        };
    };
    
    app.controller("userExercisesController", userExercisesController);
}());