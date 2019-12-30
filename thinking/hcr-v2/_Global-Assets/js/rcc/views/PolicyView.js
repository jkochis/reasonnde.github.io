
/*
  Class: PolicyView
  Extends: Backbone.View
  Displays an individual policy
 */

(function() {
  define(["jquery", "underscore", "backbone"], function($, _, Backbone) {
    var PolicyView;
    return PolicyView = Backbone.View.extend({
      tagName: "div",
      className: "input input--checkbox policy",
      events: {
        "click": "onInput"
      },
      attributes: {
        "data-item-name": "rcc-policy",
        "for": "rcc-policy--",
        "data-on": "On",
        "data-off": "Off"
      },
      render: function() {
        var markup, options;
        options = "";
        if (this.model.get("checked")) {
          options += "checked";
        } else {
          options += "unchecked";
        }
        markup = '<span class="policy__image policy__image--' + this.model.get("img") + '"></span>';
        markup += '<span class=input__label-text>';
        markup += "<strong class=policy__name>" + this._getName() + "</strong>";
        markup += "<span class='price policy__coverage'>";
        markup += "<span class='price__currency'>" + rcc.data.currency + "</span>";
        markup += "<span class='price__amount'>" + this.model.get("coverage").formatMoney(0, ".", ",") + "</span>";
        markup += "</span>";
        markup += "<span class='input__indicator " + options + "'>";
        markup += "<span class='thumb'>";
        markup += "<em class='on'>" + this.attributes["data-on"] + "</em>";
        markup += "<em class='off'>" + this.attributes["data-off"] + "</em>";
        markup += "</span>";
        markup += "</span>";
        markup += "<strong class=policy__description>" + this.model.get("desc") + "</strong>";
        markup += "<strong class=policy__availability>" + this.model.get("availability") + "</strong>";
        markup += '</span>';
        this.el.innerHTML = markup;
        if (this.model.get("checked")) {
          this.$el.addClass("checked");
        } else {
          this.$el.removeClass("checked");
        }
        return this;
      },
      onInput: function() {
        if (this.$el.hasClass("checked")) {
          this.$el.removeClass("checked");
          return this.model.set("checked", false);
        } else {
          this.$el.addClass("checked");
          return this.model.set("checked", true);
        }
      },
      _getName: function() {
        var disName, disease, diseasePattern, rawName;
        rawName = this.model.get("name");
        diseasePattern = "Specified Health Event";
        if (rawName.indexOf(diseasePattern) !== -1) {
          disease = rcc.model.get("disease");
          if (!(disName = disease.get("name"))) {
            return rawName;
          }
          return rawName.replace(diseasePattern, disName.length > 13 && $(window).width() > 420 ? disName.substr(0, 10) + "..." : disName);
        }
        return rawName;
      }
    });
  });

}).call(this);
