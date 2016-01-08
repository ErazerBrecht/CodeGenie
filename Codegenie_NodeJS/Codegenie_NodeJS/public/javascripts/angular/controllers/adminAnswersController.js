(function () {

    var app = angular.module("adminApp");



    var adminAnswersController = function ($scope, restData) {

        restData.getExercises.query(function (data) {
            $scope.exercises = data;

            angular.forEach($scope.exercises, function(value, key)
            {
                value.deadline = new Date(value.deadline);
            });

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

                    if(a.received != 0){
                        a.checkQuestion = true;
                        answer.totalCheck = true;
                    }
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

        $scope.cancel = function () {
            $scope.selected = null;
            $scope.error = null;
            $scope.message = null;
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

    var adminAnswerFilter = function()
    {
        return function(items, course, extra, expired) {
            var filtered = [];
            var today = new Date();

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