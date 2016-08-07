/* globals define */

'use strict';

define(['jquery', 'TweenMax', 'query-dom-components', 'lib/Env'], function ($, TweenMax, queryDom, Env) {
  var HowItWorks = function() {

    var $el;
    var dom;
    var nbSlides;
    var hasNav;
    var sizeSlides;
    var slideWidth;
    var slideDuration;
    var nbSlidesVisible;
    var slideType;
    var galleryWidth;
    var onClickCallback = null;

    // Mobile-iPad Dragging
    var offsetMax;
    var dragOffset = null;
    var isDragging = false;
    var dragX = 0;

    var currentSlide = 0;
    var thumbMargin = 0;
    var windowW = $(window).width() > 1520 ? 1520 : $(window).width();
    var isMobile = Env.ANDROID || Env.IOS;

    function initialize(options) {
      $el = options.el;
      hasNav = options.hasNav;
      sizeSlides = options.sizeSlides;
      slideType = options.slideType;
      slideDuration = options.slideDuration;
      nbSlidesVisible = options.nbSlidesVisible;
      onClickCallback = options.onClickSlide || null;

      if(Env.IE8) {
        dom = {
          slide: $('.' + options.prefix + 'slide'),
          arrowLeft: $('.' + options.prefix + 'arrow-left'),
          arrowRight: $('.' + options.prefix + 'arrow-right'),
          nbList: $('.' + options.prefix + 'nb-list'),
          slideCtn: $('.' + options.prefix + 'slide-ctn'),
          mobileNav: $('.' + options.prefix + 'mobile-nav')
        };
      } else {
        dom = queryDom({el: $el, prefix: options.prefix});
      }

      // Initialize nbSlides
      nbSlides = dom.slide.length;

      // If this is not the Real Life Examples
      if(sizeSlides) {
				initSlidesSize();
      } else {
        if(isMobile) {
          TweenMax.set($('.ev_rl-slider'), {
            width: '100%'
          });

          placeThumbs();
        }
      }

      updateMobileNav();

      // Init slide width depending on slide type
      initSlideWidth();

      // Initialize GalleryWidth
      initGalleryWidth();

      // DOM Events, mobile & desktop
      if(isMobile) {
        domMobileEvents();
      } else {
        domDesktopEvents();
      }
    }

    function placeThumbs() {
      if($(window).width() <= 375) {

        dom.slide.removeClass('is-tablet');          

        var thumbWidth = $el.find('.ev_rl-slider--thumb').innerWidth();
        var margin = $(window).width() - thumbWidth;

        thumbMargin = margin + 20;

        TweenMax.set($el.find('.ev_rl-slider--thumb'), {
          marginLeft: margin / 2 + 20,
          marginRight: margin / 2
        });        

        nbSlidesVisible = 1;
      } else {
        dom.slide.addClass('is-tablet');

        var thumbs = $el.find('.ev_rl-slider--thumb');
        var thumbWidth = thumbs.innerWidth() * 4;
        var margin = $(window).width() - thumbWidth;

        thumbMargin = margin + 20;

        TweenMax.set(thumbs, { marginLeft: 0, marginRight: 0 });    

        TweenMax.set(thumbs.eq(0), {
          marginLeft: margin / 2 + 10
        });     

        TweenMax.set(thumbs.eq(3), {
          marginRight: margin / 2
        });        

        nbSlidesVisible = 6;
      }
    }

    function resize() {
      windowW = $(window).width() > 1520 ? 1520 : $(window).width();

      // Set slide to 0
      resetSlide();

      if(sizeSlides) {
        initSlidesSize();
      } else {
        if(isMobile) {
          placeThumbs();          
        }
      }

      initSlideWidth();
      initGalleryWidth();
      updateArrows();
    }

    function scroll() {}

    function domDesktopEvents() {
      dom.arrowLeft.on('click touchstart', moveWithArrow);
      dom.arrowRight.on('click touchstart', moveWithArrow);

      if(hasNav) {
				dom.nbList.find('li').on('click touchstart', moveWithThumb);
      }
    }

    function domMobileEvents() {
      dom.arrowLeft.on('touchstart', moveWithArrow);
      dom.arrowRight.on('touchstart', moveWithArrow);

      var ctnVanilla = dom.slideCtn[0];
      ctnVanilla.addEventListener('touchstart', toggleDrag);
      ctnVanilla.addEventListener('touchend', stopDrag);
      ctnVanilla.addEventListener('touchcancel', stopDrag);
      ctnVanilla.addEventListener('touchmove', moveDrag);
    }

    function initSlideWidth() {
      if(slideType === 'full') {
        slideWidth = $(window).width() > 1520 ? 1520 : $(window).width();
      } else {
        if(isMobile) {
          if($(window).width() <= 375) {
            slideWidth = $el.find('.ev_rl-slider--thumb').innerWidth() + thumbMargin;
          } else {
            slideWidth = $el.find('.ev_rl-slider--thumb').innerWidth() * 4 + thumbMargin / 2;          
          }          
        } else {
          slideWidth = $el.find('.ev_rl-slider--thumb').innerWidth() + thumbMargin;
        }
      }
    }

    function initGalleryWidth() {
      galleryWidth = 0;
      for (var i = 0; i < dom.slide.length; i++) {
        var $slide = dom.slide.eq(i);
        galleryWidth += $slide.innerWidth() + thumbMargin;
      }
      dom.slideCtn.width(galleryWidth);
      TweenMax.to(dom.slideCtn, 0.3, {opacity: 1});

      // Set offsetMax
      offsetMax = galleryWidth - $(window).width() - slideWidth;
    }

    function initSlidesSize() {
      for (var i = 0; i < dom.slide.length; i++) {
        var $slide = dom.slide.eq(i);
        $slide.width(windowW);
      }
      TweenMax.to(dom.slide, 0.3, {opacity: 1});
    }

    function moveWithArrow(e) {
      e.preventDefault();
      var $target = $(e.target);
      var direction = ($target.attr('class').indexOf('right') > -1) ? -1 : 1;

      currentSlide -= direction;

      if(currentSlide < 0) {
        currentSlide = 0;
        return;
      }

      if(currentSlide > nbSlides - nbSlidesVisible) {
        currentSlide = nbSlides - nbSlidesVisible;
        return;
      }

      // Move Slider
      moveSlider();
    }

    function moveWithThumb(e) {
      e.preventDefault();
      var thumbIndex = $(e.target).parents('li').index();
      currentSlide = thumbIndex;
      moveSlider();
    }

    function moveSlider() {
			if(hasNav) {
        updateNav();
      }

      updateMobileNav();

      // Update arrows everytime
      updateArrows();

      var newOffset = slideWidth * currentSlide;
      TweenMax.to(dom.slideCtn, slideDuration, { left: -newOffset });

      setOffset(newOffset);
    }

    function updateArrows() {
      if(currentSlide === 0) {
        if(!dom.arrowLeft.hasClass('ev_disabled')) {
          dom.arrowLeft.addClass('ev_disabled');
        }
      } else {
        if(dom.arrowLeft.hasClass('ev_disabled')) {
          dom.arrowLeft.removeClass('ev_disabled');
        }
      }

      if(currentSlide === nbSlides - nbSlidesVisible) {
        if(!dom.arrowRight.hasClass('ev_disabled')) {
          dom.arrowRight.addClass('ev_disabled');
        }
      } else {
        if(dom.arrowRight.hasClass('ev_disabled')) {
          dom.arrowRight.removeClass('ev_disabled');
        }
      }
    }

    function updateNav() {
      // If we are on desktop update current
      if($(window).width() > 1024) {
        var targetPoint = dom.nbList.find('li').eq(currentSlide);
        dom.nbList.find('li.current').removeClass('current');
        targetPoint.addClass('current');
      } else {
        // If we are om mobile update HTML of the first guy
        var target = dom.nbList.find('li').eq(0);
        target.find('.nb').html(currentSlide + 1);
      }
    }

    function resetSlide() {
      currentSlide = 0;
      moveSlider();
    }

    function getOffset() {
      return parseInt(dom.slideCtn.attr('data-offset')) || 0;
    }

    function setOffset(newOffset) {
      dom.slideCtn.attr('data-offset', newOffset);
    }

    //-----------------------------------------------------------
    //----------------Mobile nav---------------------------------
    //-----------------------------------------------------------
    function updateMobileNav() {
      if(dom.mobileNav) {
        var targetPoint = dom.mobileNav.find('span').eq(currentSlide);
        dom.mobileNav.find('span.current').removeClass('current');
        targetPoint.addClass('current');
      }
    }
    //-----------------------------------------------------------
    //----------------Mobile nav---------------------------------
    //-----------------------------------------------------------

    //-----------------------------------------------------------
    //----------------Dragging-----------------------------------
    //-----------------------------------------------------------
    function toggleDrag(event) {
      if(event.currentTarget === dom.slideCtn[0]) {
        isDragging = !isDragging;
        var touches = event.touches[0];
        dragOffset = touches.clientX || touches.pageX;
        dragX = dragOffset;
      }
    }

    function stopDrag(event) {
      event.preventDefault();
      isDragging = false;
      var touches = event.changedTouches[0];
      var endOffset = touches.clientX || touches.pageX;
      var drag = Math.abs(endOffset - dragX);
      var minDrag = 65;

      // If we are dragging, and not only clicking
      if(drag > minDrag) {
        var direction = (endOffset - dragX) > 0 ? -1 : 1;
        var finalOffset = getOffset();
        var finalIndex = Math.round(finalOffset / slideWidth) + direction;

        if(finalIndex < 0) {
          finalIndex = 0;
        }

        if(finalIndex > nbSlides - nbSlidesVisible) {
          finalIndex = nbSlides - nbSlidesVisible;
        }

        currentSlide = finalIndex;
        moveSlider();
      } 

      if(drag === 0) {
        var targetThumb = $(event.target).parents('.ev_rl-slider--thumb');
        if(onClickCallback && targetThumb.length) {
          onClickCallback(targetThumb.index());
        }        
      }
    }

    /**
      * moveDrag
      * toggles the ability to drag the gallery
      */
    function moveDrag(event) {
      if(isDragging) {

        // Determine thumb and Calculate offset x
        var touches = event.touches[0];
        var clientX = touches.clientX || touches.pageX;
        var offsetX = dragOffset - clientX;
        var maxOffset = 15;

        if(Math.abs(offsetX) > maxOffset) {
          event.preventDefault();
          var newOffset = getOffset() + offsetX;

          // If we are in the bounds
          if(newOffset >= 0 && newOffset <= offsetMax) {

            // Move slider
            TweenMax.set(dom.slideCtn, { left: -newOffset });

            // Reset dragOffset
            dragOffset = clientX;

            // Update sliderX
            setOffset(newOffset);
          }
        }
      }
    }
    //------------------------------------------------------------
    //----------------/Dragging-----------------------------------
    //------------------------------------------------------------

    return {
      initialize: initialize,
      resize: resize,
      scroll: scroll
    };
  };

  return HowItWorks;
});
