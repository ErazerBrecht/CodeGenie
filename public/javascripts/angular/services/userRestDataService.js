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
            addLastSeenNew: $resource("users/seen/new", { exerciseid: '@exerciseid'}),
            addLastSeenRevised: $resource("users/seen/revised", { exerciseid: '@exerciseid'}) // called pressed when viewing revised tile
        };
    };
    
    var module = angular.module("userApp");
    module.factory("userRestData", userRestData);
}());