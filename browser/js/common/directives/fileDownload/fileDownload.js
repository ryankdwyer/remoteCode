app.directive('fileDownload', function () {
	return {
		restrict: "E",
		templateUrl: 'js/common/directives/fileDownload/fileDownload.html',
		controller: 'FileDownloadController'
	};
});