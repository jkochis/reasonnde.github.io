
/*
  Class: BaseView
  Extends: Backbone.View
  Provides a bunch of basic functionality, mainly for handling tooltips.
 */

(function() {
  define(["jquery", "underscore", "backbone", "modernizr", "rcc/rcc"], function($, _, Backbone, Modernizr, rcc) {
    var BaseView;
    return BaseView = Backbone.View.extend({
      _toggleTooltip: function($tooltip) {
        if (rcc.getsDesktop() || !Modernizr.touch) {
          return $tooltip.fadeToggle("fast");
        } else {
          return $tooltip.slideToggle("fast");
        }
      },
      _showTooltip: function($tooltip) {
        if (rcc.getsDesktop() || !Modernizr.touch) {
          $tooltip.fadeIn("fast");
        } else {
          $tooltip.slideDown("fast");
        }
        $tooltip.addClass("visible");
        if (Modernizr.touch && rcc.getsDesktop()) {
          return $("html").one("click", (function(_this) {
            return function() {
              return _this._hideTooltip($tooltip);
            };
          })(this));
        }
      },
      _hideTooltip: function($tooltip) {
        if (rcc.getsDesktop() || !Modernizr.touch) {
          $tooltip.fadeOut("fast");
        } else {
          $tooltip.slideUp("fast");
        }
        return $tooltip.removeClass("visible");
      },
      _onClickTooltipClose: function(e) {
        var $target;
        $target = $(e.currentTarget);
        return this._hideTooltip($target.closest(".tooltip"));
      },
      _onClickTooltip: function(e) {
        return e.stopPropagation();
      },
      _initPrompt: function() {
        var $promptTooltip;
        if (!rcc.getsDesktop()) {
          return;
        }
        $promptTooltip = this.$(".tooltip--prompt");
        return this._promptTimeout = setTimeout((function(_this) {
          return function() {
            return _this._showTooltip($promptTooltip);
          };
        })(this), 7500);
      },
      _clearPrompt: function() {
        if (this._promptTimeout) {
          clearTimeout(this._promptTimeout);
        }
        return this._hideTooltip(this.$(".tooltip--prompt"));
      },
      _scrollToFirstError: function() {
        var $firstTooltip, offset;
        if (rcc.getsDesktop()) {
          return;
        }
        $firstTooltip = this.$(".tooltip--error.visible").first();
        if ($firstTooltip.length) {
          offset = $firstTooltip.offset().top - 120;
          return $("body").animate({
            scrollTop: offset
          }, 200);
        }
      },

      /*
      To set the disclaimer to extended mode (that is, showing the details in .rcc-step-2-copy),
      call this method with {mode: "extended"}, otherwise it will be updated to default mode.
       */
      _updateDisclaimer: function(params) {
        var $disclaimer, $link, linkText;
        if (params == null) {
          params = {};
        }
        $disclaimer = $(".w_disclaimer--rcc");
        $link = $disclaimer.find(".disclaimer-link--rcc i");
        linkText = $link.text();
        if (params.mode === "extended") {
          if (linkText.indexOf("* ") !== 0) {
            linkText = "* " + linkText;
          }
          $disclaimer.find(".rcc-step-2-copy").fadeIn("fast");
        } else {
          if (linkText.indexOf("* ") === 0) {
            linkText = linkText.substr(2);
          }
          $disclaimer.find(".rcc-step-2-copy").fadeOut("fast");
        }
        $link.text(linkText);
        return $(window).trigger("resize.w_disclaimer");
      }
    });
  });

}).call(this);
