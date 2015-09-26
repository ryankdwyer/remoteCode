app.controller('VideoController', function ($scope, $state) {
    $scope.inRoom = false;
    $scope.localVideo = false;
    // initialize socket
    var socket = io();

    // grab the room from the URL
    var room = location.search && location.search.split('?')[1];
    
    
    if(room) $scope.inRoom = true;

    // create our webrtc connection
    var webrtc = new SimpleWebRTC({
        // the id/element dom element that will hold "our" video
        localVideoEl: 'localVideo',
        // the id/element dom element that will hold remote videos
        remoteVideosEl: '',
        // immediately ask for camera access
        autoRequestMedia: true,
        debug: false,
        detectSpeakingEvents: true,
        autoAdjustMic: false,
        url: "http://localhost:8888/",
    });

    // when it's ready, join if we got a room from the URL
    webrtc.on('readyToCall', function () {
        // you can name it anything
        if (room) {
            webrtc.joinRoom(room);
            $scope.inRoom = true;
        }
    });

    // function showVolume(el, volume) {
    //     if (!el) return;
    //     if (volume < -45) volume = -45; // -45 to -20 is
    //     if (volume > -20) volume = -20; // a good range
    //     el.value = volume;
    // }

    // we got access to the camera
    webrtc.on('localStream', function (stream) {
        var button = document.getElementById('createIt');
        if (button) button.removeAttribute('disabled');
    });

    // we did not get access to the camera
    webrtc.on('localMediaError', function (err) {
        $scope.localVideo = false;
        console.log(err);
    });

    // local screen obtained
    webrtc.on('localScreenAdded', function (video) {
        $scope.localVideo = true;
        video.onclick = function () {
            video.style.width = video.videoWidth + 'px';
            video.style.height = video.videoHeight + 'px';
        };
        document.getElementById('localScreenContainer').appendChild(video);
        $('#localScreenContainer').show();
    });

    // local screen removed
    webrtc.on('localScreenRemoved', function (video) {
        document.getElementById('localScreenContainer').removeChild(video);
        $('#localScreenContainer').hide();
    });

    // a peer video has been added
    webrtc.on('videoAdded', function (video, peer) {
        var remotes = document.getElementById('remotes');
        if (remotes) {
            video.style.height = "150px";
            var container = document.createElement('div');
            container.className = 'videoContainer';
            container.id = 'container_' + webrtc.getDomId(peer);
            container.appendChild(video);

            // suppress contextmenu
            video.oncontextmenu = function () {
                return false;
            };

            // resize the video on click
            video.onclick = function () {
                container.style.width = video.videoWidth + 'px';
                container.style.height = video.videoHeight + 'px';
            };

            // // show the remote volume
            // var vol = document.createElement('meter');
            // vol.id = 'volume_' + peer.id;
            // vol.className = 'volume';
            // vol.min = -45;
            // vol.max = -20;
            // vol.low = -40;
            // vol.high = -25;
            // container.appendChild(vol);

            // show the ice connection state
            if (peer && peer.pc) {
                var connstate = document.createElement('div');
                connstate.className = 'connectionstate';
                container.appendChild(connstate);
                peer.pc.on('iceConnectionStateChange', function (event) {
                    switch (peer.pc.iceConnectionState) {
                        case 'checking':
                            connstate.innerText = 'Connecting to peer...';
                            break;
                        case 'connected':
                        case 'completed': // on caller side
                            // $(vol).show();
                            connstate.innerText = 'Connection established.';
                            break;
                        case 'disconnected':
                            connstate.innerText = 'Disconnected.';
                            break;
                        case 'failed':
                            connstate.innerText = 'Connection failed.';
                            break;
                        case 'closed':
                            connstate.innerText = 'Connection closed.';
                            break;
                    }
                });
            }
            remotes.appendChild(container);
        }
    });
    // a peer was removed
    webrtc.on('videoRemoved', function (video, peer) {
        var remotes = document.getElementById('remotes');
        var el = document.getElementById(peer ? 'container_' + webrtc.getDomId(peer) : 'localScreenContainer');
        if (remotes && el) {
            remotes.removeChild(el);
        }
    });

    // // local volume has changed
    // webrtc.on('volumeChange', function (volume, treshold) {
    //     showVolume(document.getElementById('localVolume'), volume);
    // });
    // // remote volume has changed
    // webrtc.on('remoteVolumeChange', function (peer, volume) {
    //     showVolume(document.getElementById('volume_' + peer.id), volume);
    // });

    // local p2p/ice failure
    webrtc.on('iceFailed', function (peer) {
        var connstate = document.querySelector('#container_' + webrtc.getDomId(peer) + ' .connectionstate');
        console.log('local fail', connstate);
        if (connstate) {
            connstate.innerText = 'Connection failed.';
            fileinput.disabled = 'disabled';
        }
    });

    // remote p2p/ice failure
    webrtc.on('connectivityError', function (peer) {
        var connstate = document.querySelector('#container_' + webrtc.getDomId(peer) + ' .connectionstate');
        console.log('remote fail', connstate);
        if (connstate) {
            connstate.innerText = 'Connection failed.';
            fileinput.disabled = 'disabled';
        }
    });

    // Since we use this twice we put it here
    function setRoom(name) {
        // document.querySelector('form').remove();
        document.getElementById('title').innerText = 'Room: ' + name;
        document.getElementById('subTitle').innerText = 'Link to join: ' + location.href;
        $('body').addClass('active');
    }

    if (room) {
        setRoom(room);
    } else {
        $('form').submit(function () {
            $scope.inRoom = true;
            var val = $('#sessionInput').val().toLowerCase().replace(/\s/g, '-').replace(/[^A-Za-z0-9_\-]/g, '');
            var name = $('#name').val();
            $('#sessionInput').val('');
            $('#name').val('');
            webrtc.createRoom(val, function (err, name) {
                var newUrl = location.pathname + '?' + name;
                var roomObj = {
                    url: newUrl,
                    name: name
                };
                // Insert socket of the path name; 
                socket.emit('newRoom', roomObj);
                if (!err) {
                    history.replaceState({
                        foo: 'bar'
                    }, null, newUrl);
                    setRoom(name);
                } else {
                    console.log(err);
                }
            });
            return false;
        });
    }

    $scope.leaveChat = function () {
        $scope.inRoom = false;
        socket.emit('leavingChat');
        $state.reload('video');
        $state.reload();
    };

    $scope.startLocalVideo = function () {
        $state.localVideo = true;
        window.location.reload();
    };

    // Listen for when people leave chat
    socket.on('leftChat', function () {
        console.log('someone left the chat');
    });

    // listen for new chat rooms
    socket.on('newRoomUrl', function (newRoom) {
        var link = document.createElement('a');
        link.href = 'http://192.168.1.15:1337' + newRoom.url;
        var text = document.createTextNode('Join ' + newRoom.name + "'s room");
        link.appendChild(text);
        document.getElementById('videoRooms').appendChild(link);
        console.log(link);
    });
});
