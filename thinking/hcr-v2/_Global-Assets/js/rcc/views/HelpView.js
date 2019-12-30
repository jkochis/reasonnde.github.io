
/*
  Class: HelpView
  Extends: Backbone.View
  Main view for last step.
 */

(function() {
  define(["Select", "TweenMax", "rcc/rcc", "rcc/views/BaseView", "rcc/views/DiseaseSelectView", "rcc/views/PolicyCollectionView", "rcc/views/SplitFlapView"], function(Select, TweenMax, rcc, BaseView, DiseaseSelectView, PolicyCollectionView, SplitFlapView) {
    var HelpView;
    return HelpView = BaseView.extend({
      initialize: function() {
        this.vent = rcc.vent;
        this.$el.hide();
        this.$rccPolicySelect = this.$(".rcc-help-policy-type");
        this.listenTo(this.model, "change", this._renderTotalCosts);
        this.listenTo(this.model, "change", this._renderHowAflacHelps);
        this.listenTo(this.model, "change", this._renderRemainingExpenses);
        this.listenTo(rcc.vent, "change:disease:policies", this._renderHowAflacHelps);
        this.listenTo(rcc.vent, "change:disease:policies", this._renderRemainingExpenses);
        this.totalSplitDisplay = new SplitFlapView({
          el: this.$(".total-costs.price")[0]
        });
        this.helpSplitDisplay = new SplitFlapView({
          el: this.$(".how-aflac-helps.price")[0]
        });
        this.remainingSplitDisplay = new SplitFlapView({
          el: this.$(".remaining-expenses.price")[0]
        });
        this.policyTypeSelect = new Select({
          el: this.$rccPolicySelect[0],
          className: "select-theme-green"
        });
        $(".rcc-button--quote").on("click", this._onClickButtonQuote);
        return this.pcv = new PolicyCollectionView({
          collection: this.model.get("policies"),
          model: this.model,
          el: this.$(".rcc-collection--policy")[0],
          attributes: {
            "data-item-name": "rcc-step3-policies",
            "data-item-idprefix": "rcc-step3-policies--"
          }
        });
      },
      events: {
        "change .rcc-help-policy-type": "_onPolicyTypeChange",
        "click .goto-step-1": "_onStep1",
        "click .goto-step-2": "_onStep2"
      },
      el: $('.step--help'),
      url: "help",
      step: 3,
      render: function() {
        if (!this.$el.is(":visible")) {
          return;
        }
        if (rcc.getsDesktop()) {
          this._fadeDuck;
        }
        if (window.utag) {
            utag.link({_ga_category: 'real cost calculator',_ga_action: 'complete'});
        }
        this._renderTotalCosts();
        this._renderHowAflacHelps();
        this._renderRemainingExpenses();
        this._renderDiseases();
        this._renderPolicies();
        return this._updateDisclaimer({
          mode: "extended"
        });
      },
      _renderTotalCosts: function() {
        var total;
        if (!this.$el.is(":visible")) {
          return;
        }
        total = this.model.get("total");
        return this.totalSplitDisplay.change(total);
      },
      _renderHowAflacHelps: function() {
        var howAflacHelpsAmount;
        if (!this.$el.is(":visible")) {
          return;
        }
        howAflacHelpsAmount = this.model.get("howAflacHelps");
        this.helpSplitDisplay.change(howAflacHelpsAmount);
        this.$rccPolicySelect.val(this.model.get("policyType"));
        this.policyTypeSelect.update();
        return this.$(".rcc-howaflachelps-cue .price__amount").text(howAflacHelpsAmount.formatMoney(0, ".", ","));
      },
      _renderRemainingExpenses: function() {
        if (!this.$el.is(":visible")) {
          return;
        }
        return this.remainingSplitDisplay.change(this.model.get("remainingExpenses"));
      },
      _renderDiseases: function() {
        var dsv;
        if (!this.$el.is(":visible")) {
          return;
        }
        dsv = new DiseaseSelectView({
          collection: this.model.diseasesForGender(),
          model: this.model,
          el: this.$(".rcc-diseases")[0]
        });
        return dsv.render();
      },
      _renderPolicies: function() {
        if (!this.$el.is(":visible")) {
          return;
        }
        this.pcv.collection = this.model.get("policies");
        return this.pcv.render();
      },
      _onStep1: function() {
        return rcc.vent.trigger("goto", "start");
      },
      _onStep2: function() {
        return rcc.vent.trigger("goto", "customize");
      },
      _onPolicyTypeChange: function() {
          if (window.utag) {
            utag.link({_ga_category: 'real cost calculator',_ga_action: 'form detail: how aflac helps dropdown',_ga_label: ''+this.$rccPolicySelect.val()+''});
          }  

        return this.model.set({
          policyType: this.$rccPolicySelect.val()
        });
      },
      _onClickButtonQuote: function(e) {
        $(e.currentTarget).blur();
        return $(".contact-trigger").trigger("click");
      },
      _fadeDuck: function() {
        return TweenMax.fromTo(this.$(".rcc-costs-overview"), 0.5, {
          "background-position-x": "150%"
        }, {
          "background-position-x": "100%"
        }).delay(0.2);
      }
    });
  });

}).call(this);
