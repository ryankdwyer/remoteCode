app.directive('fileUpload', function () {
    return {
        restrict: "E",
        templateUrl: "js/common/directives/fileUpload/fileUpload.directive.html",
        controller: 'FileUploadController'
    };
});
