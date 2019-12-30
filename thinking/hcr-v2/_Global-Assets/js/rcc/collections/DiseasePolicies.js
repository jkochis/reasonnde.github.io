
/*
  Class: Policies
  Extends: Backbone.Collection
  Allows high level manipulation of Policy objects.
  Delegates own changes to vent.
 */

(function() {
  define(["jquery", "underscore", "backbone", "rcc/rcc", "rcc/models/DiseasePolicy"], function($, _, Backbone, rcc, Policy) {
    var DiseasePolicies;
    return DiseasePolicies = Backbone.Collection.extend({
      model: DiseasePolicy,
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
      }
    });
  });

}).call(this);
