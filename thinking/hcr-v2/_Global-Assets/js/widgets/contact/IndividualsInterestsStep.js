/**
 * Created by roel.kok on 6/26/14.
 */
define([
	"underscore",
	"lib/Env",
	"lib/Util",
	"lib/MediaQueries",
	"lib/common_components/InfoboxPopup",
	"widgets/ErrorLightbox",
	"./FormHelper",
	"./IndividualsInterestsModel",
	"./StepView"
],
function(
	_,
	Env,
	Util,
	MediaQueries,
	InfoboxPopup,
	ErrorLightbox,
	FormHelper,
	FormModel,
	StepView
) {
	var InterestsStepView = StepView.extend({
		errorFeedback: false,
		initialize: function(options) {
			this.model = new FormModel(options.data);
			this.formHelper = new FormHelper({
				el: this.el,
				model: this.model
			});
			this.checkboxes = [];
			var checkboxNames = ["offering_1", "offering_2", "offering_3", "offering_4", "offering_5"]; // This is basically all the inputs
			_.each(this.formHelper.inputs, _.bind(function(input, index, list) {
				if(_.contains(checkboxNames, input.name)) {
					this.checkboxes.push(input);
					if(this.model.has(input.name)) {
						input.setValue(this.model.get(input.name));
					}
					input.on("change", this.onChangeCheckbox, this);
				}
			}, this));
			this.$interestList = this.$(".interest-list");
			this.setErrorFeedback(true);
			this.model.on("change", this.onModelChange, this);
		},
		reset: function() {
			this.formHelper.reset();
		},
		removeErrors: function() {
			this.formHelper.removeErrors();
		},
		setErrorFeedback: function(enable) {
			if(this.errorFeedback != enable) {
				this.errorFeedback = enable;
				if(enable) {
					this.model.on("invalid", this.onInvalidModel, this);
				}
				else {
					this.model.off("invalid", this.onInvalidModel, this);
				}
			}
		},
		onInvalidModel: function(model, error, options) {
//			console.log(error);
			this.formHelper.setError(error.fields);
			if(!Env.IE8 && matchMedia(MediaQueries.HEADER_HAMBURGER).matches) {
				var lightbox = new ErrorLightbox({
					data: {
						title: "Error",
						message: error.message
					}
				});
				if (window.utag) {
					utag.link({_ga_category: 'lead form',_ga_action: 'error',_ga_label: 'form validation step 1'});
				}
				lightbox.show();
			}
			else {
				var isFixed = Util.isPositionFixed(this.$interestList[0]);
				var listBoundingRect = this.$interestList[0].getBoundingClientRect();
				var infoboxPopup = new InfoboxPopup({
					title: "Error",
					message: error.message,
					origin: {
						position: isFixed ? "fixed" : "absolute",
						top: (listBoundingRect.top + listBoundingRect.bottom) / 2 + (isFixed ? 0 : $(window).scrollTop()),
						left: listBoundingRect.left + (isFixed ? 0 : $(window).scrollLeft())
					},
					error: true
				});
				if (window.utag) {
					utag.link({_ga_category: 'lead form',_ga_action: 'error',_ga_label: 'form validation step 1'});
				}
				infoboxPopup.show();
			}
		},
		onChangeCheckbox: function(checkboxView) {
			// Clear all error states
			
			//if(!this.model.get('initiated')){
			//	this.model.set('initiated', true);
			//	if (window.utag) {
			//		utag.link({_ga_category: 'lead form',_ga_action: 'initiate',_ga_label: utag.data.form_type});
			//	}
			//}
			for(var i = 0; i < this.checkboxes.length; i++) {
				var checkbox = this.checkboxes[i];
				checkbox.setError(false);
			}
		},
		onModelChange: function() {
			if(!this.model.get('initiated')){
				this.model.set('initiated', true);
				if (window.utag) {
					utag.link({_ga_category: 'lead form',_ga_action: 'initiate',_ga_label: utag.data.form_type});
				}
			}
		}
	});
	return InterestsStepView;
});