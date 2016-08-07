(function() {
  define(["jquery", "underscore", "backbone", "rcc/rcc-d"], function($, _, Backbone, appData) {
    return {
      root: "/",
      breakpoints: {
        small: 600,
        desktop: 1024
      },
      data: appData,
      getsDesktop: (function() {
        if($('html').hasClass('lt-ie9')){
          return function(){
            return true;
          }
        }
        var $window, scrollBarWidth;
        $window = $(window);
        scrollBarWidth = 0;
        return function() {
          scrollBarWidth = window.innerWidth - $("body").width();
          return ($window.width() + scrollBarWidth) >= this.breakpoints.desktop;
        };
      })()
    };
  });
}).call(this);