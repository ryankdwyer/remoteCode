app.directive('editor', function () {
	return {
		restrict: "E",
		templateUrl: "js/common/directives/editor/editor.html",
		controller: "EditorController"
	};
});