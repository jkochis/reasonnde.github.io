
/*
  Class: Policies
  Extends: Backbone.Collection
  Allows high level manipulation of Policy objects.
  Delegates own changes to vent.
 */

(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define(["jquery", "underscore", "backbone", "rcc/rcc", "rcc/models/Policy"], function($, _, Backbone, rcc, Policy) {
    var Policies;
    return Policies = Backbone.Collection.extend({
      model: Policy,
      initialize: function() {
        return this.on("change", this.onChange);
      },
      onChange: function() {
        return rcc.vent.trigger("statechanged");
      },
      checked: function() {
        return this.where({
          checked: true
        });
      },
      cappedToLimit: function() {
        var combinedCoverage, coverage, current, i, insuranceList, limit, severity, sorted;
        limit = rcc.model.get("total");
        severity = rcc.model.get("severity");
        sorted = _.sortBy(this.models, function(policy) {
          return policy.get(severity);
        });
        combinedCoverage = 0;
        i = 0;
        insuranceList = [];
        while (i < sorted.length) {
          current = sorted[i];
          coverage = current.get(severity);
          if ((combinedCoverage + coverage) >= limit) {
            break;
          }
          insuranceList.push(current.get("aflacInsurance"));
          combinedCoverage += coverage;
          i++;
        }
        return _.filter(this.models, function(policy) {
          var _ref;
          return _ref = policy.get("aflacInsurance"), __indexOf.call(insuranceList, _ref) >= 0;
        });
      }
    });
  });

}).call(this);
