(function () {
    
    var app = angular.module("userApp");
    
    var userPanelController = function ($scope, userRestData) {

        //Get user data like username, e-mail, course
        //Username is used in the top - right corner of our frontend (userpanel.jade)
        userRestData.getUser.get(function (data) {
            $scope.user = data;
        });

        //Get all exercises...
        //Why now?
        //The chance that the user will visit the exercises view is big
        //Otherwise there is not much reason for his login... (maybe he likes punch cards)
        //We wont reload this data when the user open the exercises
        //We will just use this data!
        //This controller is a parent controller of userExercisesController
        //So we are able to get this data without connection to the server again!
        //Why need it here?
        //That's for our notifications, we want to show unseen en unseen revised exercises
        //Previously we used a separate route, but than we loaded the data double.
        //This isn't the case anymore (explanation above)
        userRestData.getExercises.query(function (data) {
            $scope.exercises = data;
            $scope.newExercises = 0;
            $scope.newRevised = 0;

            angular.forEach($scope.exercises, function (value, key) {
                //Convert deadline dates to real date types
                value.deadline = new Date(value.deadline);
                value.revised = false;

                //Calculate amount of unseen exercises
                if(!value.seen)
                    $scope.newExercises += 1;

                //If value is solved immediately add the corresponding answer object
                //The user will be able to check his answers
                if (value.solved) {
                    userRestData.getAnswer.get({exerciseid: value._id}, function (data) {
                        value.answers = data.answers;
                        //Convert date to a real date type!
                        value.answerDate = new Date(data.created);
                        value.revised = data.revised;
                        value.totalpoints = 0;
                        value.totalAvailablePoints = 0;

                        //If the answer is revised, calculated the total received points and the max points
                        //Example: 15/20 => 15 received points, 20 maxpoints (availablepoints)
                        if(value.revised) {
                            angular.forEach(value.answers, function (d, key) {
                                value.totalpoints += d.received;
                                value.totalAvailablePoints += d.weight;
                                //TODO: Add date when answer was revised (needs to be added in back-end)
                            });
                        }

                        //Calculate the amount of revised answers the user didn't check
                        if(!value.revisedseen)
                        $scope.newRevised += 1;
                    });
                }
            });
        });

        //Function to discard the notification of an unseen exercise
        $scope.discard = function(exercise)
        {
            //Change it in our DB
            userRestData.addLastSeenNew.save({ exerciseid: exercise._id }, function (data) {

            });

            //Also change this in local data (no need for reload than)
            var index = $scope.exercises.indexOf(exercise);
            if (index > -1)
            {
                $scope.exercises[index].seen = true;
            }

            $scope.newExercises--;
        };

        //Function to discard the notification of an unseen revised exercise
        $scope.discardRevised = function(exercise)
        {
            //Change it in our DB
            userRestData.addLastSeenRevised.save({ exerciseid: exercise._id }, function (data) {

            });

            //Also change this in local data (no need for reload than)
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