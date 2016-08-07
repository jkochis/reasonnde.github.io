define('jquery', [], function () {
    return jQuery;
});
require([
 //   "jquery",
    "matchmedia",
    "fastclick",
    "TweenMax",
    "tools/AgentLocator",
    "lib/common_components/FormDropdown",
    "lib/common_components/FormInputText",
    "lib/common_components/FormInputTextAlt",
    "lib/common_components/FormCheckbox",
    "lib/common_components/VideoPlayer",
    "lib/common_components/LightboxModal"
], function (
//$, 
MatchMedia, FastClick, TweenMax,  AgentLocator, DropDown, InputText, InputTextAlt, FormCheckbox, VideoPlayer, LightboxModal) {
    //window.$ = $;

    (function () {
        var lastTime = 0;
        var vendors = ['webkit', 'moz'];
        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame =
                window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame)
            window.requestAnimationFrame = function (callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function () {
                        callback(currTime + timeToCall);
                    },
                    timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };

        if (!window.cancelAnimationFrame)
            window.cancelAnimationFrame = function (id) {
                clearTimeout(id);
            };
    }());

    $(document).ready(function () {
//		console.log("Hello Aflac!");

        $("html").removeClass("no-js");

        FastClick.attach(document.body);

        // Enable :active pseudo class on mobile
        if (document.addEventListener) {
            document.addEventListener("touchstart", function () {
            }, false);
        }

        AgentLocator.build();

        DropDown.build();
        InputText.build();
        InputTextAlt.build();
        FormCheckbox.build();
        LightboxModal.build();
        VideoPlayer.build();
    });

});