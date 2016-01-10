(function () {
    
    var app = angular.module("userApp");
    
    var userPanelController = function ($scope, userRestData) {
        
        userRestData.getUser.get(function (data) {
            $scope.user = data;
        });

        userRestData.getExercises.query(function (data) {
            $scope.exercises = data;
            $scope.newExercises = 0;
            $scope.newRevised = 0;

            angular.forEach($scope.exercises, function (value, key) {
                //Convert deadline dates to real date types
                value.deadline = new Date(value.deadline);
                value.revised = false;

                if(!value.seen)
                    $scope.newExercises += 1;

                if (value.solved) {
                    userRestData.getAnswer.get({exerciseid: value._id}, function (data) {
                        value.answers = data.answers;
                        value.answerDate = new Date(data.created);
                        value.revised = data.revised;
                        value.totalpoints = 0;
                        value.totalAvailablePoints = 0;
                        if(value.revised) {
                            angular.forEach(value.answers, function (d, key) {
                                value.totalpoints += d.received;
                                value.totalAvailablePoints += d.weight;
                            });
                        }

                        if(!value.revisedseen)
                        $scope.newRevised += 1;
                    });
                }
            });
        });

        $scope.discard = function(exercise)
        {
            //Change it in our DB
            userRestData.addLastSeenNew.save({ exerciseid: exercise._id }, function (data) {

            });

            //Also change this in local data
            var index = $scope.exercises.indexOf(exercise);
            if (index > -1)
            {
                $scope.exercises[index].seen = true;
            }

            $scope.newExercises--;
        };

        $scope.discardRevised = function(exercise)
        {
            //Change it in our DB
            userRestData.addLastSeenRevised.save({ exerciseid: exercise._id }, function (data) {

            });

            //Also change this in local data
            var index = $scope.exercises.indexOf(exercise);
            if (index > -1)
            {
                $scope.exercises[index].revisedseen = true;
            }

            $scope.newRevised--;
        };
    };
    
    app.controller("userPanelController", userPanelController);

}());