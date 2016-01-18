/**
 * Created by Brecht on 18/01/2016.
 */
angular.module("adminApp").factory("Users", function ($resource) {
    var userData;
    return {
        query: function()
        {
            if(!userData)
                userData = $resource("/admin/users").query();
            return userData;
        }
    };
});