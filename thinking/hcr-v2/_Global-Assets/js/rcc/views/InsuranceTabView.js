
/*
  Class: InsuranceTabView
  Extends: BaseView
  Renders insurance selects/dropdowns and initializes AdvancedDataView.
 */

(function() {
  define(["modernizr", "jquery.hoverIntent", "rcc/rcc", "rcc/views/BaseView"], function(Modernizr, hoverIntent, rcc, BaseView) {
    var InsuranceView;
    return InsuranceView = BaseView.extend({
      initialize: function() {
        this.listenTo(this.model, "invalid", this._handleErrors);
        this.$major = this.$(".rcc-insurance--major");
        this.$marketplace = this.$(".rcc-insurance--marketplace");
        return this.$el.hoverIntent((function(_this) {
          return function(e) {
            return _this._onHoverTooltipShow(e);
          };
        })(this), ".rcc-button--tooltip");
      },
      events: {
        "click      .insurance": "_onInsuranceChange",
        "click      .rcc-insurance--major": "_showMajorCoverage",
        "click      .rcc-insurance--marketplace": "_showMarketplaceCoverage",
        "click      .rcc-insurance--advanced .rcc-insurance__title": "_showAdvancedCoverage",
        "click      .tooltip .rcc-button--close": "_onClickTooltipClose",
        "click      .rcc-insurance .rcc-button--tooltip": "_onClickTooltipShow",
        "click      .tooltip": "_onClickTooltip"
      },
      render: function() {
        var $fieldsetAdv, $fieldsetMaj, $fieldsetMrk, advancedInsurances, majorInsurances, marketplaceInsurances;
        switch (this.model.get("insuranceType")) {
          case "major":
            this._showMajorCoverage();
            break;
          case "marketplace":
            this._showMarketplaceCoverage();
        }
        majorInsurances = this.model.insurances.where({
          type: "major"
        });
        $fieldsetMaj = this.$(".rcc-insurance--major .fieldset--insurance");
        $fieldsetMaj.empty().html(this._markupFor(majorInsurances));
        $fieldsetMaj.addClass("item-count--" + majorInsurances.length);
        marketplaceInsurances = this.model.insurances.where({
          type: "marketplace"
        });
        $fieldsetMrk = this.$(".rcc-insurance--marketplace .fieldset--insurance");
        $fieldsetMrk.empty().html(this._markupFor(marketplaceInsurances));
        $fieldsetMrk.addClass("item-count--" + marketplaceInsurances.length);
        advancedInsurances = this.model.insurances.where({
          type: "advanced"
        });
        $fieldsetAdv = this.$(".rcc-insurance--advanced .fieldset--insurance");
        $fieldsetAdv.empty().html(this._markupFor(advancedInsurances));
        $fieldsetAdv.addClass("item-count--" + advancedInsurances.length);
        this.$(".rcc-insurance").not(".checked").find(".fieldset--insurance").hide();
        if (!(this.$(".rcc-insurance.checked").length || this.model.get("insurance"))) {
          return this._initPrompt();
        }
      },
      _showMajorCoverage: function() {
        this._showCoverage(this.$major);
        return this._hideCoverage(this.$marketplace);
      },
      _showMarketplaceCoverage: function() {
        this._showCoverage(this.$marketplace);
        return this._hideCoverage(this.$major);
      },
      _showCoverage: function($el) {
        if ($el == null) {
          $el = $();
        }
        $el.addClass("checked");
        $el.find(".fieldset--insurance").slideDown("fast");
        return this.$(".tooltip--prompt").appendTo($el);
      },
      _hideCoverage: function($el) {
        if ($el == null) {
          $el = this.$(".rcc-insurance");
        }
        $el.removeClass("checked");
        return $el.find(".fieldset--insurance").slideUp("fast");
      },
      _showAdvancedCoverage: function() {
        this._hideCoverage();
        if (this._promptTimeout) {
          clearTimeout(this._promptTimeout);
        }
        return rcc.vent.trigger("goto", "advanced");
      },
      _handleErrors: function() {
        var errors;
        this._clearPrompt();
        errors = this.model.validationError;
        if (errors.hasOwnProperty("insurance")) {
          this._showError();
        }
        return this._scrollToFirstError();
      },
      _showError: function() {
        var errorTooltipMarkup;
        if (!this.$errorTooltip) {
          errorTooltipMarkup = "<div class='tooltip tooltip--error tooltip--insurance'>";
          errorTooltipMarkup += "<p class='tooltip__text'></p>";
          errorTooltipMarkup += "<button type='button' class='rcc-button rcc-button--close'>Close</button></div>";
          this.$errorTooltip = $(errorTooltipMarkup).hide();
        }
        this._hideTooltip(this.$errorTooltip);
        return setTimeout((function(_this) {
          return function() {
            var $activeInsuranceType;
            _this.$errorTooltip.find(".tooltip__text").empty().html(_this.$el.data("validationError"));
            if (($activeInsuranceType = _this.$(".rcc-insurance.checked")).length) {
              _this.$errorTooltip.appendTo($activeInsuranceType);
            } else {
              _this.$errorTooltip.appendTo(_this.$el);
            }
            return _this._showTooltip(_this.$errorTooltip);
          };
        })(this), 200);
      },
      _onInsuranceChange: function(e) {
        var $insurance;
        this._clearPrompt();
        $insurance = $(e.currentTarget);
        this.model.set("insurance", $insurance.data("value"));
        this.$(".rcc-range__item").not($insurance).removeClass("checked");
        return $insurance.addClass("checked");
      },
      _onHoverTooltipShow: function(e) {
        var $insuranceEl, $tooltip;
        $insuranceEl = $(e.target).closest(".rcc-insurance");
        $tooltip = $insuranceEl.find(".tooltip--help");
        return this._toggleTooltip($tooltip);
      },
      _onClickTooltipShow: function(e) {
        var $insuranceEl, $tooltip;
        e.stopPropagation();
        $insuranceEl = $(e.target).closest(".rcc-insurance");
        $tooltip = $insuranceEl.find(".tooltip--help");
        this._hideTooltip(this.$(".tooltip--help").not($tooltip));
        return this._showTooltip($tooltip);
      },
      _markupFor: function(insurances) {
        var checked, currentInsurance, i, id, insurance, markup, specialClass, _i, _len;
        currentInsurance = this.model.get("insurance");
        markup = "";
        for (i = _i = 0, _len = insurances.length; _i < _len; i = ++_i) {
          insurance = insurances[i];
          specialClass = "";
          id = insurance.get("id");
          checked = insurance === currentInsurance;
          if (i === 0) {
            specialClass = "first";
          } else if (i === insurances.length - 1) {
            specialClass = "last";
          }
          markup += "<div class='rcc-range__item checkable insurance";
          markup += " item--" + i;
          if (specialClass) {
            markup += " " + specialClass;
          }
          if (checked) {
            markup += " checked";
          }
          markup += "' data-value='" + insurance.get("id") + "'>";
          markup += "<span class='rcc-range__indicator input__indicator'>";
          markup += "<span class='rcc-range__label'>" + insurance.get("name") + "</span>";
          markup += "</span>";
          markup += "</div>";
        }
        return markup;
      }
    });
  });

}).call(this);
