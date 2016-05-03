define('jquery', [], function () {
    return jQuery;
});
require.config({
    paths: {
        //Path for the libraries
       // jquery: '../../_Global-Assets/js/vendor/jquery.min',
		// THREE: '/_Global-Assets/js/ndp/webGL/Three',
        //Path for the code
        app: '/_Global-Assets/js/ndp/webGL/appNDP',
        intro: '/_Global-Assets/js/ndp/webGL/Intro',
        ik: '/_Global-Assets/js/ndp/webGL/InverseKinematics',
        utils: '/_Global-Assets/js/ndp/webGL/Utils'
    }
});
require(['app'], function(app) {
    $(document).ready(function() {
        app.initExperience();
    });
});