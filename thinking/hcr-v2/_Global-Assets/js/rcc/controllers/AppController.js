/*
  Class: AppController
  Extends: Backbone.View
  This is theoretically a view, but it acts as a controller by maintaining the main views (rendering, transitioning)
  and syncing URL with application state.
 */
(function() {
  define(["jquery", "underscore", "backbone", "mixins", "TweenMax", "modernizr", "lib/Env", "rcc/models/URLBuilder", "rcc/rcc", "rcc/views/StartView", "rcc/views/CustomizeView", "rcc/views/HelpView", "rcc/views/ModalView", "rcc/views/AdvancedDataView"], function($, _, Backbone, mixins, TweenMax, Modernizr, Env, URLBuilder, rcc, StartView, CustomizeView, HelpView, ModalView, AdvancedDataView) {
    var AppController;
    return AppController = Backbone.View.extend({
      el: $(".rcc-container")[0],
      initialize: function() {
        _.bindAll(this, "onWindowResize", "onClickBtnAbout");
        this.model = rcc.model;
        this.views = {
          start: new StartView({
            model: this.model
          }),
          customize: new CustomizeView({
            model: this.model
          }),
          help: new HelpView({
            model: this.model
          }),
          advanced: new AdvancedDataView({
            model: this.model
          }),
          about: new ModalView({
            el: $(".rcc-about")[0]
          })
        };
        this.vent = rcc.vent;
        this.activeView = this.views["start"];
        this.listenTo(this.model, "change:params", this.updateState);
        this.listenTo(this.model, "change", this.updateUrl, this);
        this.listenTo(this.vent, "goto", this.onGotoRequest);
        this.listenTo(this.vent, "statechanged", this.updateUrl);
        this.listenTo(this.vent, "urlchanged", this.updateState);
        this.listenTo(this.vent, "hide", this.onHideModal);
        $(window).on("resize", this.onWindowResize);
        $(window).trigger("resize");
        $("select-element").on("scroll", function(e) {
          return e.stopPropagation();
        });
        $(".rcc-footer__item--about .rcc-button--about").on("click", this.onClickBtnAbout);
        return this.layoutIsDesktop = rcc.getsDesktop();
      },
      events: {
        "click .rcc-button--about": "onClickBtnAbout"
      },
      render: function(view) {
        if (!(view instanceof Backbone.View)) {
          if (this.views.hasOwnProperty(view)) {
            view = this.views[view];
          }
        }
        this.transitionTo(view);
        view.render();
        this.setActiveView(view);
        return this.updateUrl();
      },
      /*
      Fades out a view using a genericn animation.
      If the view provides it's own animation, this will be used instead.
       */
      fadeOutView: function(view) {
        var fadeOut;
        if (rcc.getsDesktop()) {
          if (_.isFunction(view.customFadeOut)) {
            return view.customFadeOut();
          }
        } else {
          if (_.isFunction(view.mobileCustomFadeOut)) {
            return view.mobileCustomFadeOut();
          }
        }
        fadeOut = new TimelineLite().pause();
        if (!view.$el.is(":visible")) {
          return fadeOut;
        }
        fadeOut.add(TweenLite.to(view.el, 0.25, {
          opacity: 0,
          ease: Quart.easeIn
        }));
        fadeOut.add(TweenLite.to(view.el, 0, {
          display: "none"
        }));
        return fadeOut;
      },
      /*
      Fades in a view using a genericn animation.
      If the view provides it's own animation, this will be used instead.
       */
      fadeInView: function(view) {
        var fadeIn;
        if (rcc.getsDesktop()) {
          if (_.isFunction(view.customFadeIn)) {
            return view.customFadeIn();
          }
        } else {
          if (_.isFunction(view.mobileCustomFadeIn)) {
            return view.mobileCustomFadeIn();
          }
        }
        fadeIn = new TimelineLite().pause();
        if (view.$el.is(":visible")) {
          return fadeIn;
        }
        fadeIn.add(TweenLite.to(view.el, 0, {
          opacity: 0,
          display: "block"
        }));
        fadeIn.add(TweenLite.to(view.el, 0.25, {
          opacity: 1,
          ease: Quart.easeIn
        }));
        return fadeIn;
      },
      /*
      Dynamically do the right transition,
      depending on wether any of activeView and current view are modals.
       */
      transitionTo: function(view) {
        if (rcc.getsDesktop()) {
          if (this.activeView && this.activeView.modal) {
            return this.transitionFromModal(view);
          } else {
            if (view.modal) {
              return this.transitionToModal(view);
            } else {
              return this.transitionToView(view);
            }
          }
        } else {
          return this.transitionToView(view);
        }
      },
      /*
      [Modal View] -> [Normal View]
       */
      transitionFromModal: function(view, oldView) {
        var tl;
        if (oldView == null) {
          oldView = this.activeView;
        }
        tl = new TimelineLite();
        tl.add(this.fadeOutView(oldView).play());
        tl.add(this.fadeInView(view).play());
        return $("body").css({
          overflow: "auto"
        });
      },
      /*
      [Normal View] -> [Modal View]
       */
      transitionToModal: function(view, oldView) {
        var tl;
        if (oldView == null) {
          oldView = this.activeView;
        }
        tl = new TimelineLite();
        tl.add(function() {
          return $(window).scrollTop(0);
        });
        if (!rcc.getsDesktop()) {
          tl.add(this.fadeOutView(oldView).play());
        }
        tl.add(this.fadeInView(view).play());
        if (rcc.getsDesktop()) {
          return $("body").css({
            "overflow": "hidden"
          });
        }
      },
      /*
      [Normal View] -> [Normal View]
       */
      transitionToView: function(view) {
        var tl;
        tl = new TimelineLite();
        if (this.activeView) {
          tl.add(this.fadeOutView(this.activeView).play());
        }
        tl.add(function() {
          return $(window).scrollTop(0);
        });
        return tl.add(this.fadeInView(view).play());
      },
      setActiveView: function(view) {
        this.previousView = this.activeView;
        this.model.set("step", view.step);
        return this.activeView = view;
      },
      /*
      Update the model's state with the raw params stored on that model.
       */
      updateState: function() {
        var params;
        params = this.validParamsFrom(this.model.get("params"));
        return this.model.set(params, {
          validate: true
        });
      },
      /*
      Build a URL from the model's state and silently navigate to that URL.
       */
      updateUrl: function() {
        var url;
        url = new URLBuilder([this.activeView.url, this.model.get("gender"), this.model.get("age"), this.model.get("diseaseId"), this.model.get("policyType"), this.model.get("severity"), this.model.get("insuranceId"), this.model.get("rentId"), this.model.get("incomeId"), this.model.get("familyId"), this.model.get("availableDeductible"), this.model.get("usedDeductible"), this.model.get("insuranceAfterDeductible"), this.model.get("primaryCarePer"), this.model.get("specialistPer"), this.model.get("primaryCareNum"), this.model.get("specialistNum"), this.model.get("genericDrugPer"), this.model.get("brandDrugPer"), this.model.get("specialtyDrugPer"), this.model.get("genericDrugNum"), this.model.get("brandDrugNum"), this.model.get("specialtyDrugNum"), this.model.get("diagnosticsPer"), this.model.get("imagingPer"), this.model.get("diagnosticsNum"), this.model.get("imagingNum"), this.model.get("erPer"), this.model.get("urgentPer"), this.model.get("erNum"), this.model.get("urgentNum"), this.model.get("hospital"), this.model.get("hospitalOpt")], {
          leadingSlash: false,
          trailingSlash: false
        }).get();
        //FIX: RCC Back Browser button bug.
        
        
        switch(Env.SEGMENT){
          case "individuals":
            $('.nav--top--breadcrumb').html('For Individuals /');
            break;
          case "agents":
            $('.nav--top--breadcrumb').html('For Agents /');
            break;
          case "brokers":
            $('.nav--top--breadcrumb').html('For Brokers /');
            break;
          case "employers":
            $('.nav--top--breadcrumb').html('For Employers /');
            break;
          default:
            $('.nav--top--breadcrumb').html('For Individuals /');
            break;
        }
        
        return rcc.router.navigate(url,{replace:true});
      },
      /*
      Position the elements of modal views in their appropriate position in the DOM.
       */
      repositionModals: function() {
        var modalViews, view, _i, _j, _len, _len1;
        modalViews = _.filter(this.views, function(view) {
          return view.modal;
        });
        if (rcc.getsDesktop()) {
          for (_i = 0, _len = modalViews.length; _i < _len; _i++) {
            view = modalViews[_i];
            view.$el.appendTo($("body"));
          }
        } else {
          for (_j = 0, _len1 = modalViews.length; _j < _len1; _j++) {
            view = modalViews[_j];
            view.$el.appendTo(view.$originalParent);
          }
        }
        if (this.activeView.modal && this.layoutChanged()) {
          return this.transitionToModal(this.activeView, this.previousView);
        }
      },
      /*
      Handle a request to go to a view with a given viewname
       */
      onGotoRequest: function(viewname) {
        var view;
        if (this.views.hasOwnProperty(viewname)) {
          view = this.views[viewname];
        }
        view = view || this.previousView;
        if (this.mayRender(view)) {
          return this.render(view);
        }
      },
      onWindowResize: function() {
        var $main, newMinHeight, originalMin;
        this.repositionModals();
        /*
        Scale main containers to fill the available space.
         */
        $main = $(".main");
        originalMin = $main.data("originalMin");
        if (!originalMin) {
          $main.data("originalMin", $main.css("min-height"));
          originalMin = $main.css("min-height");
        }
        if (!rcc.getsDesktop()) {
          return $main.css({
            "min-height": "auto"
          });
        }
        newMinHeight = rcc.getsDesktop() ? this.getHeightForMain() : "none";
        return $main.css({
          "min-height": Math.max(parseInt(originalMin, 10), newMinHeight)
        });
      },
      onClickBtnAbout: function(e) {
        return this.transitionToModal(this.views.about);
      },
      onHideModal: function(modalView) {
        return this.transitionFromModal(this.activeView, modalView);
      },
      /*
      Check if the layout has changed since the last time.
       */
      layoutChanged: function() {
        var newLayout, oldLayout;
        newLayout = rcc.getsDesktop();
        oldLayout = this.layoutIsDesktop;
        this.layoutIsDesktop = newLayout;
        if (oldLayout === newLayout) {
          return false;
        } else {
          return true;
        }
      },
      /*
      Calculate the available space on the screen.
      Window height minus height of elements like nav, footer etc.
       */
      getHeightForMain: function() {
        var $disclaimer, $footer, $navBar, $navTop, $segMenu, domObjectHeight;
        this.$domObjects = this.$domObjects || {};
        $footer = this.$domObjects.footer || (this.$domObjects.footer = $("#footer"));
        $disclaimer = this.$domObjects.disclaimer || (this.$domObjects.disclaimer = $(".rcc-disclaimer"));
        $navTop = this.$domObjects.navTop || (this.$domObjects.navTop = $(".nav--top.nav--desktop"));
        $segMenu = this.$domObjects.segMenu || (this.$domObjects.segMenu = $(".w_segmenu"));
        $navBar = this.$domObjects.navBar || (this.$domObjects.navBar = $(".w_nav-bar"));
        domObjectHeight = $footer.outerHeight() + $disclaimer.outerHeight() + $navTop.outerHeight() + $segMenu.outerHeight() + $navBar.outerHeight();
        return $(window).height() - domObjectHeight;
      },
      /*
      Determine wether current state allows rendering a given view.
       */
      mayRender: function(view) {
        if (view === null) {
          return false;
        }
        return view.allowWithInvalidState || view.step <= this.activeView.step || this.model.isValid();
      },
      /*
      Remove all invalid params from an object of raw params.
       */
      validParamsFrom: function(rawParams) {
        return _.compactObject(rawParams);
      }
    });
  });
}).call(this);