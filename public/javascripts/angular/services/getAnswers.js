/**
 * Created by Brecht on 18/01/2016.
 */
angular.module("adminApp").factory("Answers", function ($resource, Users) {
    return {
        query: function()
        {
            var userData = Users.query();
            var answersData = $resource("/admin/answers").query(function (data)
            {
                data.forEach(function (answer) {
                    answer.name = userData.find(function (u) {
                        return u._id === answer.userid;
                    }).name;
                });
            });
            return answersData;
        }
    };
});