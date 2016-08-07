(function() {
  define(["modernizr", "jquery.hoverIntent", "rcc/views/BaseView"], function(Modernizr, hoverIntent, BaseView) {
    var Disease;
    return Disease = BaseView.extend({
      initialize: function() {
        _.bindAll(this, "_onMouseEnter", "_onMouseOut");
        if (this.attributes["tooltip"]) {
          return this.$el.hoverIntent(this._onMouseEnter, this._onMouseOut);
        }
      },
      tagName: "span",
      className: "input input--radio disease",
      events: {
        "click": "_onInput"
      },
      attributes: {
        "data-item-name": "rcc-dis"
      },
      render: function() {
        var id, markup;
        id = this.model.get("id");
        markup = "<i class='icon " + id + "'></i>";
        markup += '<span class="input__label-text">' + this.model.get('name') + '</span>';
        markup += "<br><span class='input__indicator'></span>";
        this.el.innerHTML = markup;
        this.$el.attr("data-value", id);
        if (this.attributes["tooltip"]) {
          this._renderTooltip();
        }
        if (this.model.get("checked")) {
          this.$el.addClass("checked");
        }
        return this;
      },
      _renderTooltip: function() {
        var $tooltip;
        $tooltip = $(this._getTooltipMarkup());
        $tooltip.appendTo($("body"));
        return this.$el.data("tooltip", $tooltip);
      },
      index: function() {
        return this.$el.index();
      },
      _getTooltipMarkup: function() {
        var tooltip;
        tooltip = '<div class="tooltip tooltip--help tooltip--medtext">';
        tooltip += '<h4 class="tooltip__title">' + this.model.get("name") + '</h4>';
        tooltip += '<div class="tooltip__text">';
        tooltip += '<p>' + this._getTooltipText() + '</p>';
        tooltip += '</div>';
        return tooltip += '</div>';
      },
      _showTooltip: function() {
        var $tooltip, offset;
        $tooltip = this.$el.data("tooltip");
        $tooltip.find(".tooltip__text").text(this._getTooltipText());
        offset = this.$el.offset();
        $tooltip.css({
          top: (offset.top + (this.$el.outerHeight() / 2)) - ($tooltip.outerHeight() / 2),
          left: offset.left - $tooltip.outerWidth()
        });
        return BaseView.prototype._showTooltip.apply(this, [$tooltip]);
      },
      _getTooltipText: function() {
        var age, gender;
        gender = rcc.model.get("gender");
        age = rcc.model.get("age");
        return this.model.getDescription(gender, age);
      },
      _onInput: function() {
        return this.$el.addClass("checked");
      },
      _onMouseEnter: function() {
        if (Modernizr.touch) {
          return;
        }
        return this._showTooltip();
      },
      _onMouseOut: function() {
        return this._hideTooltip(this.$el.data("tooltip"));
      }
    });
  });

}).call(this);
