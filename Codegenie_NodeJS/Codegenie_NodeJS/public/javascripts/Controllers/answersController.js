(function () {
    
    var app = angular.module("adminApp");
    
    
    var answersController = function ($scope, restData, $routeParams, $http) {
        restData.getAllAnswers.query(function (data) {
            $scope.answers = data;
            $scope.addUserNames();
        });
        
        $scope.addUserNames = function () {
            angular.forEach($scope.answers, function (answer) {
                restData.getUserById.get({ userid: answer.userid }, function (data) {
                    answer.name = data.name;
                });

            });
        };

        $scope.select = function (id) {
            $scope.selected = $scope.answers[id];
            //$scope.selected.deadline = new Date($scope.selected.deadline);
            $scope.error = null;
            $scope.message = null;
        };

        /*$scope.processForm = function () {
            //Clear error and message
            $scope.error = null;
            $scope.message = null;

            $scope.selected.exerciseid = $scope.selected._id;

            $http({
                method  : 'POST',
                url     : '/users/answer/',
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

        };*/

        $scope.centerAnchor = true;
        $scope.toggleCenterAnchor = function () {
            $scope.centerAnchor = !$scope.centerAnchor
        }

        $scope.onDropComplete = function (data) {
            var id = $scope.answers.indexOf(data);
            $scope.DeleteExercise($scope.answers[id]);
            $scope.answers.splice(id, 1);
            $scope.selected = null;
        };

        //AJAX Call Delete
        $scope.DeleteExercise = function (deletedExercise) {
            $scope.message = null;
            $scope.error = null;

            $http({
                method: 'GET',
                url: '/admin/answers/delete/' + deletedExercise._id,
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
            );
        };

        $scope.getTileClass = function (id) {
            //Green when Answers is resolved, red for unresolved
            if ($scope.answers[id].resolved) {
                return "green";
            }

            return "red";

            //TODO Add gray for invisible exercises
        };

    }
    app.controller("answersController", answersController);
}());