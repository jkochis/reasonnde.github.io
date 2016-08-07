/* globals define */

'use strict';

define(['jquery', 'TweenMax', 'query-dom-components', 'lib/Env'], function ($, TweenMax, queryDom, Env) {
  var FactOrFiction = (function() {
    var $el;
    var dom;
    var isMobile = Env.ANDROID || Env.IOS;
    var dragOffset = [];
    var dragY = [];
	var init = 0;

    function initialize(options) {
      $el = options.el;

      if(Env.IE8) {
        dom = {
          accordion: $('.' + options.prefix + 'accordion')
        };
      } else {
        dom = queryDom({el: $el, prefix: options.prefix});
      }

      // Init Accordions
      initAccordions();

      // DOM Events
      domEvents();
	  
		$('document').ready(function() {
			$('.js-ev_fof-accordion .ev_fof-list--bloc a').on('click touchstart', function (event) {
				event.stopPropagation();
			});
		});
		
    }

    function resize() {
      unwrapAll();
      initAccordions();
    }

    function scroll() {}

    function initAccordions() {
      for (var i = 0; i < dom.accordion.length; i++) {
        var $accordion = dom.accordion.eq(i);
        var targetHeight = $accordion.find('.ev_fof-list--bloc').height() + 20;
        $accordion.attr('data-height', $accordion.height());
        $accordion.attr('data-min-height', targetHeight);
        $accordion.height(targetHeight);
      }
      TweenMax.to(dom.accordion, 0.4, { opacity: 1 });
    }

    function unwrapAll() {
      for (var i = 0; i < dom.accordion.length; i++) {
        var $accordion = dom.accordion.eq(i);
        $accordion.removeClass('expanded');
        TweenMax.set($accordion, {clearProps: 'height'});
      }
    }

    function toggleAccordion(event) {
      //event.preventDefault();
      var $target = $(event.currentTarget);		
	    if (window.utag && init > 0) {
			if(!$target.hasClass('expanded')){
			utag.link({_ga_category: 'everwell fact or fiction',_ga_action: 'click',_ga_label: 'expand: fiction '+ ($target.index() + 1)}); 
			}
			if($target.hasClass('expanded')){
			utag.link({_ga_category: 'everwell fact or fiction',_ga_action: 'click',_ga_label: 'closed: fiction '+ ($target.index() + 1)}); 	
			}
		}
		init++;
      $target.toggleClass('expanded');
      TweenMax.to($target, 0.3, {
        height: $target.hasClass('expanded') ?
        $target.attr('data-height') :
        $target.attr('data-min-height')
      });
    }
	
	

    function domEvents() {
      if(isMobile) {
        var _bindTouch = function(accordion, index) {
          accordion.addEventListener('touchstart', function(event) {
            var touches = event.touches[0];
            dragOffset[index] = touches.clientX || touches.pageX;
            dragY[index] = 0;
          });

          accordion.addEventListener('touchmove', function(event) {
            var touches = event.touches[0];
            var clientX = touches.clientX || touches.pageX;
            dragY[index] = dragOffset[index] - clientX;
          });

          accordion.addEventListener('touchend', function(event) {
            if(Math.abs(dragY[index]) < 5) {
              toggleAccordion(event);
            }
          });
        };

        for (var i = 0; i < dom.accordion.length; i++) {
          _bindTouch(dom.accordion[i], i);
        }
      } else {
        dom.accordion.on('click', toggleAccordion);
      }

      // Open first accordion
      var firstAccordion = dom.accordion.eq(0);
      if(firstAccordion) {
        firstAccordion.trigger('click');
      }
    }

    return {
      initialize: initialize,
      resize: resize,
      scroll: scroll
    };
  })();

  return FactOrFiction;
});
