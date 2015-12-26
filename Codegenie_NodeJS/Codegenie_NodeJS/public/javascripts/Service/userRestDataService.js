(function () {
    
    var userRestData = function ($resource) {
        return {
            
            //userPanel services
            getUser: $resource("/users/mine"),
            editUser: $resource("/users/edit"),
            getExercises: $resource("/users/exercises"),
            getAnswer: $resource("users/exercises/:exerciseid/answers", { exerciseid: '@exerciseid' }),
            postAnswer: $resource("/users/answer"),
            getStatisticsAnswers: $resource("/statistics/answers"),
            getStatsticsAnswersGraph: $resource("statistics/graph"),
        };
    };
    
    var module = angular.module("userApp");
    module.factory("userRestData", userRestData);
}());