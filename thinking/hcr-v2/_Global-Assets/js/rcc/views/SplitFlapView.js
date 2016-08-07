
/*
  Class: SplitFlapView
  Extends: Backbone.View
  Renders a bunch of flapping text and provides an API to change the numbers.
 */

(function() {
  define(["jquery", "underscore", "backbone", "modernizr", "rcc/views/Cardboard3DView", "rcc/views/Cardboard3DView"], function($, _, Backbone, Modernizr, Cardboard2DView, Cardboard3DView) {
    var CardboardView, SplitFlapView;
    CardboardView = Modernizr.csstransforms3d && !Modernizr.touch ? Cardboard3DView : Cardboard2DView;
    SplitFlapView = Backbone.View.extend({
      initialize: function() {
        var digit, _cardboard, _i, _len, _ref;
        this._cardboards = [];
        _ref = this.$('.rcc-cardboard');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          digit = _ref[_i];
          _cardboard = new CardboardView({
            el: digit
          });
          _cardboard.useIndividualDirection = true;
          _cardboard.fixedSpeed = void 0;
          _cardboard.onCompleteCallback = void 0;
          this._cardboards.push(_cardboard);
        }
        this.length = this.length || 6;
        this._poweredLength = Math.pow(10, this.length);
        return this._currentValue = 0;
      },
      change: function(value) {
        var $comma, cardboard, direction, headlessValueStr, i, valueString, _i, _isRandomlyFlipping, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
        if (!this.$el.is(":visible")) {
          return;
        }
        $comma = this.$(".rcc-comma");
        if (_.isNaN(value) || value < 0) {
          value = 0;
        } else {
          if (value >= this._poweredLength) {
            value = this._poweredLength - 1;
          } else {
            value = parseInt(value, 10);
          }
        }
        _isRandomlyFlipping = false;
        if (!_isRandomlyFlipping) {
          direction = value > this._currentValue ? 1 : -1;
          headlessValueStr = value.toString();
          valueString = this._parseStringFrom(value);
          _ref = this._cardboards;
          for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
            cardboard = _ref[i];
            cardboard.change(valueString.substr(i, 1));
            cardboard.$el.show();
          }
        }
        $comma.css({
          display: headlessValueStr.length > 3 ? "block" : "none"
        });
        if (value === 0) {
          _ref1 = this._cardboards;
          for (i = _j = 0, _len1 = _ref1.length; _j < _len1; i = ++_j) {
            cardboard = _ref1[i];
            if (i !== this._cardboards.length - 1) {
              cardboard.$el.hide();
            }
          }
        } else {
          _ref2 = this._cardboards;
          for (i = _k = 0, _len2 = _ref2.length; _k < _len2; i = ++_k) {
            cardboard = _ref2[i];
            if (valueString.substr(i, 1) !== "0") {
              break;
            }
            cardboard.$el.hide();
          }
        }
        return this._currentValue = value;
      },
      _parseStringFrom: function(value) {
        return (this._poweredLength + value).toString().substr(1);
      }
    });
    return SplitFlapView;
  });

}).call(this);
