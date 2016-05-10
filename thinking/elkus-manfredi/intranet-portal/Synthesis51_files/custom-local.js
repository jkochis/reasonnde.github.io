window.carouselLoaded = false;
var placeCarousel = function() {
    if(window.carouselLoaded === false) {
        if (jq18('#DeltaTopNavigation a.selected').text() === 'HomeCurrently selected') {
            var portalCarousel = {
                currentSlide: 0,
                autoPlay: false,
                slideData: [],
                loadSlide: function (slide) {
                    if (jq18(slide).index() !== this.currentSlide) {
                        portalCarousel.currentSlide = jq18(slide).index();
                        // move to position
                        jq18(slide).css({
                            'left': '980px',
                            'z-index': '2'
                        }).animate({
                            'left': '0',
                            'z-index': '1'
                        }, {
                            duration: 500, complete: function () {
                                jq18('.carousel-slide').not(slide).css('z-index', '0');
                            }
                        });
                    }
                },
                buildCarousel: function (data) {
                    // create a container element for the slides
                    var carouselContainer = jq18('<div>', {class: 'carousel-slides-container'});
                    // build each slide for the carousel from JSON
                    for (slide in data) {
                        var slideHTML = this.buildSlide(data[slide]);
                        jq18(carouselContainer).append(slideHTML[0]);
                    }
                    ;
                    // create controls to navigate the slides
                    var carouselControls = jq18('<ul>', {class: 'carousel-slides-controls'});
                    for (var i = 0; i < data.length; i++) {
                        jq18(carouselControls).append('<li class="carousel-slide-control">');
                    }
                    ;
                    jq18(carouselContainer).append(carouselControls);
                    return carouselContainer;
                },
                buildSlide: function (data) {
                    // slide template
                    var slide = jq18('<div>', {
                        class: 'carousel-slide',
                        attr: {
                            'style': 'background-image:url(' + data.image + ')'
                        }
                    });
                    var slideText = jq18('<div>', {
                        class: 'carousel-slide-text'
                    });
                    var slideCategory = jq18('<a>', {
                        class: 'carousel-slide-category',
                        href: data['category-link'],
                        text: data.category
                    });
                    var slideTitle = jq18('<div>', {
                        class: 'carousel-slide-title',
                        text: data.title
                    });
                    var slideCopy = jq18('<div>', {
                        class: 'carousel-slide-copy',
                        html: data.copy
                    });
                    if (data.link) {
                        var slideLink = jq18('<a>', {
                            class: 'carousel-slide-link',
                            href: data.link,
                            text: 'more >>'
                        });
                    }
                    slideText.prepend(slideCategory, [slideTitle, slideCopy, slideLink])
                    slide.prepend(slideText);
                    return slide;
                },
                init: function (data) {
                    return this.buildCarousel(data);
                }
            };
            // setup the carousel
            var yamlLoc = 'http://reasonn.de/thinking/elkus-manfredi/intranet-portal/Synthesis51_files/';
            //determine if we want the preview JSON
            var slideJSON = document.location.search.indexOf("preview") > -1 ? 'slides-preview.json' : 'slides.json';
            // create the carousel element and put the slides in
            var carousel = jq18("<div class='carousel'>");
            var startAutoplay = function () {
                portalCarousel.autoPlay = true;
                window.autoplay = setInterval(function () {
                    var $cur = jq18('.carousel-slide-control.active');
                    var $next = $cur.next().length ? $cur.next() : jq18('.carousel-slide-control:eq(0)');
                    $next.click();
                }, 6500);
            }
            var stopAutoplay = function (duration) {
                clearInterval(window.autoplay);
                portalCarousel.autoPlay = false;
                if (duration > 0) {
                    clearTimeout(window.pauser);
                    window.pauser = setTimeout(function () {
                        // figure out which slide to load next when timer runs out
                        var $cur = jq18('.carousel-slide-control.active');
                        var $next = $cur.next().length ? $cur.next() : jq18('.carousel-slide-control:eq(0)');
                        $next.click();
                        // turn on autoplay once pause timer runs out
                        startAutoplay();
                    }, duration);
                }
            }
            // load yaml and run thru yaml-to-json parser
            // initialize carousel and attach to DOM
            jq18.get(yamlLoc + slideJSON, function (response) {
                    html = portalCarousel.init(response);
                    carousel.html(html);
                })
                .done(function () {
                    // plunk it at the top of the content box
                    cb = jq18('#contentBox').prepend(carousel);
                    cb.css('margin-top', '0');
                    jq18('.carousel-slide-control:eq(0)').addClass('active');
                    // put the first slide on top
                    jq18('.carousel-slide:eq(0)').css('z-index', 1);
                    window.carouselLoaded = true;
                    // handle clicks on carousel controls and left/right arrow keys
                    jq18('.carousel-slide-control').on('click arrowClick', function (e) {
                        // set index to the control that was clicked and load the slide with the same index
                        var index = jq18('.carousel-slide-control').index(this);
                        portalCarousel.loadSlide(jq18('.carousel-slide:eq(' + index + ')'));
                        // update controls
                        jq18('.carousel-slide-control').not(this).removeClass('active');
                        jq18(this).addClass('active');
                        // if this was not an autoplay event...
                        if (e.type === 'arrowClick' || !e.isTrigger) {
                            // turn off autoplay and/or (re)start pause timer
                            stopAutoplay(15000);

                        }
                    });
                    // handle left and right arrow keypress listeners
                    jq18(document).keyup(function (e) {
                        switch (e.which) {
                            case 39:
                                var $cur = jq18('.carousel-slide-control.active').removeClass('active');
                                // right
                                var $next = $cur.next().length ? $cur.next() : jq18('.carousel-slide-control:eq(0)');
                                $next.trigger('arrowClick');
                                break;
                            case 37:
                                var $cur = jq18('.carousel-slide-control.active').removeClass('active');
                                // left
                                var $prev = $cur.prev().length ? $cur.prev() : jq18('.carousel-slide-control').last();
                                $prev.trigger('arrowClick');
                                break;
                        }
                    });
                    // pause carousel when there's mouse activity over it
                    jq18('.carousel').on('click mouseenter mouseleave mousemove', function (e) {
                        if (e.type === 'arrowClick' || !e.isTrigger) {
                            stopAutoplay(15000);
                        }
                    });
                    // start autoplay onload
                    startAutoplay();
                });
        }
        /* 15 minute page refresh */
        var time = new Date().getTime();
         jq18(document.body).bind("mousedown keypress", function(e) {
             time = new Date().getTime();
         });
    
         function refresh() {
             if(new Date().getTime() - time >= 900000) 
                 window.location.reload(true);
             else 
                 setTimeout(refresh, 5000);
         }
        setTimeout(refresh, 5000);
    }
}
setTimeout(function(){
    placeCarousel();
}, 100);
