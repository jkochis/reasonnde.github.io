
/*
  Class: CardboardView
  Extends: Backbone.View
  Provides basic functionality for concrete CardBoard Views (2D/3D), without caring for the actual visuals.
 */

(function() {
  define(["jquery", "underscore", "backbone"], function($, _, Backbone) {
    var CardboardView;
    return CardboardView = Backbone.View.extend({
      initialize: function() {
        this.value = 0;
        this.valueDirection = 1;
        this.isAnimating = false;
        this._currentValue = 0;
        this._newValue = 0;
        this._domDirection = 1;
        this.topValue = 0;
        this.bottomValue = 0;
        this.maxValue = 10;
        this.fixedSpeed = -1;
        this.FLIP_DOWN = true;
        this.HIGH_SPEED = 0.01;
        this.LOW_SPEED = 0.3;
        this.useIndividualDirection = true;
        this.onCompleteOnceCallback = null;
        this.onCompleteCallback = null;
        this.$top = this.$('.rcc-top');
        this.$topNum = this.$top.find('.rcc-num');
        this.$topShade = this.$top.find('.rcc-shade');
        this.$bottom = this.$('.rcc-bottom');
        this.$bottomNum = this.$bottom.find('.rcc-num');
        return this.$bottomShade = this.$bottom.find('.rcc-shade');
      },
      change: function(value, valueDirection) {
        if (this.value !== value) {
          this.value = value;
          if (!(this.useIndividualDirection || _.isUndefined(valueDirection))) {
            this.valueDirection = valueDirection;
          }
          return this._changeNext();
        }
      },
      _changeNext: function() {
        var absDiff, diff, dynamicSpeed;
        if (parseInt(this._currentValue, 10) !== parseInt(this.value, 10) && !this.isAnimating) {
          diff = this.value - this._currentValue;
          absDiff = Math.abs(diff);
          if (this.useIndividualDirection) {
            this.valueDirection = diff > 0 ? 1 : -1;
          }
          if (absDiff > this.maxValue / 2) {
            if (this.useIndividualDirection) {
              this.valueDirection *= -1;
            }
            absDiff -= this.maxValue / 2;
          }
          dynamicSpeed = this.LOW_SPEED - (absDiff / (this.maxValue / 2)) * (this.LOW_SPEED - this.HIGH_SPEED);
          this._changeSpeed = _.isUndefined(this.fixedSpeed) ? dynamicSpeed : this.fixedSpeed;
          this._newValue = this._currentValue + this.valueDirection;
          if (this.valueDirection < 0 && this._newValue < 0) {
            this._newValue = this.maxValue - 1;
          } else {
            if (this.valueDirection > 0 && this._newValue >= this.maxValue) {
              this._newValue = 0;
            }
          }
          this._domDirection = this.valueDirection * (this.FLIP_DOWN ? 1 : -1);
          return this._changeDom();
        }
      },
      _onComplete: function() {
        this.isAnimating = false;
        this.$topNum.add(this.$bottomNum).html(this._currentValue = this._newValue);
        if (this.onCompleteOnceCallback) {
          this.onCompleteOnceCallback();
        }
        if (this._currentValue !== this.value) {
          return this._changeNext();
        } else {
          if (this.onCompleteCallback) {
            return this.onCompleteCallback();
          }
        }
      }
    });
  });

}).call(this);
