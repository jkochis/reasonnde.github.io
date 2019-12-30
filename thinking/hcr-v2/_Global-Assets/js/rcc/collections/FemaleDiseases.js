
/*
  Class: FemaleDiseases
  Extends: Diseases
  Orders diseases by order.female attribute
 */

(function() {
  define(["jquery", "underscore", "backbone", "rcc/rcc", "rcc/collections/Diseases"], function($, _, Backbone, rcc, Diseases) {
    var FemaleDiseases;
    return FemaleDiseases = Diseases.extend({
      comparator: function(d1, d2) {
        var d1Order, d2Order;
        d1Order = d1.get("order").female;
        d2Order = d2.get("order").female;
        if (d1Order < d2Order) {
          return -1;
        }
        if (d1Order === d2Order) {
          return 0;
        }
        if (d1Order > d2Order) {
          return 1;
        }
      }
    });
  });

}).call(this);
