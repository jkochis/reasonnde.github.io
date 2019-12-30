
/*
  Class: Cardboard3DView
  Extends: CardboardView
  Renders an individual cardboard/flapper number with 3d transformations
 */

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["modernizr", "TweenMax", "rcc/views/CardboardView"], function(Modernizr, TweenMax, CardboardView) {
    var Cardboard3DView, _transformStyle;
    _transformStyle = Modernizr.prefixed('transform');
    return Cardboard3DView = (function(_super) {
      __extends(Cardboard3DView, _super);

      function Cardboard3DView() {
        return Cardboard3DView.__super__.constructor.apply(this, arguments);
      }

      Cardboard3DView.prototype.initialize = function() {
        Cardboard3DView.__super__.initialize.apply(this, arguments);
        this._previousTweenValue = 0;
        this._tweenValue = 0;
        this.$flip = this.$('.rcc-flip');
        this.$flipNum = this.$flip.find('.rcc-num');
        this.$topShade = this.$top.find('.rcc-shade').show();
        this.$bottomShade = this.$bottom.find('.rcc-shade').show();
        return this.$flipShade = this.$flip.find('.rcc-shade').show();
      };

      Cardboard3DView.prototype._changeDom = function() {
        var from, to;
        this.isAnimating = true;
        this.$flip.removeClass('rcc-top rcc-bottom');
        if (this._domDirection > 0) {
          this.$topNum.text(this._newValue);
          this.$flipNum.text(this._currentValue);
          this.$bottomNum.text(this._currentValue);
          this.$flip.addClass('rcc-top');
          from = -1;
          to = 1;
        } else {
          this.$topNum.text(this._currentValue);
          this.$flipNum.text(this._currentValue);
          this.$bottomNum.text(this._newValue);
          this.$flip.addClass('rcc-bottom');
          from = 1;
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
          })(this)
        });
      };

      Cardboard3DView.prototype._onUpdate = function() {
        var bouncedTweenValue, tweenValue;
        tweenValue = this._tweenValue;
        bouncedTweenValue = tweenValue < 0 ? tweenValue + 1 : -tweenValue + 1;
        this.$flip[0].style[_transformStyle] = 'scale3d(1,1,' + (tweenValue < 0 ? -1 : 1) + ') rotateX(' + (bouncedTweenValue * 90) + 'deg)';
        this.$topShade[0].style.opacity = bouncedTweenValue;
        this.$bottomShade[0].style.opacity = bouncedTweenValue;
        this.$flipShade[0].style.opacity = bouncedTweenValue;
        if (tweenValue * this._previousTweenValue < 0) {
          this.$flip.removeClass('rcc-top rcc-bottom');
          if (tweenValue < 0) {
            this.$flip.addClass('rcc-top');
          } else {
            this.$flip.addClass('rcc-bottom');
          }
          this.$flipNum.text(this._newValue);
        }
        return this._previousTweenValue = tweenValue;
      };

      Cardboard3DView.prototype._onComplete = function() {
        this.$flip.removeClass('rcc-top rcc-bottom');
        return Cardboard3DView.__super__._onComplete.apply(this, arguments);
      };

      return Cardboard3DView;

    })(CardboardView);
  });

}).call(this);
