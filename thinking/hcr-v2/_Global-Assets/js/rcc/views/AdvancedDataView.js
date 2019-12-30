
/*
  Class: AdvancedDataView
  Extends: Backbone.View
  Syncs the model to the advanced tab (where all the specifics of insurance etc. can be filled in).
 */

(function() {
  define(["Select", "modernizr", "rcc/views/BaseView", "rcc/views/ModalView", "rcc/views/PromptView", "rcc/views/FamilySelectView"], function(Select, Modernizr, BaseView, ModalView, PromptView, FamilySelectView) {
    var AdvancedDataView;
    return AdvancedDataView = ModalView.extend({
      initialize: function() {
        _.bindAll(this, "render", "_onCancelButtonClick", "_onSaveButtonClick", "_onTooltipShow", "_onWindowResize");
        $(window).on("resize", this._onWindowResize);
        Select.init({
          selector: ".rcc-advanced select",
          className: "select-theme-default advanced-tab"
        });
        this.exitPrompt = new PromptView({
          el: this.$(".prompt--exit")[0]
        });
        $("body").append(this.exitPrompt.render().$el.hide());
        this.familySelectView = new FamilySelectView({
          el: this.$(".rcc-adv-family")
        });
        this.familySelectView.render();
        this.$originalParent = this.$el.parent();
        this._storeDOMNodes();
        if (!Modernizr.touch) {
          this.$el.hoverIntent((function(_this) {
            return function(e) {
              return _this._onTooltipShow(e);
            };
          })(this), (function(_this) {
            return function(e) {
              return _this._onLeaveTooltipShow(e);
            };
          })(this), ".rcc-button--tooltip");
        }
        return this._initTooltips();
      },
      step: 2,
      url: "customize",
      el: $(".rcc-advanced")[0],
      events: {
        "click .nav__button--previous": "_onCancelButtonClick",
        "click .rcc-button--deny": "_onCancelButtonClick",
        "click .rcc-button--confirm": "_onSaveButtonClick",
        "click > .inner": "_onInnerElementClick",
        "click": "_onOuterElementClick",
        "click .rcc-adv-severity .checkable": "_onClickSeverityItem",
        "click .rcc-hospital": "_onClickHospitalOption",
        "change select[name=rcc-severity]": "_updateSeverity",
        "click .rcc-button--tooltip": "_onTooltipShow",
		"click .select-target": "_onInitiate",
		"click .rcc-adv-family__button": "_onInitiate",
		"click .input__indicator ": "_onInitiate"
      },
      render: function() {
        var family, income, rent;
        if (!(Modernizr.touch || !rcc.getsDesktop())) {
          this.$el.appendTo($("body"));
        }
        if (window.utag) {
            utag.link({_ga_category: 'real cost calculator',_ga_action: 'advanced options interactions',_ga_label: 'view'});
        }    
        this.$selects.ad.val(this.model.get("availableDeductible"));
        this.$selects.bdc.val(this.model.get("brandDrugPer"));
        this.$selects.bdn.val(this.model.get("brandDrugNum"));
        this.$selects.dgc.val(this.model.get("diagnosticsPer"));
        this.$selects.dgn.val(this.model.get("diagnosticsNum"));
        this.$selects.erc.val(this.model.get("erPer"));
        this.$selects.ern.val(this.model.get("erNum"));
        this.$selects.gdc.val(this.model.get("genericDrugPer"));
        this.$selects.gdn.val(this.model.get("genericDrugNum"));
        this.$selects.imc.val(this.model.get("imagingPer"));
        this.$selects.imn.val(this.model.get("imagingNum"));
        this.$selects.iad.val(this.model.get("insuranceAfterDeductible"));
        this.$selects.pvc.val(this.model.get("primaryCarePer"));
        this.$selects.pvn.val(this.model.get("primaryCareNum"));
        this.$selects.severity.val(this.model.get("severity"));
        this._updateSeverity();
        this.$selects.svc.val(this.model.get("specialistPer"));
        this.$selects.svn.val(this.model.get("specialistNum"));
        this.$selects.sdc.val(this.model.get("specialtyDrugPer"));
        this.$selects.sdn.val(this.model.get("specialtyDrugNum"));
        this.$selects.ucc.val(this.model.get("urgentPer"));
        this.$selects.ucn.val(this.model.get("urgentNum"));
        this.$selects.ud.val(this.model.get("usedDeductible"));
        this._updateHospitalOption();
        this._setDiseaseMedicalTexts();
        if (family = this.model.get("family")) {
          this.familySelectView.setValue(family.get("id"));
        }
        if (income = this.model.get("income")) {
          this.$selects.income.val(income.get("id"));
        }
        if (rent = this.model.get("rent")) {
          return this.$selects.rent.val(rent.get("id"));
        }
      },
      close: function() {
        return rcc.vent.trigger("goto", "customize");
      },
	  hide: function() {
        if (window.utag) {  
            utag.link({_ga_category: 'real cost calculator',_ga_action: 'advanced options interactions',_ga_label: 'close'});
        }
        return rcc.vent.trigger("goto", "customize");
      },
      promptCancel: function() {
        this.listenToOnce(this.exitPrompt, "confirm", this.hide);
        return this.exitPrompt.prompt();
      },
      save: function() {
        var formData;
        formData = this._evaluateForm();
        if (window.utag) {
            utag.link({_ga_category: 'real cost calculator',_ga_action: 'advanced options interactions',_ga_label: 'save'});
        }
        if (_.isEmpty(formData)) {
          return false;
        } else {
          _.extend(formData, {
            insurance: "advanced"
          });
          return this.model.set(formData, {
            validate: true
          });
        }
      },
      _initTooltips: function() {
        var $body;
        $body = $("body");
        return this.$(".rcc-button--tooltip").each((function(_this) {
          return function(i, btn) {
            var $btn, $tooltip;
            $btn = $(btn);
            $tooltip = $btn.data("tooltip");
            if (!$tooltip) {
              $tooltip = $("#" + $btn.data("tooltipId"));
              $tooltip.hide();
              $btn.data("tooltip", $tooltip);
            }
            if (!$tooltip.length) {
              return;
            }
            if (rcc.getsDesktop()) {
              return $tooltip.appendTo($body);
            } else {
              return $tooltip.appendTo($btn.closest(".fieldset"));
            }
          };
        })(this));
      },
	  _onInitiate: function (){  
		 if (this.model.attributes.advancedOptionsInitiated !== true){
             if (window.utag) {
                utag.link({_ga_category: 'real cost calculator',_ga_action: 'advanced options interactions',_ga_label: 'initiation'});
             }   
		  }
		  this.model.set({
			   advancedOptionsInitiated: true
		  });
		  return;
	  },
      _storeDOMNodes: function() {
        this.$selects = {
          ad: this.$("[name=rcc-ad]"),
          bdc: this.$("[name=rcc-bdc]"),
          bdn: this.$("[name=rcc-bdn]"),
          dgc: this.$("[name=rcc-dgc]"),
          dgn: this.$("[name=rcc-dgn]"),
          erc: this.$("[name=rcc-erc]"),
          ern: this.$("[name=rcc-ern]"),
          gdc: this.$("[name=rcc-gdc]"),
          gdn: this.$("[name=rcc-gdn]"),
          imc: this.$("[name=rcc-imc]"),
          imn: this.$("[name=rcc-imn]"),
          iad: this.$("[name=rcc-iad]"),
          pvc: this.$("[name=rcc-pvc]"),
          pvn: this.$("[name=rcc-pvn]"),
          svc: this.$("[name=rcc-svc]"),
          svn: this.$("[name=rcc-svn]"),
          sdc: this.$("[name=rcc-sdc]"),
          sdn: this.$("[name=rcc-sdn]"),
          ucc: this.$("[name=rcc-ucc]"),
          ucn: this.$("[name=rcc-ucn]"),
          ud: this.$("[name=rcc-ud]"),
          severity: this.$("[name=rcc-severity]"),
          income: this.$("[name=rcc-income]"),
          rent: this.$("[name=rcc-rent]")
        };
        this.$severities = this.$(".rcc-severity");
        return this.$hospitalOptions = this.$(".rcc-hospital");
      },
      _evaluateForm: function() {
        var formData;
        formData = {};
        formData.availableDeductible = this.$selects.ad.val();
        formData.brandDrugPer = this.$selects.bdc.val();
        formData.brandDrugNum = this.$selects.bdn.val();
        formData.diagnosticsPer = this.$selects.dgc.val();
        formData.diagnosticsNum = this.$selects.dgn.val();
        formData.erPer = this.$selects.erc.val();
        formData.erNum = this.$selects.ern.val();
        formData.genericDrugPer = this.$selects.gdc.val();
        formData.genericDrugNum = this.$selects.gdn.val();
        formData.imagingPer = this.$selects.imc.val();
        formData.imagingNum = this.$selects.imn.val();
        formData.income = this.$selects.income.val();
        formData.insuranceAfterDeductible = this.$selects.iad.val();
        formData.primaryCarePer = this.$selects.pvc.val();
        formData.primaryCareNum = this.$selects.pvn.val();
        formData.rent = this.$selects.rent.val();
        formData.severity = this.$selects.severity.val();
        formData.specialistNum = this.$selects.svn.val();
        formData.specialistPer = this.$selects.svc.val();
        formData.specialtyDrugNum = this.$selects.sdn.val();
        formData.specialtyDrugPer = this.$selects.sdc.val();
        formData.urgentNum = this.$selects.ucn.val();
        formData.urgentPer = this.$selects.ucc.val();
        formData.usedDeductible = this.$selects.ud.val();
        formData.family = this.familySelectView.getValue();
        formData.hospital = this._getCurrentHospitalValue();
        formData.hospitalOpt = this._curHospitalOption;
        return formData;
      },
      _setDiseaseMedicalTexts: function() {
        var severity, texts, _i, _len, _ref, _results;
        if (!(texts = this.model.get("diseaseTexts"))) {
          return;
        }
        _ref = this.model.get("severities");
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          severity = _ref[_i];
          _results.push(this.$(".rcc-adv-severity .infotext__item--" + severity + " .infotext__text").text(texts[severity]));
        }
        return _results;
      },
      _updateSeverity: function() {
        var select, severity;
        select = this.$selects.severity[0];
        if (select.selectInstance) {
          select.selectInstance.update();
        }
        severity = _.filter(this.$severities, function(severity) {
          return $(severity).data("value") === select.value;
        });
        this._selectSeverityCheckable($(severity));
        return this._updateSeverityText();
      },
      _selectSeverityCheckable: function($severity) {
        this.$severities.not($severity).removeClass("checked");
        return $severity.addClass("checked");
      },
      _updateSeverityText: function() {
        var $selectedSeverityText, $severityTexts, selectedSeverity, tl;
        selectedSeverity = this.$selects.severity.val();
        $severityTexts = this.$(".infotext__item");
        $selectedSeverityText = $severityTexts.filter(".infotext__item--" + selectedSeverity);
        tl = new TimelineLite();
        tl.add(TweenMax.to($severityTexts.not($selectedSeverityText), 0.4, {
          opacity: 0,
          ease: Power2.easeOut
        }));
        tl.add(TweenMax.to($severityTexts.not($selectedSeverityText), 0, {
          display: "none"
        }));
        tl.add(TweenMax.to($selectedSeverityText, 0, {
          display: "block"
        }));
        return tl.add(TweenMax.to($selectedSeverityText, 0.4, {
          opacity: 1,
          ease: Power2.easeOut
        }, "-=0.2"));
      },
      _selectHospitalOption: function($option) {
        var $optionFields, $otherOptionFields, $otherOptions, tl;
        if ($option == null) {
          $option = this._getCurrentHospitalOptionEl();
        }
        $otherOptions = this.$hospitalOptions.not($option);
        $optionFields = $option.find(".fieldset");
        $otherOptionFields = $otherOptions.find(".fieldset");
        $otherOptions.removeClass("checked");
        $option.addClass("checked");
        tl = new TimelineLite();
        if (this._curHospitalOption !== "none") {
          tl.add(TweenMax.to($otherOptionFields, 0.3, {
            height: 0,
            ease: Power2.easeOut
          }));
        }
        if (this._curHospitalOption !== $option.data("hospital")) {
          this._curHospitalOption = $option.data("hospital");
          tl.add(TweenMax.set($optionFields, {
            height: "auto"
          }));
          return tl.add(TweenMax.from($optionFields, 0.3, {
            height: 0,
            padding: 0,
            ease: Power2.easeOut
          }));
        }
      },
      _updateHospitalOption: function() {
        var $el, $select;
        this._curHospitalOption = this.model.get("hospitalOpt");
        $el = this._getCurrentHospitalOptionEl();
        this._selectHospitalOption($el);
        $select = $el.find("select");
        if ($select.length) {
          return $select.val(this.model.get("hospital").toString());
        }
      },
      _getCurrentHospitalOptionEl: function() {
        return this.$("[data-hospital=" + this._curHospitalOption + "]");
      },
      _getCurrentHospitalValue: function() {
        var $select;
        $select = this._getCurrentHospitalOptionEl().find("select");
        if ($select.length) {
          return $select.val();
        } else {
          return 0;
        }
      },
      _showTooltip: function($btn, $tooltip) {
        var offset;
        offset = $btn.offset();
        $tooltip.css({
          left: rcc.getsDesktop() ? offset.left - $tooltip.outerWidth() : 0,
          top: rcc.getsDesktop() ? offset.top + $btn.outerHeight() / 2 : 0
        });
        return BaseView.prototype._showTooltip.apply(this, [$tooltip]);
      },
      _onCancelButtonClick: function() {
        return this.promptCancel();
      },
      _onSaveButtonClick: function() {
        if (this.save()) {
          return this.close();
        }
      },
      _onOuterElementClick: function(e) {
        return this.promptCancel();
      },
      _onClickSeverityItem: function(e) {
        var $severity;
        $severity = $(e.currentTarget);
        this._selectSeverityCheckable($severity);
        return this.$selects.severity.val($severity.data("value"));
      },
      _onClickHospitalOption: function(e) {
        return this._selectHospitalOption($(e.currentTarget));
      },
      _onTooltipShow: function(e) {
        var $btn, $tooltip;
        $btn = $(e.currentTarget);
        $tooltip = $btn.data("tooltip");
        if ($tooltip.is(":visible")) {
          return;
        }
        this._showTooltip($btn, $tooltip);
        return this.$el.add(this.$(".inner")).one("click", (function(_this) {
          return function() {
            return _this._hideTooltip($tooltip);
          };
        })(this));
      },
      _onLeaveTooltipShow: function(e) {
        var $tooltip;
        $tooltip = $(e.currentTarget).data("tooltip");
        return this._hideTooltip($tooltip);
      },
      _onWindowResize: function() {
        return this._initTooltips();
      }
    });
  });

}).call(this);
