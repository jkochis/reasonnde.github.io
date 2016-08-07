/*
  Class: CustomizeView
  Extends: BaseView
  Main view for second step.
  Subviews: A DiseaseCollectionView, total costs, how aflac helps, the ExpensesTabView, the InsuranceTabView
  and, indirectly through the InsuranceTabView, the AdvancedDataView.
 */
(function() {
  define(["Select", "TweenMax", "rcc/rcc", "rcc/views/BaseView", "rcc/views/DiseaseSelectView", "rcc/views/ExpensesTabView", "rcc/views/InsuranceTabView", "rcc/views/SplitFlapView"], function(Select, TweenMax, rcc, BaseView, DiseaseSelectView, ExpensesTabView, InsuranceTabView, SplitFlapView) {
    var CustomizeView;
    return CustomizeView = BaseView.extend({
      initialize: function() {
        this.vent = rcc.vent;
        this.$el.hide();
        this.listenTo(this.model, "change", this._renderTotalCosts);
        this.listenTo(this.model, "change", this._renderHowAflacHelps);
        this.listenTo(this.model, "change:disease", this._slideInDisease);
        this.$rccPolicySelect = this.$(".rcc-customize-policy-type");
        this.$icon = this.$(".rcc-dis-icon");
        this.totalSplitDisplay = new SplitFlapView({
          el: this.$(".total-costs.price")[0]
        });
        this.helpSplitDisplay = new SplitFlapView({
          el: this.$(".how-aflac-helps.price")[0]
        });
        this.policyTypeSelect = new Select({
          el: this.$rccPolicySelect[0],
          className: "select-theme-green"
        });
        return this.subviews = [
          new DiseaseSelectView({
            collection: this.model.diseasesForGender(),
            model: this.model,
            el: this.$(".rcc-diseases")[0]
          }), new ExpensesTabView({
            model: this.model,
            el: this.$(".rcc-expenses")[0]
          }), new InsuranceTabView({
            model: this.model,
            el: this.$(".rcc-insurances-tab")[0]
          })
        ];
      },
      events: {
        "click .goto-step-1": "_onStep1",
        "click .goto-step-3": "_onStep3",
        "change .rcc-customize-policy-type": "_onPolicyTypeChange"
      },
      el: $('.step--customize'),
      step: 2,
      url: "customize",
      render: function() {
        var subview, _i, _len, _ref;
        this._renderTotalCosts();
        this._renderHowAflacHelps();
        this._updateDisclaimer({
          mode: "extended"
        });
        _ref = this.subviews;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          subview = _ref[_i];
          subview.render();
        }
        this.$(".tooltip--error").hide();
        if (!this._rendered) {
          this._slideInDisease();
        }
        return this._rendered = true;
      },
      _isCurrentStep: function() {
        return this.step === this.model.get("step");
      },
      _renderTotalCosts: function() {
        if (!this._isCurrentStep()) {
          return;
        }
        return this.totalSplitDisplay.change(this.model.get("total"));
      },
      _renderHowAflacHelps: function() {
        if (!this._isCurrentStep()) {
          return;
        }
        this.helpSplitDisplay.change(this.model.get("howAflacHelps"));
        this.$rccPolicySelect.val(this.model.get("policyType"));
        return this.policyTypeSelect.update();
      },
      _onStep1: function() {
        return rcc.vent.trigger("goto", "start");
      },
      _onStep3: function() {
	  	var tm = this.model;	
		var selectedInsuranceType = '';
		var selectedInsurance = ''
		
		if(tm.attributes.insurance == undefined){
			$('.tooltip--prompt').show();
		}else{
			selectedInsurance = tm.attributes.insurance.attributes.id.split('-');
            if (window.utag) {
                utag.link({_ga_category: 'real cost calculator',_ga_action: 'step completion',_ga_label: 'step 2'+':'+'refine your results'});
            }
			if(selectedInsurance[0] === 'major'){
				 selectedInsuranceType = 'major medical';
			}
			else{
				 selectedInsuranceType = 'marketplace level';
			}
			//console.log( selectedInsuranceType +'  /  '+ selectedInsurance[1] +'  /  '+ selectedInsurance[0]);
            if (window.utag) {
                utag.link({_ga_category: 'real cost calculator',_ga_action: 'form detail: '+selectedInsuranceType+'',_ga_label: ''+selectedInsurance[1]+''});
            }    
					
	        return rcc.vent.trigger("goto", "help");
		}
      },
      _onPolicyTypeChange: function() {	
		// console.dir(this.model);
		//console.dir(this.$rccPolicySelect.val());
        if (window.utag) {
            utag.link({_ga_category: 'real cost calculator',_ga_action: 'form detail: how aflac helps dropdown',_ga_label: ''+this.$rccPolicySelect.val()+''});
        }
        return this.model.set({
          policyType: this.$rccPolicySelect.val()
        });
	
      },
      _slideInDisease: function() {
        var $icon, disease, diseaseClass, fade, oldDiseaseClass;
        if (!(disease = this.model.get("disease"))) {
          return;
        }
        $icon = this.$icon;
        oldDiseaseClass = this.diseaseClass;
        diseaseClass = this.diseaseClass = "rcc-dis-icon--" + disease.get("id");
        fade = new TimelineLite();
        if ($icon.is(":visible")) {
          fade.add(TweenMax.fromTo($icon[0], 0.5, {
            left: "0"
          }, {
            left: "-100%",
            ease: Power2.easeOut
          }));
        }
        fade.add(function() {
          if (oldDiseaseClass) {
            $icon.removeClass(oldDiseaseClass);
          }
          return $icon.addClass(diseaseClass);
        });
        return fade.add(TweenMax.fromTo($icon[0], 0.5, {
          left: "-100%"
        }, {
          left: 0,
          ease: Power2.easeOut
        }));
      }
    });
  });
}).call(this);