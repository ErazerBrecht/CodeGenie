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
            getStatisticsMyAnswersGraphWeek: $resource("statistics/users/mine?filter=week"),
            getStatisticsMyAnswersGraphHour: $resource("statistics/users/mine?filter=hour"),
            getRanking: $resource("/statistics/course/:course", { course: '@course'}),
            getNewExercises: $resource("/users/exercises/new"),
            addLastSeen: $resource("users/seen/:exerciseid", { exerciseid: '@exerciseid'})
        };
    };
    
    var module = angular.module("userApp");
    module.factory("userRestData", userRestData);
}());