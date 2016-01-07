(function () {

    var app = angular.module("adminApp");



    var adminAnswersController = function ($scope, restData) {

        restData.getExercises.query(function (data) {
            $scope.exercises = data;

        });


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
                }
                else{
                    a.received = a.weight;
                    answer.checkTotalpoints += a.weight;
                }
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
                    answer.totalPoints += parseInt(a.weight);
                    answer.checkTotalpoints += a.received;
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
            )

            $scope.selected = undefined;
        }
    }
    app.controller("adminAnswersController", adminAnswersController);
}());