app.controller("FileDownloadController", function ($scope) {
	// $scope.editor = EditorFactory.editor;
	var socket = io();
	$scope.saveFile = function () {
		var fileName = document.getElementById('inputFileNameToSaveAs').value;
		console.log('fileSaveInitiated', fileName);
		socket.emit('fileSaveInitiated', fileName);
	};
});