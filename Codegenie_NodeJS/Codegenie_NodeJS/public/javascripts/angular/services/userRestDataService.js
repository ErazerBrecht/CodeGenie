(function () {
    
    var userRestData = function ($resource) {
        return {
            
            //userPanel services
            getUser: $resource("/users/mine"),
            editUser: $resource("/users/edit"),
            getExercises: $resource("/users/exercises"),
            getAnswer: $resource("users/exercises/:exerciseid/answers", { exerciseid: '@exerciseid' }),
            postAnswer: $resource("/users/answers"),
            getStatisticsAnswers: $resource("/statistics/answers"),
            getStatisticsAnswersGraph: $resource("statistics/graph"),
            getStatisticsMyAnswersGraph: $resource("statistics/users/mine"),
            getRanking: $resource("/statistics/course/:course", { course: '@course'}),
            getNewExercises: $resource("/users/exercises/new"),
            addLastSeen: $resource("users/seen/:exerciseid", { exerciseid: '@exerciseid'})
        };
    };
    
    var module = angular.module("userApp");
    module.factory("userRestData", userRestData);
}());