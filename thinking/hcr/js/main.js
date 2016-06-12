'use strict'

require('../node_modules/waypoints/lib/noframework.waypoints');

let docStyle = document.body.style;
let bgPath = document.location + 'images/bg/';
let imgExt = '.png';
let bgs = ['Feather_WHITE_Updated', 'DuckPrints_Orange'/*, 'WallPaper2.5', 'WallPaper3', 'WallPaper3.5', 'WallPaper4', 'WallPaper4.5', 'WallPaper5.5', 'WallPaper5.5_tone','WallPaper6', 'WallPaper6.5', 'WallPaper7.5', 'WallPaper7.5_tone'*/];
let bgImagesLoaded = false;
let categorySections = ['sm-new-employees-container', 'sm-current-employees-container', 'sm-exiting-employees-container', 'sm-cadillac-tax-container', 'sm-penalties-container', 'sm-benefits-requirements-container', 'sm-voluntary-insurance-container', 'sm-exchanges-container', 'sm-whats-next-container', 'new-employees-container', 'current-employees-container', 'exiting-employees-container', 'cadillac-tax-container', 'penalties-container', 'benefits-requirements-container', 'voluntary-insurance-container', 'exchanges-container', 'whats-next-container'];

const loadWaypoints = function () {
    new Waypoint({
        element: document.getElementById('sm-benefits-requirements'),
        handler: function (direction) {
            console.log(this.element.clientHeight);
            jQuery('#sm-benefits-requirements:not(.shown)').addClass('animated bounceInDown shown');
            jQuery('#sm-benefits-requirements').one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function () {
                jQuery('#sm-benefits-requirements').removeClass('animated bounceInDown');
            });
            //direction === 'down' ? loadBg(index + 1) : loadBg(index);
        },
        offset: function () {
            return window.innerHeight - this.element.clientHeight * 2;
        }
    });

    // Penalties
    new Waypoint({
        element: document.getElementById('sm-penalties'),
        handler: function (direction) {
            console.log(this.element.clientHeight);
            jQuery('#sm-penalties:not(.shown)').addClass('animated zoomInUp shown');
            jQuery('#sm-penalties').one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function () {
                jQuery('#sm-penalties').removeClass('animated zoomInUp  ');
            });
            //direction === 'down' ? loadBg(index + 1) : loadBg(index);
        },
        offset: function () {
            return window.innerHeight - this.element.clientHeight * 2;
        }
    });

    // Cadillac Tax
    new Waypoint({
        element: document.getElementById('sm-cadillac-tax'),
        handler: function (direction) {
            console.log(this.element.clientHeight);
            jQuery('#sm-cadillac-tax:not(.shown)').addClass('animated zoomIn shown');
            jQuery('#sm-cadillac-tax').one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function () {
                jQuery('#sm-cadillac-tax').removeClass('animated zoomIn  ');
            });
            //direction === 'down' ? loadBg(index + 1) : loadBg(index);
        },
        offset: function () {
            return window.innerHeight - this.element.clientHeight * 2;
        }
    });

// Exchanges
    new Waypoint({
        element: document.getElementById('sm-exchanges'),
        handler: function (direction) {
            console.log('here');
            jQuery('#sm-exchanges:not(.shown)').addClass('animated rotateIn shown');
            jQuery('#sm-exchanges').one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function () {
                jQuery('#sm-exchanges').removeClass('animated rotateIn');
            });
            //direction === 'down' ? loadBg(index + 1) : loadBg(index);
        },
        offset: function () {
            return window.innerHeight - this.element.clientHeight * 2;
        }
    });

// voluntary insurance
    new Waypoint({
        element: document.getElementById('sm-voluntary-insurance'),
        handler: function (direction) {
            console.log('here');
            jQuery('#sm-voluntary-insurance:not(.shown)').addClass('animated slideInUp shown');
            jQuery('#sm-voluntary-insurance').one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function () {
                jQuery('#sm-voluntary-insurance').removeClass('animated slideInUp');
            });
            //direction === 'down' ? loadBg(index + 1) : loadBg(index);
        },
        offset: function () {
            return window.innerHeight - this.element.clientHeight * 2;
        }
    });
// what's next insurance
    new Waypoint({
        element: document.getElementById('sm-whats-next'),
        handler: function (direction) {
            console.log('here');
            jQuery('#sm-whats-next:not(.shown)').addClass('animated bounceInUp shown');
            jQuery('#sm-whats-next').one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function () {
                jQuery('#sm-whats-next').removeClass('animated bounceInUp');
            });
            //direction === 'down' ? loadBg(index + 1) : loadBg(index);
        },
        offset: function () {
            return window.innerHeight - this.element.clientHeight * 2;
        }
    });
}

// Utility
// setup waypoints
window.waypoints = [];
categorySections.forEach(function (element, index) {
    console.log(`.${element}`);
    window.waypoints[index] = new Waypoint({
        element: document.querySelector(`.${element}`),
        handler: function (direction) {
            console.log('loading...')
            loadBg(Math.floor(Math.random() * 2));
            //direction === 'down' ? loadBg(index + 1) : loadBg(index);
        },
    })
});

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
    setTimeout(function () {
        docStyle.backgroundImage = `url(${bgPath}${bgs[bg]}${imgExt})`;
        console.log(`loading ${bgPath}${bgs[bg]}${imgExt}`)
    }, 100)
}
//////////////////////////
// business select buttons
//////////////////////////
var businessSelect = jQuery('.business-type-select');
businessSelect.each(function (i, el) {
    console.log(el);
    jQuery(el).on('click', function () {
        console.log(el);
        jQuery('.hcr-menu-item').hide();
        if (el.dataset.business === 'business-50') {
            jQuery('a.sm').parent().show();
        } else {
            jQuery('a.lg').parent().show();
        }
        document.body.classList = '';
        document.body.classList.add(`${el.dataset.business}-active`)
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
        foldMenu.accordion(0, 'top', function (ev, ori) {
            ori.el.classList.add('open');
            console.log(ev, ori);
        });
        let currentVisible = document.querySelector('.business-container.visible');
        if (currentVisible) {
            currentVisible.style.display = 'none';
            currentVisible.classList.remove('visible');
        }
        let sectionToShow = document.querySelector(`.${el.dataset.business}-container`);
        console.log(sectionToShow);
        jQuery(sectionToShow).fadeIn();
        sectionToShow.classList.add('visible');
        jQuery('html, body').animate({
            scrollTop: jQuery(sectionToShow).offset().top
        }, 1000, function () {
            jQuery(sectionToShow).find('h3').addClass('animated').addClass('pulse');
        });
        loadBg(Math.floor(Math.random() * 2) + 0);

        loadWaypoints();

// Utility
// setup waypoints
        window.waypoints = [];
        categorySections.forEach(function (element, index) {
            console.log(`.${element}`);
            window.waypoints[index] = new Waypoint({
                element: document.querySelector(`.${element}`),
                handler: function (direction) {
                    console.log('loading...')
                    loadBg(Math.floor(Math.random() * 2));
                    //direction === 'down' ? loadBg(index + 1) : loadBg(index);
                },
            })
        });
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
let hcrMenuItemLink = jQuery('.hcr-menu-item a');
hcrMenuItemLink.on('click', function (e, el) {
    e.preventDefault();
    console.log(`.${e.target.href.split('#')[1]}`);
    jQuery('html, body').animate({
        scrollTop: jQuery(`.${e.target.href.split('#')[1]}-container`).offset().top - 100
    }, 1000, function () {

    });
})

//scroll
let aArray = []; // create the empty aArray
for (let i = 0; i < hcrMenuItemLink.length; i++) {
    let aChild = hcrMenuItemLink[i];
    let ahref = jQuery(aChild).attr('href');
    aArray.push(ahref);
}
let currentSection = '';
jQuery(window).scroll(function () {
    let windowPos = jQuery(window).scrollTop(); // get the offset of the window from the top of page
    let windowHeight = jQuery(window).height(); // get the height of the window
    let docHeight = jQuery(document).height();

    for (let i = 0; i < aArray.length; i++) {
        let theID = aArray[i].replace('#', '');
        let divPos = jQuery(`.${theID}-container`).offset().top - 200; // get the offset of the div from the top of page
        let divHeight = jQuery(`.${theID}-container`).height(); // get the height of the div in question
        if (windowPos >= divPos && windowPos < (divPos + divHeight)) {
            jQuery(`a[href='#${theID}']`).addClass('active');
        } else {
            jQuery(`a[href='#${theID}']`).removeClass('active');
        }
    }

    if (windowPos + windowHeight == docHeight) {
        if (!jQuery('nav li:last-child a').hasClass('active')) {
            let navActiveCurrent = jQuery('.nav-active').attr('href');
            jQuery(`a[href='${navActiveCurrent}']`).removeClass('active');
            jQuery('nav li:last-child a').addClass('active');
        }
    }

});