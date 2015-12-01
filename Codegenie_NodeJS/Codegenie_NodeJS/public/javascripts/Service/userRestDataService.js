(function () {
    
    var userRestData = function ($resource) {
        return {
            
            //userPanel services
            getUser: $resource("/users/mine"),
            getExercises: $resource("/users/exercises"),
            postAnswer: $resource("/users/answer", {
                responseType : 'text'
            })           
        };
    };
    
    var module = angular.module("userApp");
    module.factory("userRestData", userRestData);
}());