
/*
  Class: StartView
  Extends: BaseView
  Main view for first step.
  Components: A DiseaseCollectionView, age and gender selection
 */

(function() {
  define(["vendor/jquery.placeholder", "rcc/rcc", "rcc/views/BaseView", "rcc/views/DiseaseCollectionView", "rcc/views/HintSliderView"], function(jqueryPlaceholder, rcc, BaseView, DiseaseCollectionView, HintSliderView) {
    var StartView;
    return StartView = BaseView.extend({
      initialize: function() {
        this.vent = rcc.vent;
        this.$el.hide();
        _.bindAll(this, "_onWindowResize");
        this.$(".rcc-age").placeholder();
        this.$(".input--radio").prepend("<span class='input__indicator'></span>");
        $(window).on("resize", this._onWindowResize);
        this._onFirstRun();
        this.listenTo(this.model, "invalid", this._handleErrors);
		
        return this.subviews = {
          hints: new HintSliderView({
            el: this.$(".rcc-hints")[0]
          })
        };
      },
      el: $('.step--start'),
      step: 1,
      events: {
        "click      .rcc-gender--female": "_onGenderChangeF",
        "click      .rcc-gender--male": "_onGenderChangeM",
        "input      .rcc-age": "_onAgeChange",
        "change     .rcc-age": "_onAgeChange",
		"click     .rcc-age": "_onAgeInitiate",
        "click      .tooltip .rcc-button--close": "_onClickTooltipClose",
        "click      .tooltip": "_onClickTooltip",
        "click      .goto-step-2": "_onNextStep"
      },
      allowWithInvalidState: true,
      url: "start",
      render: function() {
        this.rendered = true;
        this.subviews.hints.render();
        this._renderGender();
        this._renderAge();
        this._renderDiseases();
        this._updateDisclaimer({
          mode: "normal"
        });
        this.$(".tooltip--error").hide();
        if (!this.$(".rcc-gender .input__field:checked").length) {
          return this._initPrompt();
        }
      },
      _renderAge: function() {
        var age;
        age = this.model.get("age");
        if (!age) {
          return;
        }
        return $(".rcc-age").val(age);
      },
      _renderGender: function() {
        var $genderFields, $newGenderInput, gender;
        gender = this.model.get("gender");
        if (gender !== "female" && gender !== "male") {
          return;
        }
        $newGenderInput = this.$(".rcc-gender--" + gender).addClass("checked");
        $newGenderInput.find(".input__field").prop("checked", true);
        $genderFields = this.$(".rcc-gender").not($newGenderInput).removeClass("checked");
        return $genderFields.find(".input__field").prop("checked", false);
      },
      _renderDiseases: function() {
        this.dcv = new DiseaseCollectionView({
          collection: this.model.diseasesForGender(),
          model: this.model,
          el: this.$(".rcc-collection--disease")[0],
          attributes: {
            "data-item-name": "rcc-dis",
            "data-item-idprefix": "rcc-dis--",
            "smallnumdiseases": 2,
            "mediumnumdiseases": 4,
            "largenumdiseases": 2,
            "tooltip": true
          }
        });
        return this.dcv.render();
      },
      _handleErrors: function(o, errors) {
        var $ageErrorTooltip, $diseaseErrorTooltip, $genderErrorTooltip;
        if (!this.rendered) {
          return;
        }
        this._clearPrompt();
        this._hideAgeLimitations();
        $genderErrorTooltip = this.$(".tooltip--error.tooltip--gender");
        if (errors.hasOwnProperty("gender")) {
          this._showTooltip($genderErrorTooltip);
          if (window.utag) {
            utag.link({_ga_category: 'real cost calculator',_ga_action: 'form error',_ga_label: 'error'+':'+'gender selection'});
          }
        } else {
          this._hideTooltip($genderErrorTooltip);
        }
        $ageErrorTooltip = this.$(".tooltip--error.tooltip--age");
        if (errors.hasOwnProperty("age")) {
          this._showTooltip($ageErrorTooltip);
		  if (window.utag) {
              utag.link({_ga_category: 'real cost calculator',_ga_action: 'form error',_ga_label: 'error'+':'+'age entry'});
          }    
        } else {
          this._hideTooltip($ageErrorTooltip);
        }
        $diseaseErrorTooltip = this.$(".tooltip--error.tooltip--disease");
        if (errors.hasOwnProperty("disease") && !this.dcv.getValue()) {
          this._showTooltip($diseaseErrorTooltip);
		  if (window.utag) {
              utag.link({_ga_category: 'real cost calculator',_ga_action: 'form error',_ga_label: 'error'+':'+'illness selection'});
          }   
        } else {
          this._hideTooltip($diseaseErrorTooltip);
        }
        return this._scrollToFirstError();
      },
      _onNextStep: function() {
		//console.dir(this.model);
			var tm = this.model;	
			var diseaseSelected = ''
				//console.dir(tm);	
			if(tm.attributes.disease && tm.attributes.age && tm.attributes.gender){		
					diseaseSelected = tm.attributes.disease.id;
					diseaseSelected = diseaseSelected.replace('-',' ');

					//console.log(tm.attributes);
					//console.log(tm.attributes.age);
					//console.log(tm.attributes.gender);
                    if (window.utag) {
                        utag.link({_ga_category: 'real cost calculator',_ga_action: 'step completion',_ga_label: 'step 1'+':'+'get the real cost'});	
                        utag.link({_ga_category: 'real cost calculator',_ga_action: 'form detail: gender',_ga_label: ''+ tm.attributes.gender +''});
                        utag.link({_ga_category: 'real cost calculator',_ga_action: 'form detail: age',_ga_label: ''+ tm.attributes.age +''});
                        utag.link({_ga_category: 'real cost calculator',_ga_action: 'form detail: illness or injury',_ga_label: ''+diseaseSelected+''});
                    }
			}	
        return rcc.vent.trigger("goto", "customize");
      },
      _onFirstRun: function() {
        this._onAgeChange();
        return this._onWindowResize();
      },
      _onWindowResize: function() {
        var $hints;
        $hints = $(".rcc-hints");
        if (rcc.getsDesktop()) {
          return $hints.appendTo($(".intro"));
        } else {
          return $hints.appendTo(this.$el);
        }
      },
      _onGenderChangeM: function() {
        this._clearPrompt();
        $(".rcc-gender--male").addClass("checked");
        $(".rcc-gender--female").removeClass("checked");
		this._onModelChange();
        return this.model.set("gender", "male");
      },
      _onGenderChangeF: function() {
        this._clearPrompt();
		this._onModelChange();
        $(".rcc-gender--female").addClass("checked");
        $(".rcc-gender--male").removeClass("checked");
        return this.model.set("gender", "female");
      },
      _onAgeChange: function() {
		var ageValue;
		
        ageValue = parseInt(this.$("[name=rcc-age]").val(), 10);
        if (this.model.get("age") !== ageValue) {
          this.model.set("age", ageValue);
        }
        if (ageValue > 70) {
            if (window.utag) {
                utag.link({_ga_category: 'real cost calculator',_ga_action: 'form error',_ga_label: 'error'+':'+'age entry'});
            }    
          return this._showAgeLimitations();
        } else {		  
          return this._hideAgeLimitations();
        }
      },
	  _onAgeInitiate: function(){
		this._onModelChange();
	  },

	  _onModelChange: function() {
			if(!this.model.get('initiated')){
				this.model.set('initiated', true);
                if (window.utag) {
                    utag.link({_ga_category: 'real cost calculator',_ga_action: 'initiate',_ga_label: utag.data.form_type});
                }    
			}
	  },
      _initPrompt: function() {
        var $promptTooltip;
        $promptTooltip = this.$(".tooltip--prompt");
        return this._promptTimeout = setTimeout((function(_this) {
          return function() {
            return _this._showTooltip($promptTooltip);
          };
        })(this), 7500);
      },
      _showAgeLimitations: function() {
        this._hideTooltip(this.$(".tooltip--age"));
        return this._showTooltip(this.$(".tooltip--age-limitations"));
      },
      _hideAgeLimitations: function() {
        return this._hideTooltip(this.$(".tooltip--age-limitations"));
      }
    });
  });

}).call(this);
