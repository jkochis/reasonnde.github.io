
/*
  Class: Policy
  Extends: Backbone.Model
  A lean model that stores data about a disease.
 */

(function() {
  define(["jquery", "underscore", "rcc/models/BackboneGS", "rcc/models/Policy", "rcc/rcc"], function($, _, BackboneGS, Policy, rcc) {

    /*
      Grab aflacInsurancesData from data file and create a collection from it.
     */
    var aflacInsurances;
    aflacInsurances = new Backbone.Collection(rcc.data.aflacInsurancesData);
    return Policy = Backbone.GSModel.extend({
      defaults: {
        checked: true
      },
      initialize: function() {
        return this.on("change:checked", this.onChangeChecked);
      },
      onChangeChecked: function() {
        return rcc.vent.trigger("change:disease:policies");
      },
      setters: {
        aflacInsurance: function(id) {
          return aflacInsurances.findWhere({
            id: id
          });
        }
      },
      getters: {
        name: function() {
          return this.get("aflacInsurance").get("name");
        },
        desc: function() {
          return this.get("aflacInsurance").get("desc");
        },
        availability: function() {
          return this.get("aflacInsurance").get("availability");
        },
        img: function() {
          return this.get("aflacInsurance").get("img");
        },

        /*
          Return the coverage of a policy for the current severity
         */
        coverage: function() {
          var severity;
          if (!(severity = rcc.model.get("severity"))) {
            return 0;
          }
          return this.get(severity);
        }
      }
    });
  });

}).call(this);
