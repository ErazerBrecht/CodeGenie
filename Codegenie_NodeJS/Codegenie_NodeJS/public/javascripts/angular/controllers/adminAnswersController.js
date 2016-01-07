(function () {

    var app = angular.module("adminApp");



    var adminAnswersController = function ($scope, restData) {

        restData.getExercises.query(function (data) {
            $scope.exercises = data;

        });

        $scope.change = function(answer) {
            if(answer.checkTotalpoints == 0){
                answer.checkTotalpoints = answer.totalPoints;
                angular.forEach(answer.answers, function(a){

                    a.received = a.weight;
                });
            }
            else{
                answer.checkTotalpoints = 0;
                angular.forEach(answer.answers, function(a){
                    a.received = 0;
                });
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
                    if(a.comment == undefined){
                        a.comment = "";
                    };
                });
            });

        }


        $scope.select = function (answer) {
            restData.getAnswersByExerciseid.query({id: answer._id}, function (data) {
                $scope.selected = data;
                addUserNamesToSelected();
            });
        };


        $scope.processForm = function () {
            //Clear error and message
            $scope.error = null;
            $scope.message = null;

            restData.postCorrectedAnswers.save($scope.selected,
                function(response){
                    $scope.message = response.data;
                },
                function(error){
                    $scope.error = error.data;
                }
            )

            $scope.selected = undefined;
        }
    }
    app.controller("adminAnswersController", adminAnswersController);
}());