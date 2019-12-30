
/*
  Class: ModalView
  Extends: BaseView
  Syncs the model to the advanced tab (where all the specifics of insurance etc. can be filled in).
 */

(function() {
  define(["jquery", "underscore", "backbone", "modernizr", "Select", "TweenMax", "rcc/rcc", "rcc/views/BaseView"], function($, _, Backbone, Modernizr, Select, TweenMax, rcc, BaseView) {
    var ModalView;
    return ModalView = BaseView.extend({
      initialize: function() {
        return this.$originalParent = this.$el.parent();
      },
      allowWithInvalidState: true,
      events: {
        "click > .inner": "onInnerElementClick",
        "click": "hide",
        "click .rcc-button--close": "hide"
      },
      _onInnerElementClick: function(e) {
        return e.stopPropagation();
      },
      hide: function() {
        return rcc.vent.trigger("hide", this);
      },
      customFadeIn: function() {
        var inner, tl;
        tl = new TimelineLite().pause();
        inner = this.$(".inner")[0];
        tl.add(TweenMax.to(this.$el, 0.1, {
          display: "block",
          opacity: 1,
          ease: Power2.easeIn
        }));
        tl.add(TweenMax.fromTo(inner, 0.2, {
          opacity: 0,
          transform: "rotateX(-25deg)"
        }, {
          opacity: 1,
          transform: "rotateX(0deg)",
          ease: Power2.easeOut
        }).delay(0.2));
        return tl;
      },
      customFadeOut: function() {
        var inner, tl;
        tl = new TimelineLite().pause();
        inner = this.$(".inner")[0];
        tl.add(TweenMax.fromTo(inner, 0.2, {
          opacity: 1,
          transform: "rotateX(0deg)"
        }, {
          opacity: 0,
          transform: "rotateX(-25deg)",
          ease: Power2.easeOut
        }).delay(0.2));
        tl.add(TweenMax.to(this.$el, 0.1, {
          display: "none",
          opacity: 0,
          ease: Power2.easeIn
        }));
        tl.add(TweenMax.to(inner, 0, {
          opacity: 1
        }));
        return tl;
      },
      mobileCustomFadeIn: function() {
        var inner, tl;
        tl = new TimelineLite().pause();
        inner = this.$(".inner")[0];
        if (this.$el.is(":visible")) {
          return tl;
        }
        tl.add(TweenLite.to(inner, 0, {
          opacity: 1,
          transform: ""
        }));
        tl.add(TweenLite.to(this.el, 0, {
          opacity: 0,
          display: "block"
        }));
        tl.add(TweenLite.to(this.el, 0.25, {
          opacity: 1,
          ease: Quart.easeIn
        }));
        return tl;
      },
      modal: true
    });
  });

}).call(this);
