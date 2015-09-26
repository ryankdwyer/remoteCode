app.controller('EditorController', function ($scope, EditorFactory) {
    var socket = io();
    $scope.editor = EditorFactory.editor;
    
    $scope.themes = EditorFactory.themes;
    $scope.languages = EditorFactory.languages;
    $scope.fontSizes = ["10px", "11px", "12px", "13px", "14px", "16px", "18px", "20px", "24px"];

    $scope.changeTheme = function (theme) {
        EditorFactory.changeTheme(theme);
    };
    $scope.changeLanguage = function (language) {
        EditorFactory.changeLanguage(language);
    };

    function createNewRange(eventObj) {
        return new Range(eventObj.start.row, eventObj.start.column, eventObj.end.row, eventObj.end.column);
    }

    socket.on('notDriver', function () {
        console.log('setting to read only');
        $scope.editor.setReadOnly(true);
    });

    socket.on('driver', function () {
        $scope.editor.setReadOnly(false);
    });

    socket.on('editorUpdate', function (data) {
        $scope.editor.setByAPI = true;
        $scope.editor.setValue(data.contents, 1);
        $scope.editor.clearSelection();
        $scope.editor.setByAPI = false;
    });

    $scope.editor.on('change', function () {
        if (!$scope.editor.setByAPI) {
            socket.emit('editorUpdate', {
                contents: $scope.editor.getValue()
            });
        }
    });

    socket.on('fileToRender', function (file) {
        // console.log(file);
        $scope.editor.setByAPI = true;
        $scope.editor.setValue(file, 1);
        $scope.editor.clearSelection();
        $scope.editor.setByAPI = false;
    });

    socket.on('initiateFileSave', function (fileName) {
        var textToSave = new Blob([$scope.editor.getValue()], {type: "text/plain"});
        var downloadLink = document.createElement('a');
        downloadLink.download = fileName;
        downloadLink.innerHTML = 'Download File';
        downloadLink.href = window.URL.createObjectURL(textToSave);
        downloadLink.click();
    });

});
