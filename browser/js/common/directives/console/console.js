app.directive('console', function () {
    return {
        restrict: "E",
        templateUrl: "js/common/directives/console/console.html",
        link: function (s, e, a) {
            $(function () {
                var jqconsole = $('#console').jqconsole("Hi, check out the Chrome console! -> Cmd+Opt+J \n", '>>> ');
                var startPrompt = function () {
                    // Start the prompt with history enabled.
                    jqconsole.Prompt(true, function (input) {
                        // Output input with the class jqconsole-output.
                        jqconsole.Write(eval(input) + '\n', 'jqconsole-output');
                        // Restart the prompt.
                        startPrompt();
                    });
                };
                startPrompt();
                var resetBtn = angular.element(document.getElementById('reset'));
                resetBtn.on('click', function (e) {
                	startPrompt();
                });
            });
        }
    };
});
