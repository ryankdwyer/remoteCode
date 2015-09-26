app.config(function ($stateProvider) {
    $stateProvider.state('video', {
        url: '/video',
        templateUrl: 'js/video/video.html',
        controller: 'VideoController'
    });
});
