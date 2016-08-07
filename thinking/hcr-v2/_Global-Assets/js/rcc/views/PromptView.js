
/*
  Class: PromptView
  Extends: Backbone.View
  Renders a little prompt popup with a yes/no button.
 */

(function() {
  define(["jquery", "underscore", "backbone", "rcc/rcc", "TweenMax", "modernizr"], function($, _, Backbone, rcc, TweenMax, Modernizr) {
    var PromptView;
    return PromptView = Backbone.View.extend({
      tagName: "div",
      className: "modal prompt",
      events: {
        "click .rcc-button--confirm": "confirm",
        "click .rcc-button--deny": "deny",
        "click": "onClickElement"
      },
      render: function() {
        if (!Modernizr.touch) {
          this.$el.appendTo($("body"));
        }
        return this;
      },
      prompt: function() {
        var tl;
        if (Modernizr.touch || !rcc.getsDesktop()) {
          return this.nativePrompt();
        } else {
          tl = new TimelineLite;
          tl.add(TweenMax.to(this.el, 0, {
            display: "block",
            ease: Quart.easeIn
          }));
          return tl.add(TweenMax.to(this.el, 0.3, {
            opacity: 1,
            ease: Quart.easeIn
          }));
        }
      },
      nativePrompt: function() {

        /*
        Show native device confirm popup and react according to answer.
         */
        if (confirm(this.$(".modal__title").text() + "\n" + this.$("p").first().text())) {
          return this.confirm();
        } else {
          return this.deny();
        }
      },
      confirm: function() {
        this.trigger("confirm");
        return this.remove();
      },
      deny: function() {
        this.trigger("deny");
        return this.remove();
      },
      remove: function() {
        var tl;
        tl = new TimelineLite();
        tl.add(TweenMax.to(this.el, 0.3, {
          opacity: 0
        }));
        tl.add(TweenMax.to(this.el, 0, {
          display: "none"
        }));
        return this.trigger("remove");
      },
      onClickElement: function(e) {
        return e.stopPropagation();
      }
    });
  });

}).call(this);
