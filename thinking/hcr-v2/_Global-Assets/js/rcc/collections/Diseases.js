
/*
  Class: Diseases
  Extends: Backbone.Collection
  Allows high level manipulation of Disease objects.
  Delegates own changes to vent.
 */

(function() {
  define(["jquery", "underscore", "backbone", "rcc/rcc", "rcc/models/Disease"], function($, _, Backbone, rcc, Disease) {
    var Diseases;
    return Diseases = Backbone.Collection.extend({
      model: Disease,
      initialize: function() {
        this.on("change:checked", this.onChangeChecked);
        return this.on("change", this.onChange);
      },
      onChange: function() {
        return rcc.vent.trigger("statechanged");
      },
      onChangeChecked: function(d) {
        if (d.get("checked") !== true) {
          return;
        }
        return this.uncheck(this.where({
          checked: true
        }), d);
      },
      uncheck: function(diseases, except_this_one) {
        var disease, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = diseases.length; _i < _len; _i++) {
          disease = diseases[_i];
          if (disease !== except_this_one) {
            _results.push(disease.set("checked", false));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      },
      current: function() {
        return this.findWhere({
          checked: true
        });
      },
      female: function() {
        return this.where({
          female: true
        });
      },
      male: function() {
        return this.where({
          male: true
        });
      },
      intersection: function() {
        return this.where({
          male: true,
          female: true
        });
      }
    });
  });

}).call(this);
