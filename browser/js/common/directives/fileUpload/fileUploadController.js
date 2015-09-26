app.controller('FileUploadController', function ($scope, $compile) {
    $scope.files = [{fileName: 'Hey', content:'content'}];
    var socket = io();
    var fileselect = $id("fileselect"),
        filedrag = $id("filedrag"),
        submitbutton = $id("submitbutton");
    
    $scope.emitAndRender = function () {
    	socket.emit('fileChange', $scope.fileToChange);
    };
    
    // getElementById
    function $id(id) {
        return document.getElementById(id);
    }
    
    // output information
    function Output(msg) {
        var m = $id("messages");
        // m.innerHTML = '';
        m.innerHTML = m.innerHTML + msg;
    }
    
    // file select
    fileselect.addEventListener("change", FileSelectHandler, false);
    
    // var xhr = new XMLHttpRequest();
    
    // file drop
    filedrag.addEventListener("dragover", FileDragHover, false);
    filedrag.addEventListener("dragleave", FileDragHover, false);
    filedrag.addEventListener("drop", FileSelectHandler, false);
    filedrag.style.display = "block";
   
    // file drag hover
    function FileDragHover(e) {
        e.stopPropagation();
        e.preventDefault();
        e.target.className = (e.type == "dragover" ? "hover" : "");
    }
    
    // file selection
    function FileSelectHandler(e) {
        // cancel event and hover styling
        FileDragHover(e);
        // fetch FileList object
        var files = e.target.files || e.dataTransfer.files;
        // process all File objects
        for (var i = 0, f; f = files[i]; i++) {
            ParseFile(f);
        }
    }
    
    function ParseFile(file) {
        if (file.type.indexOf("text") === 0) {
            var reader = new FileReader();
            reader.onload = function (e) {
                socket.emit('fileUploaded', e.target.result);
                $scope.files.push({fileName: file.name, content: e.target.result.replace(/</g, "&lt;").replace(/>/g, "&gt;")});
                // Output(
                // 	"<input type='radio' value='" + e.target.result.replace(/</g, "&lt;").replace(/>/g, "&gt;") + "' ng-model='file'> Filename: " + file.name + "<br>"
                //     // "<div class='container'><div class='row'><i class='fa fa-file'><strong> " + file.name + "</strong></i><div class='content' style='display:none;'>" +
                //     // e.target.result.replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</div></div></div>"
                // );
            };
            reader.readAsText(file);
        }
    }
});
