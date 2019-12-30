define('jquery', [], function () {
    return jQuery;
});
require.config({
    paths: {
        //Path for the libraries
       // jquery: '../../_Global-Assets/js/vendor/jquery.min',
		 THREE: 'webGL/Three',
        //Path for the code
        app: 'webGL/app',
        intro: 'webGL/Intro',
        ik: 'webGL/ik',
        utils: 'webGL/Utils'
    }
});
require(['app'], function(app) {
    $(document).ready(function() {
        app.initExperience();
    });
});

