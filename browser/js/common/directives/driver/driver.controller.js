app.controller('DriverController', function ($scope, $state) {
    var socket = io();
    $scope.requestToDrive = function () {
    	socket.emit('requestToDrive');
    };

    socket.on('giveUpDriver', function () {
    	
    });
});
