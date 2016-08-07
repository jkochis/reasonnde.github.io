/* globals define */

'use strict';

define(['jquery', 'TweenMax', 'query-dom-components', 'ScrollToPlugin', 'lib/Env'], function ($, TweenMax, queryDom, ScrollToPlugin, Env) {
  var WhyEverwell = (function() {
    var $el;
    var dom;
    var isMobile = Env.ANDROID || Env.IOS;

    function initialize(options) {
      $el = options.el;

      if(Env.IE8) {
        dom = {
          anchor: $('.' + options.prefix + 'anchor')
        };
      } else {
        dom = queryDom({el: $el, prefix: options.prefix});
      }

      // DOM Events
      domEvents();
    }

    function resize() {}
    function scroll() {}

    function domEvents() {
      var clickEvent = isMobile ? 'touchstart' : 'click';
      dom.anchor.on(clickEvent, function(e) {
        e.preventDefault();
        var $target = $(e.currentTarget);
        var targetScrollName = $target.attr('data-scroll-target');
        var $targetScroll = $('.' + targetScrollName);
        var padding = isMobile ? 65 : 110;

        if($targetScroll.length > 0) {
          TweenMax.to($(window), 1.2, {
            scrollTo: {
              y: $targetScroll.offset().top - padding
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

  return WhyEverwell;
});
