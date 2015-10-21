'use strict';
var socketio = require('socket.io');
var io = null;

module.exports = function (server) {

    if (io) return io;

    io = socketio(server);
    var driver;
    io.on('connection', function (socket) {
        console.log('user connected', socket.id);

        socket.on('disconnect', function () {
            console.log('a user disconnected');
            if (driver === socket.id) driver = null;
        });

        // if (!driver) {
        //     driver = socket.id;
        //     console.log('driver: ', driver);
        //     socket.broadcast.emit('notDriver');
        // } else {
        //     console.log('emitting not a driver');
        //     // socket.broadcast.emit('driver');
        // }

        socket.on('editorUpdate', function (data) {
            // if (driver === socket.id) {
            //     socket.broadcast.emit('editorUpdate', data);            
            // }
            socket.broadcast.emit('editorUpdate', data);
        });

        socket.on('fileSaveInitiated', function (fileName) {
            // console.log('got the file save on server side');
            socket.emit('initiateFileSave', fileName);
        });

        socket.on('newRoom', function (newRoom) {
            // console.log('emitting new room', newRoom);
            socket.broadcast.emit('newRoomUrl', newRoom);
        });

        socket.on('leaveChat', function () {
            // console.log('leaving room');
            socket.broadcast.emit('leftChat');
        });

        socket.on('requestToDrive', function () {
            // console.log('request to drive made by: ', socket.id);
            driver = socket.id;
        });

        socket.on('fileUploaded', function (file) {
            // console.log(file);
            socket.emit('fileToRender', file);
        });

        socket.on('fileChange', function (file) {
            console.log('from the server', file);
            socket.emit('fileToRender', file.content);
        });

        socket.on('requestToRunFromConsole', function (codeToRun) {
            socket.emit('codeToRunFromConsole', codeToRun);
        });
    });

    return io;

};
