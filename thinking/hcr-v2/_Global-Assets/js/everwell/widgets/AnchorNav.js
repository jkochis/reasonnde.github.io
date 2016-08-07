/* globals define */

'use strict';

define(['jquery', 'TweenMax', 'query-dom-components', 'ScrollToPlugin', 'lib/Env'], function ($, TweenMax, queryDom, ScrollToPlugin, Env) {
  var AnchorNav = (function() {
    var $el;
    var dom;
    var anchorTargetsOffsets;
    var elOffset;
    var isMobile = Env.ANDROID || Env.IOS;

    function initialize(options) {
      $el = options.el;

      if(Env.IE8) {
        dom = {
          container: $('.' + options.prefix + 'container'),
          anchor: $('.' + options.prefix + 'anchor'),
          anchorNav: $('.' + options.prefix + 'anchor-nav')
        };
      } else {
        dom = queryDom({el: $el, prefix: options.prefix});
      }

      // Determine el offset top
      elOffset = $el.offset().top;

      // Create targets when everything is loaded
      setTimeout(function() {
        createTargets();
        scroll();
      }, 100);

      // Size container
      sizeContainer();

      // DOM Events
      domEvents();
    }

    function resize() {
      sizeContainer();
      createTargets();
    }

    function sizeContainer() {
      var windowW = $(window).width();
      if(windowW > 1520) {
        if(!dom.container.hasClass('full-w')) {
          dom.container.addClass('full-w');
        }
      } else {
        if(dom.container.hasClass('full-w')) {
          dom.container.removeClass('full-w');
        }
      }
    }

    function createTargets() {
      // Empty anchorTargetsOffsets
      anchorTargetsOffsets = [];
      for (var i = 0; i < dom.anchor.length; i++) {
        var anchor = dom.anchor.eq(i);
        var target = $('.' + anchor.attr('data-scroll-target'));
        if(target.length > 0) {
          anchorTargetsOffsets.push(target.offset().top);
        }
      }
    }

    function scroll() {
      var scrollTop = $(window).scrollTop();

      if(!Env.ANDROID) {
        if(scrollTop >= elOffset) {
          if(!dom.container.hasClass('fixed')) {
            dom.container.addClass('fixed');
          }
        } else {
          if(dom.container.hasClass('fixed')) {
            dom.container.removeClass('fixed');
          }
        }        
      }

      if(anchorTargetsOffsets) {
        for (var i = 0; i < anchorTargetsOffsets.length; i++) {
          var offset = anchorTargetsOffsets[i];
          var target = dom.anchorNav.find('li').eq(i);
          if(scrollTop >= offset - $el.height() - 50) {
            var activeEl = dom.anchorNav.find('li.active');
            if(activeEl.hasClass('active')) {
              activeEl.removeClass('active');
            }
            if(!target.hasClass('active')) {
              target.addClass('active');
            }
          } else {
            if(target.hasClass('active')) {
              target.removeClass('active');              
            }
          }
        }
      }
    }

    function domEvents() {
      var clickEvent = isMobile ? 'touchstart' : 'click';
      dom.anchor.on(clickEvent, function(e) {
        e.preventDefault();
        var $target = $(e.currentTarget);
        var targetScrollName = $target.attr('data-scroll-target');
        var $targetScroll = $('.' + targetScrollName);

        dom.anchorNav.find('.active').removeClass('active');
        $target.addClass('active');

        if($targetScroll.length > 0) {
          TweenMax.to($(window), 1, {
            scrollTo: {
              y: $targetScroll.offset().top - 110
            }
          });
        } else {
          console.log('debug: .' + targetScrollName + ' couldn\'t be found');
        }
      });
    }

    return {
      initialize: initialize,
      resize: resize,
      scroll: scroll
    };
  })();

  return AnchorNav;
});
