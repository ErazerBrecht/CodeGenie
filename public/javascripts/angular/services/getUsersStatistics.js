/**
 * Created by Brecht on 18/01/2016.
 */
angular.module("adminApp").factory("UserStatistics", function ($resource, Users) {
    return {
        query: function () {
            var userData = Users.query();
            userData.forEach(function (user) {
                    console.log(user._id);
                    /*$resource('/statistics/users/:userid', {userid: '@userid'}).query({userid: user._id}, function (statistic) {
                        var punchCard =
                            [
                                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                            ];

                        //Calculate offset of local time with GMT time
                        //DB sends hours back in GMT
                        var offset = -parseInt(((new Date().getTimezoneOffset()) / 60));

                        for (var i = 0; i < statistic.activityHourly.length; i++) {
                            if ((statistic.activityHourly[i].x + offset) > 23)
                                offset -= 24;               //24 equals 0, 25 equals 1, ....

                            else if ((statistic.activityHourly[i].x + offset) < 0)
                                offset += 24;               //-1 equals 23, -2 equals 22, ....

                            punchCard[0][statistic.activityHourly[i].x + offset] = statistic.activityHourly[i].y;
                        }

                        user.punchCardData = punchCard;

                    });
                    */
                });


            return userData;
        }
    }
});
