
/*
  Class: Cardboard2DView
  Extends: CardboardView
  Renders an individual cardboard/flapper number without 3d transformations
 */

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["modernizr", "TweenMax", "rcc/views/CardboardView"], function(Modernizr, TweenMax, CardboardView) {
    var Cardboard2DView, _transformStyle;
    _transformStyle = Modernizr.prefixed('transform');
    return Cardboard2DView = (function(_super) {
      __extends(Cardboard2DView, _super);

      function Cardboard2DView() {
        return Cardboard2DView.__super__.constructor.apply(this, arguments);
      }

      Cardboard2DView.prototype.initialize = function() {
        Cardboard2DView.__super__.initialize.apply(this, arguments);
        this._previousTweenValue = 0;
        this._tweenValue = 0;
        this.$(".rcc-flip").remove();
        this.$topShade.remove();
        return this.$bottomShade.remove();
      };

      Cardboard2DView.prototype._changeDom = function() {
        var from, to;
        this.isAnimating = true;
        if (this._domDirection > 0) {
          this.$topNum.text(this._newValue);
          this.$bottomNum.text(this._currentValue);
          this._previousTweenValue = from = -1;
          to = 1;
        } else {
          this.$topNum.text(this._currentValue);
          this.$bottomNum.text(this._newValue);
          this._previousTweenValue = from = 1;
          to = -1;
        }
        return TweenLite.fromTo(this, this._changeSpeed, {
          _tweenValue: from
        }, {
          _tweenValue: to,
          onUpdate: (function(_this) {
            return function() {
              return _this._onUpdate();
            };
          })(this),
          onComplete: (function(_this) {
            return function() {
              return _this._onComplete();
            };
          })(this),
          ease: "linear"
        });
      };

      Cardboard2DView.prototype._onUpdate = function() {
        var parsedTweenValue, tweenValue;
        tweenValue = this._tweenValue;
        parsedTweenValue = (tweenValue + 1) * 150;
        this.topNum[0].style.top = (tweenValue < -1 / 3 ? parsedTweenValue : parsedTweenValue - 300) + '%';
        this.bottomNum[0].style.top = (tweenValue < 1 / 3 ? parsedTweenValue - 100 : parsedTweenValue - 400) + '%';
        if ((tweenValue + 1 / 3) * (self._previousTweenValue + 1 / 3) < 0) {
          this.topNum.text(this._newValue);
        } else if ((tweenValue - 1 / 3) * (self._previousTweenValue - 1 / 3) < 0) {
          this.bottomNum.text(this._newValue);
        }
        return this._previousTweenValue = tweenValue;
      };

      return Cardboard2DView;

    })(CardboardView);
  });

}).call(this);
