
/*
  Class: MaleDiseases
  Extends: Diseases
  Orders diseases by order.male attribute
 */

(function() {
  define(["jquery", "underscore", "backbone", "rcc/rcc", "rcc/collections/Diseases"], function($, _, Backbone, rcc, Diseases) {
    var MaleDiseases;
    return MaleDiseases = Diseases.extend({
      comparator: function(d1, d2) {
        var d1Order, d2Order;
        d1Order = d1.get("order").male;
        d2Order = d2.get("order").male;
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
