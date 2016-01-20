(function () {

    var app = angular.module("adminApp");



    var adminAnswersController = function ($scope, restData, adminRestDAL) {
        //Constructor => Load all exercises
        loadData();

        //Get the exercises from our REST API
        function loadData() {
            //Save exercises in a scope variable
            //Now we can databind to this data!
            $scope.exercises = adminRestDAL.getExercises();
        }

        //checkbox logic
        $scope.change = function(answer) {
            if(answer.checkTotalpoints == 0){
                answer.checkTotalpoints = answer.totalPoints;
                angular.forEach(answer.answers, function(a){
                    a.received = a.weight;
                    a.checkQuestion = true;
                });

            }
            else{
                answer.checkTotalpoints = 0;
                angular.forEach(answer.answers, function(a){
                    a.received = 0;
                    a.checkQuestion = false;
                });
                answer.totalCheck = false;

            }
        };

        $scope.changePoints = function(a, answer){
            if(answer.checkTotalpoints == 0) {
                answer.checkTotalpoints += a.weight;
                a.received = a.weight;
                answer.totalCheck = true;
            }
            else{
                if(a.received != 0){
                    a.received = 0;
                    answer.checkTotalpoints -= a.weight;
                    if(answer.checkTotalpoints == 0){
                        answer.totalCheck = false;
                    }
                }
                else{
                    a.received = a.weight;
                    answer.checkTotalpoints += a.weight;
                }
            }
        };

        $scope.select = function (exercise) {
            $scope.selected = adminRestDAL.getAnswersByExerciseid(exercise);
        };

        $scope.cancel = function () {
            $scope.selected = null;
            $scope.error = null;
            $scope.message = null;
        };

        $scope.getTileClass = function (selected) {
            var tempExercise = selected;

            if (tempExercise.deadline < new Date())
                return "red";

            return "blue";

        };

        $scope.processForm = function () {
            //Clear error and message
            $scope.error = null;
            $scope.message = null;

            angular.forEach($scope.selected, function(answer){
                answer.revised = true;
            });

            restData.postCorrectedAnswers.save($scope.selected,
                function(response){
                    $scope.message = response.data;
                },
                function(error){
                    $scope.error = error.data;
                }
            );

            $scope.selected = undefined;
        }
    };

    var adminAnswerFilter = function()
    {
        return function(items, all, course, extra, expired) {
            var filtered = [];
            var today = new Date();
            if(!all)
                return items;

            angular.forEach(items, function(item){

                if((course == "All" || course == item.course) && (extra == item.extra) && ((!expired && item.deadline > today) || (expired && item.deadline < today))){
                    filtered.push(item);
                }
            });
            return filtered;

        };
    };
    app.controller("adminAnswersController", adminAnswersController);
    app.filter("adminAnswerFilter", adminAnswerFilter);
}());