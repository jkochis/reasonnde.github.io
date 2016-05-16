'use strict'

require('../node_modules/waypoints/lib/noframework.waypoints');

let docStyle = document.body.style;
let bgPath = document.location + 'images/bg/';
let imgExt = '.png';
let bgs = ['WallPaper2', 'WallPaper2_tone', 'WallPaper2.5', 'WallPaper3', 'WallPaper3.5', 'WallPaper4', 'WallPaper4.5', 'WallPaper5.5', 'WallPaper5.5_tone', 'WallPaper6', 'WallPaper6.5', 'WallPaper7.5', 'WallPaper7.5_tone'];
var bgImagesLoaded = false;

new Waypoint({
    element: document.getElementById('waypointHeader'),
    handler: function (direction) {
        //console.log('Scrolled to waypoint 1')
    }
})

// ;(function() {
//     var throttle = function(type, name, obj) {
//         obj = obj || window;
//         var running = false;
//         var func = function() {
//             if (running) { return; }
//             running = true;
//             requestAnimationFrame(function() {
//                 obj.dispatchEvent(new CustomEvent(name));
//                 running = false;
//             });
//         };
//         obj.addEventListener(type, func);
//     };
//
//     /* init - you can init any event */
//     throttle("resize", "optimizedResize");
// })();
//
// // handle event
// window.addEventListener("optimizedResize", function() {
//     console.log("Resource conscious resize callback!");
// });


// Utility
// setup waypoints
let defineWaypoints = function () {
    window.waypoints = [];
    let waypointUnit = Math.floor((document.querySelector('.wrapper').clientHeight / bgs.length));
    bgs.forEach(function (element, index) {
        console.log(waypointUnit * (index + 1));
        window.waypoints[index] = new Waypoint({
            element: document.getElementById('waypointHeader'),
            handler: function (direction) {
                console.log(`loading ${bgs[index]} from loop function`); //test
                direction === 'down' ? loadBg(index + 1) : loadBg(index);
            },
            offset: waypointUnit * (index + 1) * -1
        })
    })
}();
// preload images
if (bgImagesLoaded !== true) {
    bgs.forEach(function (bg) {
        new Image().src = bgPath + bg + imgExt;
        // caches images, avoiding white flash between background replacements
    });
    bgImagesLoaded = true;
}
// load bg image
const loadBg = function (bg) {
    docStyle.backgroundImage = `url(${bgPath}${bgs[bg]}${imgExt})`;
    console.log(`loading ${bgPath}${bgs[bg]}${imgExt}`)
}
//////////////////////////
// business select buttons
//////////////////////////
let businessSelect = document.querySelectorAll('.business-type-select');
Array.prototype.slice.call(businessSelect).forEach(function(el){
    el.addEventListener('click', function() {
        console.log(el);
        // get the active menu item and turn it off
        let currentActive = document.querySelector('.business-type-select.active');
        if (currentActive) {
            currentActive.classList.remove('active');
        }
        // turn on the new menu item
        el.classList.add('active')
        // show the nav
        let menus = document.querySelectorAll('.hcr-menu');
        for (var i = 0; i < menus.length; i++) {
            menus[i].style.visibility = 'visible';
        }
        foldMenu.accordion(0, 'bottom', function(ev, ori) {
            ori.el.classList.add('open');
            console.log(ev, ori);
        });
    });
});
///////////
// hcr menu
///////////
let foldMenu = new OriDomi(document.querySelector('.hcr-menu'), {
    hPanels: 9,
    ripple: 2,
    shading: 'hard',
    touchEnabled: false
});
// load
foldMenu.foldUp('bottom');

// click



// let foldMenu = new OriDomi(docum ent.querySelector('.hcr-menu'), {
//     //vPanels:         5,     // number of panels when folding left or right (vertically oriented)
//     hPanels:         4,    // number of panels when folding top or bottom
//     touchEnabled: false,
//     // speed:           1200,  // folding duration in ms
//     ripple:          2,     // backwards ripple effect when animating
//     shadingIntesity: .5,    // lessen the shading effect
//     // perspective:     800,   // smaller values exaggerate 3D distortion
//     // maxAngle:        40,    // keep the user's folds within a range of -40 to 40 degrees
//     // shading:         'soft' // change the shading type
// });
// foldMenu.accordion(60, 'top');
// foldMenu.onmouseover = () => {
//     this.unfold();
// }