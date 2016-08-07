define('jquery', [], function () {
    return jQuery;
});

/* globals require */

'use strict';

require([
   // 'jquery',
    'matchmedia',
    'fastclick',
    'TweenMax',
    'lib/Env',

    // Taken from Original Site: Sharing
    'widgets/ShareWidget',

    // Taken from Original Site: Testimonial
    'vendor/jquery.cycle2',
    'widgets/Testimonial',

    // Everwell
    'everwell/widgets/EverwellSlider',
    'everwell/widgets/AnchorNav',
    'everwell/widgets/WhyEverwell',
    'everwell/widgets/FactOrFiction',
    'everwell/widgets/RealLifeExamples',
    'lib/common_components/FormInputText',
    'lib/common_components/VideoPlayer',
    'lib/common_components/LightboxModal'
], function (
  //$, 
  MatchMedia, FastClick, TweenMax, Env,
  ShareWidget, cycle, Testimonial,
  everwellSlider, AnchorNav, WhyEverwell, FactOrFiction, RealLifeExamples,
  InputText, VideoPlayer, LightboxModal) {
   // window.$ = $;

    (function () {
        var lastTime = 0;
        var vendors = ['webkit', 'moz'];
        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame =
                window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame)
            window.requestAnimationFrame = function (callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function () {
                        callback(currTime + timeToCall);
                    },
                    timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };

        if (!window.cancelAnimationFrame)
            window.cancelAnimationFrame = function (id) {
                clearTimeout(id);
            };
    }());

    $(document).ready(function () {

        // Declare Widgets Array
        var AflacWidgets = [];

        $("html").removeClass("no-js");

        var isMobile = (/iPhone|iPod|Android|BlackBerry|IEMobile/).test(navigator.userAgent);

        FastClick.attach(document.body);

        // Enable :active pseudo class on mobile
        if (document.addEventListener) {
            document.addEventListener('touchstart', function () {
            }, false);
        }

        var $DOM = {
          whyEverwell: $('.ev_why-everwell'),
          howItWorks: $('.ev_how'),
          realLifeExamples: $('.ev_rl-examples'),
          anchorNav: $('.ev_anchor-nav'),
          factOrFiction: $('.ev_fof'),
          testimonials: $('.ev_testimonials'),
          sharing: $(ShareWidget.selector)
        };

        // Init sharing
        for (var i = 0; i < $DOM.sharing.length; i++) {
          var sharable = $DOM.sharing.eq(i);
          new ShareWidget({ el: sharable });
        }

        // Why Everwell
        if($DOM.whyEverwell.length > 0) {
          var _WhyEverwell = WhyEverwell;
          _WhyEverwell.initialize({
            el: $DOM.whyEverwell,
            prefix: 'js-ev_why-'
          });
          AflacWidgets.push(_WhyEverwell);
        }

        // Testimonials
        if($DOM.testimonials.length > 0) {
          var _Testimonials = new Testimonial({
            el: $DOM.testimonials
          });
        }

        // How it Works
        if($DOM.howItWorks.length > 0) {
          var _HowItWorks = everwellSlider();
          _HowItWorks.initialize({
            el: $DOM.howItWorks,
            prefix: 'js-ev_how-',
            sizeSlides: true,
            hasNav: true,
            slideType: 'full',
            slideDuration: 0.6,
            nbSlidesVisible: 1
          });
          AflacWidgets.push(_HowItWorks);
        }

        // Real Life examples
        if($DOM.realLifeExamples.length > 0) {
          var _RealLifeExamples = RealLifeExamples;
          _RealLifeExamples.initialize({
            el: $DOM.realLifeExamples,
            prefix: 'js-ev_rl-'
          });
          AflacWidgets.push(_RealLifeExamples);

          var _RealLifeSlider = everwellSlider();
          _RealLifeSlider.initialize({
            el: $DOM.realLifeExamples,
            prefix: 'js-ev_rl-',
            sizeSlides: false,
            hasNav: false,
            slideType: 'thumb',
            slideDuration: 0.3,
            nbSlidesVisible: 4,
            onClickSlide: _RealLifeExamples.triggerClickSlide
          });
          AflacWidgets.push(_RealLifeSlider);
        }

        // Anchor Nav
        if($DOM.anchorNav.length > 0) {
          var _AnchorNav = AnchorNav;
          _AnchorNav.initialize({
            el: $DOM.anchorNav,
            prefix: 'js-ev_anchor-'
          });
          AflacWidgets.push(_AnchorNav);
        }


        // Fact or Fiction
        if($DOM.factOrFiction.length > 0) {
          var _FactOrFiction = FactOrFiction;
          _FactOrFiction.initialize({
            el: $DOM.factOrFiction,
            prefix: 'js-ev_fof-'
          });
          AflacWidgets.push(_FactOrFiction);
        }

        // Resize all widgets
        $(window).on('resize', function () {
          for (var i = 0; i < AflacWidgets.length; i++) {
            var widget = AflacWidgets[i];
            if(widget) {
              widget.resize();
            }
          }
        });

        // Scroll all widgets
        $(window).on('scroll', function () {
          for (var i = 0; i < AflacWidgets.length; i++) {
            var widget = AflacWidgets[i];
            if(widget) {
              widget.scroll();
            }
          }
        });

        // RccApp.build();

        // DropDown.build();
        InputText.build();
        // InputTextAlt.build();
        // FormCheckbox.build();
        LightboxModal.build();
        VideoPlayer.build();
    });
});