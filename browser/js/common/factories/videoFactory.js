app.factory('VideoFactory', function ($http) {
	function sendJoinRequest (roomInfo) {
		console.log('sending email');
		return $http.post('/email', roomInfo).then(response => response.data);
	}

	return {
		sendJoinRequest
	};
});