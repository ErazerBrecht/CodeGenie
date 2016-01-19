/**
 * Created by Brecht on 18/01/2016.
 */
angular.module("adminApp").factory("Exercises", function ($resource) {
    var exercisesData;
    return {
        query: function()
        {
            if(!exercisesData)
                exercisesData = $resource("/admin/exercises").query(function(data){
                    //Convert every field that is a date, to a data type
                    data.forEach(function (value, key) {
                        value.deadline = new Date(value.deadline);
                        if(value.revealdate != undefined)
                            value.revealdate = new Date(value.revealdate);
                    });
                });
            return exercisesData;
        },
    };
});