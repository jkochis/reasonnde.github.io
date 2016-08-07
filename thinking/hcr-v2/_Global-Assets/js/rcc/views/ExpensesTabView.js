
/*
  Class: ExpensesTabView
  Extends: Backbone.View
  Renders detailed expenses for current state.
 */

(function() {
  define(["jquery", "underscore", "backbone"], function($, _, Backbone) {
    var ExpensesTabView;
    return ExpensesTabView = Backbone.View.extend({
      attributes: {
        tagName: "ul"
      },
      events: {
        "click .rcc-expenses__show": "_onExpensesDetailsToggle"
      },
      initialize: function() {
        this._$expenses = {
          medical: this.$(".expense--medical"),
          household: this.$(".expense--household"),
          oop: this.$(".expense--oop")
        };
        this._$tab = this.$(".rcc-expenses__tab");
        this.listenTo(this.model, "change", this.render);
        return this.listenTo(this.model.get("diseases"), "change:checked", this._onDiseaseChange);
      },
      render: function() {
        if (!this.$el.is(":visible")) {
          return;
        }
        this._renderMedical();
        this._renderHousehold();
        return this._renderOop();
      },
      _renderMedical: function() {
        return this._renderExpense({
          $el: this._$expenses.medical,
          text: this.model.get("texts").medical,
          costs: this.model.get("medical")
        });
      },
      _renderHousehold: function() {
        return this._renderExpense({
          $el: this._$expenses.household,
          text: this.model.get("texts").household,
          costs: this.model.get("household")
        });
      },
      _renderOop: function() {
        return this._renderExpense({
          $el: this._$expenses.oop,
          text: this.model.get("texts").oop,
          costs: this.model.get("oop")
        });
      },
      _renderExpense: function(args) {
        args.$el.find(".expense__text").text(args.text);
        if (args.costs) {
          return args.$el.find(".price__amount").text(args.costs.formatMoney(0, ".", ","));
        }
      },
      _onDiseaseChange: function() {
        if (!this.$el.is(":visible")) {
          return;
        }
        this._renderMedical();
        this._renderHousehold();
        return this._renderOop();
      },
      _onExpensesDetailsToggle: function() {
        this._$tab.slideToggle();
        return this.$el.toggleClass("expanded");
      }
    });
  });

}).call(this);
