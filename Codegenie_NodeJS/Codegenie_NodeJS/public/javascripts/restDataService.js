(function () {
	
	var restData = function ($http) {
		var getUser = function () {
			return $http.get("/users/mine")
                        .then(function (response) {
				return response.data;
			});
		};
		
		/*var getRepos = function (user) {
			return $http.get(user.repos_url)
                        .then(function (response) {
				return response.data;
			});
		};*/
		
		return {
			getUser: getUser
			//getRepos: getRepos
		}
	};
	var module = angular.module("adminApp");
	module.factory("restData", restData);
}());