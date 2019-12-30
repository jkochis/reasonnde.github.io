/*
  Class: HintSliderView
  Extends: BaseView
  Main view for last step.
 */
(function() {
  define(["jquery", "underscore", "backbone", "rcc/rcc", "rcc/views/BaseView"], function($, _, Backbone, rcc, BaseView) {
    var HintSliderView;
    return HintSliderView = BaseView.extend({
      initialize: function() {
        this.$container = this.$(".rcc-hints__list");
        this.$srcBtns = this.$(".rcc-hints__src-btn");
        this.$tooltips = this.$(".tooltip--source");
        _.bindAll(this, "_onWindowResize", "play", "pause", "_onIndexChanged", "_onClickTooltipClose");
        this.$hints = this.$("." + this.config.item);
        this._currentIndex = 0;
        this._oldIndex = this._currentIndex;
        $(window).on("resize", this._onWindowResize);
        this.on("indexchanged", this._onIndexChanged);
        this.$srcBtns.each(function(i, btn) {
          var tooltip;
          return tooltip = $("#" + $(btn).data("tooltip"))[0];
        });
        $(".rcc-hints__src .rcc-button--close").on("click", this._onClickTooltipClose);
        this._initTooltips();
        this.$el.hoverIntent((function(_this) {
          return function(e) {
            return _this.pause();
          };
        })(this), (function(_this) {
          return function() {
            return _this.play();
          };
        })(this));
        return this.$el.hoverIntent((function(_this) {
          return function(e) {
            return _this._onTooltipShow(e);
          };
        })(this), (function(_this) {
          return function(e) {
            return _this._onLeaveTooltipShow(e);
          };
        })(this), ".rcc-hints__src-btn");
      },
      config: {
        item: "rcc-hints__item"
      },
      events: {
        "click .rcc-button--left": "_toggleLeft",
        "click .rcc-button--right": "_toggleRight",
        "click .rcc-hints__src-btn": "_onTooltipShow"
      },
      modifyIndex: function(modifier) {
        this._oldIndex = this._currentIndex;
        this._currentIndex = (this.$hints.length + this._currentIndex + modifier) % this.$hints.length;
        return this.trigger("indexchanged");
      },
      render: function() {
        var indicator, indicatorMarkup, n, _i;
        this._setPositions();
        indicatorMarkup = "";
        indicator = "<span class='rcc-hints__indicator'></span>";
        n = this.$(".rcc-hints__item").length;
        if (n) {
          for (_i = 1; 1 <= n ? _i <= n : _i >= n; 1 <= n ? _i++ : _i--) {
            indicatorMarkup += indicator;
          }
        }
        this.$(".rcc-hints__indicators").empty().append(indicatorMarkup);
        this.$indicators = this.$(".rcc-hints__indicator");
        return this._onIndexChanged();
      },
      play: function() {
        this.pause();
        return this.toggleIval = setInterval((function(_this) {
          return function() {
            return _this.modifyIndex(1);
          };
        })(this), 7500);
      },
      pause: function() {
        return clearInterval(this.toggleIval);
      },
      _setPositions: function() {
        var elWidth;
        this.elWidth = elWidth = this.$container.width();
        this.$hints.each(function(i, hint) {
          return $(hint).css({
            width: elWidth
          });
        });
        return this._initTooltips();
      },
      _initTooltips: function() {
        var $body;
        $body = $("body");
        this.$srcBtns.each((function(_this) {
          return function(i, btn) {
            var $btn, $tooltip;
            $btn = $(btn);
            $tooltip = $btn.data("tooltip");
            if (!$tooltip) {
              $tooltip = $("#" + $btn.data("tooltipId"));
              $btn.data("tooltip", $tooltip);
            }
            if (!$tooltip.length) {
              return;
            }
            if (rcc.getsDesktop()) {
              return $tooltip.appendTo($body);
            } else {
              return $tooltip.insertAfter(_this.$(".rcc-hints__wrapper"));
            }
          };
        })(this));
        return $(".rcc-hints__src").hoverIntent((function(_this) {
          return function(e) {
            clearTimeout(_this.leaveSrcTimeout);
            return _this.pause();
          };
        })(this), (function(_this) {
          return function(e) {
            _this._hideTooltip($(e.currentTarget));
            return _this.play();
          };
        })(this));
      },
      _toggleRight: function() {
        this.pause();
        this.modifyIndex(1);
        return this.play();
      },
      _toggleLeft: function() {
        this.pause();
        this.modifyIndex(-1);
        return this.play();
      },
      _showTooltip: function($tooltip, $btn) {
        var offset;
        if (rcc.getsDesktop()) {
          offset = $btn.offset();
          $tooltip.css({
            top: offset.top + ($btn.outerHeight() / 2) - ($tooltip.outerHeight() / 2),
            left: offset.left + $btn.outerWidth()
          });
        } else {
          $tooltip.css({
            top: 0,
            left: 0
          });
        }
        this.pause();
        return BaseView.prototype._showTooltip.apply(this, arguments);
      },
      _hideTooltip: function() {
        this.play();
        return BaseView.prototype._hideTooltip.apply(this, arguments);
      },
      _onLeaveTooltipShow: function(e) {
        var $btn, $tooltip;
        $btn = $(e.currentTarget);
        $tooltip = $btn.data("tooltip");
        if ($tooltip.length) {
          return this.leaveSrcTimeout = setTimeout((function(_this) {
            return function() {
              return _this._hideTooltip($tooltip);
            };
          })(this), 500);
        }
      },
      _onTooltipShow: function(e) {
        var $btn, $tooltip;
        $btn = $(e.currentTarget);
        $tooltip = $btn.data("tooltip");
        if ($tooltip.length) {
          return this._showTooltip($tooltip, $btn);
        }
      },
      _onClickTooltipClose: function(e) {
        return this._hideTooltip^($(e.currentTarget).closest(".tooltip"));
      },
      _onIndexChanged: function() {
        var $indicators, $newIndicator, distance, duration;
        if (!this.$el.is(":visible")) {
          return;
        }
        distance = Math.abs(this._currentIndex - this._oldIndex);
        duration = distance > 1 ? distance / 2 : 1;
        TweenMax.to(this.$container[0], duration, {
          left: -1 * this.elWidth * this._currentIndex,
          ease: Power2.easeOutSine
        });
        $indicators = this.$indicators;
        if (!$indicators) {
          return;
        }
        $newIndicator = $indicators.eq(this._currentIndex);
        $indicators.filter(".active").removeClass("active");
        $newIndicator.addClass("active");
        return this._hideTooltip(this.$tooltips);
      },
      _onWindowResize: function() {
        if (!this.$el.is(":visible")) {
          return;
        }
        this.pause();
        this._setPositions();
        this._onIndexChanged();
        return this.play();
      }
    });
  });
}).call(this);