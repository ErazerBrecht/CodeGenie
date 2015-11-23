(function () {
    
    var userRestData = function ($resource) {
        return {
            
            //userPanel services
            getUser: $resource("/users/mine"),
            getExercises: $resource("/users/exercises")           
        };
    };
    
    var module = angular.module("userApp");
    module.factory("userRestData", userRestData);
}());