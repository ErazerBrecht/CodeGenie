(function () {
	
	var restData = function ($http) {
		var getUser = function () {
			return $http.get("/users/mine")
                        .then(function (response) {
				return response.data;
			});
		};
		


		return {
			getUser: getUser
		}
	};
	var module = angular.module("adminApp");
	module.factory("restData", restData);
}());