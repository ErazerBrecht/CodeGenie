(function () {

    var app = angular.module("adminApp");



    var adminAnswersController = function ($scope, restData) {

        restData.getExercises.query(function (data) {
            $scope.exercises = data;

        });

        $scope.change = function(answer) {
            if(answer.checkTotalpoints == 0){
                answer.checkTotalpoints = answer.totalPoints;
            }
            else{
                answer.checkTotalpoints = 0;
            }
        };


        addUserNamesToSelected = function () {
            angular.forEach($scope.selected, function (answer) {
                restData.getUserById.get({userid: answer.userid}, function (data) {
                    answer.name = data.name;
                });

            });
            calcTotalPoints();
        };

        calcTotalPoints = function(){
            angular.forEach($scope.selected, function (answer) {
                answer.totalPoints = 0;
                answer.checkTotalpoints = 0;
                angular.forEach(answer.answers, function (a) {
                    answer.totalPoints = answer.totalPoints + parseInt(a.weight);
                });
            });

        }


        $scope.select = function (answer) {
            restData.getAnswersByExerciseid.query({id: answer._id}, function (data) {
                $scope.selected = data;
                addUserNamesToSelected();
            });
        };


        $scope.processForm = function (answer) {
            //Clear error and message
            $scope.error = null;
            $scope.message = null;

            restData.updateAnswerById.save({id: answer._id},answer,
                function(response){
                    $scope.message = response.data;
                },
                function(error){
                    $scope.error = error.data;
                }
            )

            var index = $scope.selected.indexOf(answer);
            if (index > -1)
            {
                $scope.selected.splice(index, 1);
            }
        }
    }
    app.controller("adminAnswersController", adminAnswersController);
}());