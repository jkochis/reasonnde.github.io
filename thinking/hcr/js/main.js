'use strict'

require('../node_modules/waypoints/lib/noframework.waypoints');

let docStyle = document.body.style;
let bgPath = document.location + 'images/bg/';
let imgExt = '.png';
let bgs = ['WallPaper2', 'WallPaper2_tone', 'WallPaper2.5', 'WallPaper3', 'WallPaper3.5', 'WallPaper4', 'WallPaper4.5', 'WallPaper5.5', 'WallPaper5.5_tone','WallPaper6', 'WallPaper6.5', 'WallPaper7.5', 'WallPaper7.5_tone'];
var bgImagesLoaded = false;

new Waypoint({
    element: document.getElementById('waypointHeader'),
    handler: function (direction) {
        //console.log('Scrolled to waypoint 1')
    }
});

// Utility
// setup waypoints
// const defineWaypoints = function () {
//     window.waypoints = [];
//     let waypointUnit = Math.floor((document.querySelector('.wrapper').clientHeight / bgs.length));
//     bgs.forEach(function (element, index) {
//         console.log(waypointUnit * (index + 1));
//         window.waypoints[index] = new Waypoint({
//             element: document.getElementById('waypointHeader'),
//             handler: function (direction) {
//                 console.log(`loading ${bgs[index]} from loop function`); //test
//                 direction === 'down' ? loadBg(index + 1) : loadBg(index);
//             },
//             offset: waypointUnit * (index + 1) * -1
//         })
//     })
// }();
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
        foldMenu.accordion(0, 'top', function(ev, ori) {
            ori.el.classList.add('open');
            console.log(ev, ori);
        });
        let currentVisible = document.querySelector('.business-container.visible');
        if(currentVisible) {
            currentVisible.style.display = 'none';
            currentVisible.classList.remove('visible');
        }
        let sectionToShow = document.querySelector(`.${el.dataset.business}-container`);
        console.log(sectionToShow);
        $(sectionToShow).fadeIn();
        sectionToShow.classList.add('visible');
        jQuery('html, body').animate({
            scrollTop: $(sectionToShow).offset().top
        }, 2000, function() {
            $(sectionToShow).find('h3').addClass('animated').addClass('pulse');
        });
        loadBg(Math.floor(Math.random() * 12) + 0 )
        //defineWaypoints();
    });
});
///////////
// hcr menu
///////////
let foldMenu = new OriDomi(document.querySelector('.hcr-menu'), {
    hPanels: 3,
    ripple: 2,
    shading: 'hard',
    touchEnabled: false
});
// load
foldMenu.foldUp('top');

// click
let hcrMenuItemLink = document.querySelectorAll('.hcr-menu-item a');
Array.prototype.slice.call(hcrMenuItemLink).forEach(function(el){
    el.addEventListener('click', function(ev) {
        ev.preventDefault();
        // get the active menu item and turn it off
        let currentActive = document.querySelector('.hcr-menu-item a.active');
        if (currentActive) {
            currentActive.classList.remove('active');
        }
        // turn on the new menu item
        el.classList.add('active');
        // fold up and show link text
        foldMenu.reveal(60, 'bottom', function(ev, ori) {
            //ori.el.classList.add('open');
            console.log(ev, ori);
            ori.modifyContent(function(el) {
                el.style.backgroundColor = '#000';
            });
        });
    });
});