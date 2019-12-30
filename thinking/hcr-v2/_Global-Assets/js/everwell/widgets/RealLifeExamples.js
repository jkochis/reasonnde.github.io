/* globals define */

'use strict';

define(
  ['jquery', 'TweenMax', 'query-dom-components', 'lib/Env',
  '../lightbox/SubmitSuccessStoryLightbox', '../lightbox/TestimonialLightbox'],
  function (
  $, TweenMax, queryDom, Env,
  SubmitSuccessStoryLightbox, TestimonialLightbox) {
  var RealLifeExamples = (function() {
    var $el;
    var dom;
    var submitLightbox = new SubmitSuccessStoryLightbox();
		var testimonialLightbox = new TestimonialLightbox();
    var isMobile = Env.ANDROID || Env.IOS;

    function initialize(options) {
      $el = options.el;

      if(Env.IE8) {
        dom = {
          openSubmitLightbox: $('.' + options.prefix + 'open-submit-lightbox'),
          slide: $('.' + options.prefix + 'slide')
        };
      } else {
        dom = queryDom({el: $el, prefix: options.prefix});
      }

      if(isMobile) {
        $('.ev_rl-slider').css({'width': '100%'});
      }

      // Dom Events
      domEvents();
    }

    function resize() {}
    function scroll() {}

    function domEvents() {
      var clickEvent = isMobile ? 'touchstart' : 'click';
			dom.openSubmitLightbox.on(clickEvent, function(event) {
				event.preventDefault();
		submitLightbox.reset();				
        submitLightbox.show();

      });

      // Clicking for desktop
      // Mobile is dealt with in EverwellSlider
      if(!isMobile) {
        dom.slide.on('click', function(event) {
          event.preventDefault();
          var index = $(event.currentTarget).index();
          openLightBox(index);
        });
      }
    }

    function openLightBox(index) {
			testimonialLightbox.show(index + 1);
    }

    return {
      initialize: initialize,
      resize: resize,
      scroll: scroll,
      triggerClickSlide: openLightBox
    };
  })();

  return RealLifeExamples;
});
