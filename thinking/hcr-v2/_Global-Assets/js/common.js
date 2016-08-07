define('jquery', [], function () {
    return jQuery;
});
require.config({
    baseUrl: "_Global-Assets/js",
    paths: {
        "async": "vendor/require-async",
        "gmaps": "vendor/gmaps",
        //"jquery": "vendor/jquery.1.11.0.min",
        "underscore": "vendor/underscore-min",
        "backbone": "vendor/backbone-min",
        "fastclick": "vendor/fastclick",
		"query-dom-components": "vendor/query-dom-components",
        "matchmedia": "vendor/match.media",
        "transit":"vendor/jquery_transit_min",
        "mixins": "lib/mixins",
        "modernizr": "vendor/modernizr",
        "jquery.hoverIntent": "vendor/jquery.hoverIntent.min",
        "TweenMax": "vendor/TweenMax.min",
		"ScrollToPlugin": "vendor/ScrollToPlugin.min",
        "Tether": "vendor/tether",
        "ActualSelect": "lib/select",
        "DummySelect": "lib/DummySelect",
        "jquery.ba-hashchange": "vendor/jquery.ba-hashchange",
        "jquery.cycle2": "vendor/jquery.cycle2",
        "jquery.cycle2.swipe": "vendor/jquery.cycle2.swipe",
		"hammer": "vendor/hammer.min",
		"jquery-hammer": "vendor/jquery.hammer"
    },
    shim: {
        "underscore": {
            exports: "_"
        },

        "backbone": {
            deps: ["underscore"],
            exports: "Backbone"
        },
        "modernizr": {
            exports: "Modernizr"
        },
        "Tether": {
            exports: "Tether"
        }
    },
    map: {
        '*': {
            'Select': 'lib/selectLoader!'
        }
    }
});

/* if(!window.console) {
    window.console = {};
}
if(!window.console.log) {
    window.console.log = function() {}
}*/