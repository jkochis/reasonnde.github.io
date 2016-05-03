'use strict'

require('../node_modules/waypoints/lib/noframework.waypoints');
//require('./router')

let docStyle = document.documentElement.style;
let bgPath = document.location + 'images/bg/';
let bgs = ['WallPaper1', 'WallPaper1_tone', 'WallPaper1.5', 'WallPaper2', 'WallPaper2_tone', 'WallPaper2.5', 'WallPaper3', 'WallPaper3.5', 'WallPaper4', 'WallPaper4.5', 'WallPaper5', /*'WallPaper5.5',*/ 'WallPaper5.5_tone', 'WallPaper6', 'WallPaper6.5', 'WallPaper7', 'WallPaper7.5', 'WallPaper7.5_tone'];
var bgImagesLoaded = false;

new Waypoint({
    element: document.getElementById('waypointHeader'),
    handler: function(direction) {
        //console.log('Scrolled to waypoint 1')
    }
})

;(function() {
    var throttle = function(type, name, obj) {
        obj = obj || window;
        var running = false;
        var func = function() {
            if (running) { return; }
            running = true;
            requestAnimationFrame(function() {
                obj.dispatchEvent(new CustomEvent(name));
                running = false;
            });
        };
        obj.addEventListener(type, func);
    };

    /* init - you can init any event */
    throttle("resize", "optimizedResize");
})();

// handle event
window.addEventListener("optimizedResize", function() {
    console.log("Resource conscious resize callback!");
});


// Utility
// setup waypoints
let defineWaypoints = function() {
    window.waypoints = [];
    let waypointUnit = Math.floor((document.querySelector('.wrapper').clientHeight / bgs.length));
    bgs.forEach(function (element, index) {
        console.log(waypointUnit * (index + 1));
        window.waypoints[index] = new Waypoint({
            element: document.getElementById('waypointHeader'),
            handler: function (direction) {
                console.log(`loading ${bgs[index]} from loop function`); //test
                direction === 'down' ? loadBg(index+1) : loadBg(index);
            },
            offset: waypointUnit * (index + 1) * -1
        })
    })
}();
// preload images
if(bgImagesLoaded !== true) {
    bgs.forEach(function(bg){
        new Image().src = bgPath + bg + '.svg';
        // caches images, avoiding white flash between background replacements
    });
    bgImagesLoaded = true;
}
// load bg image
var loadBg = function(bg) {
    docStyle.backgroundImage = 'url(' +  bgPath + bgs[bg] + '.svg)';
    console.log('loading ' + bgPath + bgs[bg] + '.svg')
}