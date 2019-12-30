(function() {
  define(["jquery", "underscore", "backbone"], function($, _, Backbone) {
    var Disease;
    return Disease = Backbone.View.extend({
      initialize: function() {
        this.listenTo(this.model, "change:checked", this.onCheckedChange);
        return this.onCheckedChange();
      },
      tagName: "label",
      className: "input input--radio disease",
      events: {
        "click .input__field": "onInput",
        "change .input__field": "onInput"
      },
      attributes: {
        "data-item-name": "rcc-dis"
      },
      render: function() {
        var markup, options;
        options = "";
        if (this.model.get("checked")) {
          options += "checked";
        }
        markup = "<span class='input__indicator'></span>";
        markup += '<input class="input__field" type="radio" name="' + this.attributes["data-name"] + '" value="' + this.model.get('id') + '" id="' + this.attributes["for"] + '" ' + options + '>';
        markup += '<span class="input__label-text">' + this.model.get('name') + '</span>';
        this.el.innerHTML = markup;
        return this;
      },
      onInput: function() {
        return this.model.set("checked", true);
      },
      onCheckedChange: function() {
        if (this.model.get("checked")) {
          return this.$el.addClass("checked");
        } else {
          return this.$el.removeClass("checked");
        }
      }
    });
  });

}).call(this);
