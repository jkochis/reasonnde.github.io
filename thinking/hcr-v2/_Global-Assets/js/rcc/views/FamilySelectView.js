
/*
  Class: FamilySelectView
  Extends: Backbone.View
  Simple widget for sliding through different family structures (with heads popping up)
 */

(function() {
  define(["jquery", "underscore", "backbone", "TweenMax"], function($, _, Backbone, TweenMax) {
    var FamilySelectView;
    return FamilySelectView = Backbone.View.extend({
      events: {
        "click .rcc-adv-family__button": "onInput"
      },
      initialize: function() {
        _.bindAll(this, "onWindowResize");
        $(window).on("resize", this.onWindowResize);
        return this._initAnimations();
      },
      _initAnimations: function() {
        this._initShowKids();
        this._initShowMan();
        return this._initShowWoman();
      },
      _initShowKids: function() {
        var kids, width;
        kids = this._characters.kids;
        width = kids.mW;
        this.showKids = new TimelineLite().pause();
        this.showKids.add(TweenMax.to(kids.$el[0], 0, {
          display: "inline-block"
        }));
        this.showKids.add(TweenMax.fromTo(kids.$el[0], 0.1, {
          "width": "0"
        }, {
          "width": width
        }));
        return this.showKids.add(TweenMax.fromTo(kids.$el[0], 0.1, {
          "transform": "scale(0)"
        }, {
          "transform": "scale(1)"
        }));
      },
      _initShowWoman: function() {
        var width, woman;
        woman = this._characters.woman;
        width = woman.mW;
        this.showWoman = new TimelineLite().pause();
        this.showWoman.add(TweenMax.to(woman.$el[0], 0, {
          display: "inline-block"
        }));
        this.showWoman.add(TweenMax.fromTo(woman.$el[0], 0.1, {
          "width": 0
        }, {
          "width": width
        }));
        return this.showWoman.add(TweenMax.fromTo(woman.$el[0], 0.1, {
          "transform": "scale(0)"
        }, {
          "transform": "scale(1)"
        }));
      },
      _initShowMan: function() {
        var man, width;
        man = this._characters.man;
        width = man.mW;
        this.showMan = new TimelineLite().pause();
        this.showMan.add(TweenMax.to(man.$el[0], 0, {
          display: "inline-block"
        }));
        this.showMan.add(TweenMax.fromTo(man.$el[0], 0.1, {
          "width": 0
        }, {
          "width": width
        }));
        return this.showMan.add(TweenMax.fromTo(man.$el[0], 0.1, {
          "transform": "scale(0)"
        }, {
          "transform": "scale(1)"
        }));
      },
      _characters: {
        man: {
          $el: $("<span class='rcc-adv-family__char rcc-adv-family__char--man'></span>"),
          mW: 50,
          dW: 99
        },
        woman: {
          $el: $("<span class='rcc-adv-family__char rcc-adv-family__char--woman'></span>"),
          mW: 47,
          dW: 93
        },
        kids: {
          $el: $("<span class='rcc-adv-family__char rcc-adv-family__char--kids'></span>"),
          mW: 63,
          dW: 126
        }
      },
      _charIsVisible: function(char) {
        var width;
        width = char.mW;
        return parseInt(char.$el.css("width"), 10) === width;
      },
      _order: ["single", "couple", "couple-with-children", "single-with-children"],
      _options: {
        "single": {
          val: "single",
          animation: function() {
            var animation;
            animation = new TimelineLite();
            if (this._charIsVisible(this._characters.kids)) {
              animation.add(this.showKids.reverse());
            }
            if (this._charIsVisible(this._characters.woman)) {
              animation.add(this.showWoman.reverse());
            }
            if (!this._charIsVisible(this._characters.man)) {
              animation.add(this.showMan.play());
            }
            return animation;
          }
        },
        "couple": {
          val: "couple",
          animation: function() {
            var animation;
            animation = new TimelineLite();
            if (this._charIsVisible(this._characters.kids)) {
              animation.add(this.showKids.reverse());
            }
            if (!this._charIsVisible(this._characters.woman)) {
              animation.add(this.showWoman.play());
            }
            if (!this._charIsVisible(this._characters.man)) {
              return animation.add(this.showMan.play());
            }
          }
        },
        "couple-with-children": {
          val: "couple-with-children",
          animation: function() {
            var animation;
            animation = new TimelineLite();
            if (!this._charIsVisible(this._characters.kids)) {
              animation.add(this.showKids.play());
            }
            if (!this._charIsVisible(this._characters.woman)) {
              animation.add(this.showWoman.play());
            }
            if (!this._charIsVisible(this._characters.man)) {
              return animation.add(this.showMan.play());
            }
          }
        },
        "single-with-children": {
          val: "single-with-children",
          animation: function() {
            var animation;
            animation = new TimelineLite();
            if (this._charIsVisible(this._characters.woman)) {
              animation.add(this.showWoman.reverse());
            }
            if (!this._charIsVisible(this._characters.kids)) {
              animation.add(this.showKids.play());
            }
            if (!this._charIsVisible(this._characters.man)) {
              return animation.add(this.showMan.play());
            }
          }
        }
      },
      render: function() {
        var $charIndicator, chars;
        chars = "";
        $charIndicator = this.$(".rcc-adv-family__indicator").empty();
        return $.each(this._characters, function(k, char) {
          return $charIndicator.append(char.$el);
        });
      },
      setValue: function(val) {
        if (val == null) {
          val = this.getValue();
        }
        if (!this._options.hasOwnProperty(val)) {
          return false;
        }
        this._cur = this._options[val];
        this._curIndex = this._order.indexOf(val);
        this._cur.animation.call(this);
        return this._updateButtons();
      },
      _setIndex: function(index) {
        var safeIndex, val;
        safeIndex = index;
        if (index < this._order.length && index >= 0) {
          val = this._order[index];
        }
        return this.setValue(val);
      },
      _updateButtons: function() {
        var $minusBtn, $plusBtn;
        $minusBtn = this.$(".rcc-adv-family__button--minus");
        $plusBtn = this.$(".rcc-adv-family__button--plus");
        if (this._curIndex === 0) {
          $minusBtn.addClass("inactive");
          return $plusBtn.removeClass("inactive");
        } else {
          if (this._curIndex === (this._order.length - 1)) {
            $minusBtn.removeClass("inactive");
            return $plusBtn.addClass("inactive");
          } else {
            return this.$(".rcc-adv-family__button").removeClass("inactive");
          }
        }
      },
      getValue: function() {
        if (this._cur) {
          return this._cur.val;
        }
      },
      onInput: function(e) {
        var modifier, newIdx;
        modifier = parseInt($(e.currentTarget).data("modifier"), 10);
        newIdx = this._curIndex + modifier;
        return this._setIndex(newIdx);
      },
      onWindowResize: function() {
        if (!this.$el.is(":visible")) {
          return;
        }
        this._initAnimations();
        return this.setValue();
      }
    });
  });

}).call(this);
