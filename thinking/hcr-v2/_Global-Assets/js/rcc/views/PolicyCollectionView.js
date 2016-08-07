
/*
  Class: PolicyCollectionView
  Extends: Backbone.View
  Renders a bunch of Policies and keeps them up2date with underlying collection
 */

(function() {
  define(["jquery", "underscore", "backbone", "rcc/views/PolicyView"], function($, _, Backbone, PolicyView) {
    var PolicyCollectionView;
    return PolicyCollectionView = Backbone.View.extend({
      initialize: function() {
        this.listenTo(this.model, "change:disease", this._onModelChange);
        return this.listenTo(this.model, "change:policyType", this._onModelChange);
      },
      add: function(policy) {
        var dv;
        dv = new PolicyView({
          model: policy
        });
        this._policyViews.push(dv);
        if (this._rendered) {
          return this.$el.append(dv.render().el);
        }
      },
      getViewForPolicy: function(model) {
        return _(this._policyViews).select(function(cv) {
          return cv.model === model;
        })[0];
      },
      initSubViews: function() {
        var newPolicyView, policy, _i, _len, _ref, _results;
        this.collection = this.model.get("policies");
        this._policyViews = [];
        _ref = this.collection.cappedToLimit();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          policy = _ref[_i];
          newPolicyView = new PolicyView({
            model: policy,
            attributes: {
              "for": this.attributes["data-item-idprefix"] + policy.get("aflacInsurance").get("id"),
              "data-name": this.attributes["data-item-name"],
              "data-on": this.$el.data("on"),
              "data-off": this.$el.data("off")
            }
          });
          _results.push(this._policyViews.push(newPolicyView));
        }
        return _results;
      },
      remove: function(policy) {
        var viewToRemove;
        viewToRemove = this.getViewForPolicy(policy);
        this._policyViews = _(this._policyViews).without(viewToRemove);
        if (this._rendered) {
          return viewToRemove.el.remove();
        }
      },
      render: function(params) {
        var $policies, $policyContainer, direction, tl;
        if (params == null) {
          params = {};
        }
        this.initSubViews();
        this._rendered = true;
        $policies = this.$(".policy");
        direction = rcc.getsDesktop() ? "Y" : "X";
        tl = new TimelineLite();
        $policyContainer = this.$(".rcc-collection--policy");
        $policyContainer.css({
          "min-height": $policyContainer.height()
        });
        if (params.fadeout) {
          _($policies).each(function(policy, i) {
            return tl.add(TweenMax.fromTo(policy, 0.5, {
              transform: "translate" + direction + "(0)"
            }, {
              transform: "translate" + direction + "(-800px)",
              ease: Power2.easeIn
            }), "-=0.45");
          });
        } else {
          $policies.css({
            transform: "translate" + direction + "(-800px)"
          });
        }
        tl.add((function(_this) {
          return function() {
            _this.$el.empty();
            return _(_this._policyViews).each(function(dv, i) {
              var policy;
              policy = dv.render().el;
              _this.$el.append(policy);
              return TweenMax.fromTo(policy, 0.5, {
                transform: "translate" + direction + "(-800px)"
              }, {
                transform: "translate" + direction + "(0)",
                ease: Power2.easeOut
              }).delay(i * 0.05);
            });
          };
        })(this), 0.75);
        tl.add(TweenMax.set($policyContainer.css({
          "min-height": "none"
        })));
        return this;
      },
      _onModelChange: function() {
        if (this.$el.is(":visible")) {
          return this.render({
            fadeout: true
          });
        }
      }
    });
  });

}).call(this);
