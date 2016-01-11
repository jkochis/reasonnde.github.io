var portalCarousel = {
    sliding : false,
    currentSlide : 0,
    autoPlay : false,
    slideData : [],
    loadSlide : function(slide) {
        if(jq18(slide).index() !== this.currentSlide && this.sliding === false) {
            portalCarousel.sliding = true;
            var carousel = jq18("<div class='carousel'>");
            // move to position
            jq18(slide).css({
                'left' : '980px',
                'z-index' : '2'
            }).animate({
                'left' : '0',
                'z-index' : '1'
            }, {
                duration : 500, complete : function() {
                    portalCarousel.sliding = false;
                    jq18('.carousel-slide').not(slide).css('z-index', '0');
                }
            });
            portalCarousel.currentSlide = jq18(slide).index();
        }
    },
    buildCarousel : function(data) {
        // create a container element for the slides
        var carouselContainer = jq18('<div>', {class: 'carousel-slides-container'});
        // build each slide for the carousel from JSON
        for (slide in data) {
            var slideHTML = this.buildSlide(data[slide]);
            jq18(carouselContainer).append(slideHTML[0]);
        };
        // create controls to navigate the slides
        var carouselControls = jq18('<ul>', {class: 'carousel-slides-controls'});
        for (var i = 0; i < 4; i++) {
            jq18(carouselControls).append('<li class="carousel-slide-control">');
        };
        jq18(carouselContainer).append(carouselControls);
        return carouselContainer;
    },
    buildSlide : function(data) {
        // slide template
        var slide = jq18('<div>', {
            class : 'carousel-slide',
            attr : {
                'style': 'background-image:url(' + data.image + ')'
            }
        });
        var slideText = jq18('<div>', {
            class : 'carousel-slide-text'
        });
        var slideTitle = jq18('<div>', {
            class : 'carousel-slide-title',
            text : data.title
        });
        var slideCopy = jq18('<div>', {
            class : 'carousel-slide-copy',
            text : data.copy
        });
        var slideLink = jq18('<a>', {
            class : 'carousel-slide-link',
            href : data.link,
            text : 'more >>'
        });
        slideText.prepend(slideTitle, [slideCopy, slideLink])
        slide.prepend(slideText);
        return slide;
    },
    init : function() {
        return this.buildCarousel(this.slideData);
    },
    // use static data for slides to get started
    slideData : [
        {image : './Synthesis51_files/EMA25D_02_Gallery_E_p_8503JS.jpg', title: 'EMA CELEBRATES ONE YEAR AT DRYDOCK OFFICES', copy: 'Litatqui aut odis res voluptati doluptatur, quibernam fuga. Nam facessit lanim et amus. Parunti ut poratur epudist occulpa cus. Icit eatempor dolupta tiossed modis iliquam qui sum non sequiat quam fuga. Ut officaecti aut exceprepud arunt il est.', link: 'link1'},
        {image : './Synthesis51_files/Republic_Square_Ped_2Night.jpg', title: 'LOREM CELEBRATES ONE YEAR AT DRYDOCK OFFICES', copy: 'Litatqui aut odis res voluptati doluptatur, quibernam fuga. Nam facessit lanim et amus. Parunti ut poratur epudist occulpa cus. Icit eatempor dolupta tiossed modis iliquam qui sum non sequiat quam fuga. Ut officaecti aut exceprepud arunt il est.', link: 'link2'},
        {image : './Synthesis51_files/LINQ_28_SpaLounge_A_np_8483AB.jpg', title: 'IPSUM CELEBRATES ONE YEAR AT DRYDOCK OFFICES', copy: 'Litatqui aut odis res voluptati doluptatur, quibernam fuga. Nam facessit lanim et amus. Parunti ut poratur epudist occulpa cus. Icit eatempor dolupta tiossed modis iliquam qui sum non sequiat quam fuga. Ut officaecti aut exceprepud arunt il est.', link: 'link3'},
        {image : './Synthesis51_files/SPRTSQ_VIEW.jpg', title: 'DOLOR CELEBRATES ONE YEAR AT DRYDOCK OFFICES', copy: 'Litatqui aut odis res voluptati doluptatur, quibernam fuga. Nam facessit lanim et amus. Parunti ut poratur epudist occulpa cus. Icit eatempor dolupta tiossed modis iliquam qui sum non sequiat quam fuga. Ut officaecti aut exceprepud arunt il est.', link: 'link4'}
    ]
}
// setup the carousel
jq18(document).ready(function() {
    // create the carousel element and put the slides in
    var carousel = jq18("<div class='carousel'>");
    carousel.html(portalCarousel.init());
    // plunk it at the top of the content box
    cb = jq18('#contentBox').prepend(carousel);
    cb.css('margin-top', '0');
    jq18('.carousel-slide-control:eq(0)').addClass('active');
    portalCarousel.autoPlay = true;
    jq18('.carousel-slide:eq(0)').css('z-index', 1);
    // handle clicks on carousel controls
    jq18('.carousel-slide-control').on('click', function(e) {
        jq18('.carousel-slide-control').not(this).removeClass('active');
        jq18(this).addClass('active');
        index = jq18('.carousel-slide-control').index(this);
        portalCarousel.loadSlide(jq18('.carousel-slide:eq('+index+')'));
        if (!e.isTrigger) {
            clearInterval(autoplay);
        }
    });
    autoplay = setInterval(function() {
        var $cur = jq18('.carousel-slide-control.active').removeClass('active');
        var $next = $cur.next().length?$cur.next():jq18('.carousel-slide-control:eq(0)');
        $next.click();
    }, 6500);
});








