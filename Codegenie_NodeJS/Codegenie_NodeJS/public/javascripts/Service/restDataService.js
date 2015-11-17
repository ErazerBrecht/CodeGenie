(function () {
	
	var restData = function ($http) {
		var getUser = function () {
			return $http.get("/users/mine")
                        .then(function (response) {
							return response.data;
			});
        };
		
		var getAllAnswers = function () {
			return $http.get("/admin/answers")
						.then(function (response) {
							return response.data;
			});
		};
        
        var getUserById = function (userId) {
            return $http.get("/admin/user/" + userId)
                        .then(function (response) {
                            return response.data;
            });
        };

		return {
			getUser: getUser,
            getAllAnswers: getAllAnswers,
            getUserById: getUserById
		}
	};
	var module = angular.module("adminApp");
	module.factory("restData", restData);
}());