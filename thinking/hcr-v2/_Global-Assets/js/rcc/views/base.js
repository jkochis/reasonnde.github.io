(function() {
  define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
    var BaseView;
    return BaseView = Backbone.View.extend({
      initialize: function() {
        this.vent = rcc.vent;
        this.listenTo(this.model, "change", this.render);
        this.$el.hide();
        return this.updateState();
      },
      events: {
        "input input,textarea,select": "updateState",
        "change input,textarea,select": "updateState"
      },
      updateState: function() {
        return this.model.set(this.evaluateForm());
      }
    });
  });

}).call(this);
