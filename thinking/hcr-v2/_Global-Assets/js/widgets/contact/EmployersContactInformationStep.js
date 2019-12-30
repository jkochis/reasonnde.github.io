define([
	"lib/Env",
	"lib/Util",
	"lib/MediaQueries",
	"lib/common_components/InfoboxPopup",
	"lib/common_components/FormInputText",
	"lib/common_components/FormTextArea",
	"widgets/ErrorLightbox",
	"./FormHelper",
	"./StepView",
	"./EmployersFormContactInformationModel"
],
function(
	Env,
	Util,
	MediaQueries,
	InfoboxPopup,
	FormInputText,
	FormTextArea,
	ErrorLightbox,
	FormHelper,
	StepView,
	FormModel
) {
	var EmployersContactInformationStep = StepView.extend({
		initialize: function(options) {
			this.model = new FormModel();
			this.formHelper = new FormHelper({
				el: this.el,
				model: this.model
			});
			this.textInputs = [];
			_.each(this.formHelper.inputs, _.bind(function(input, index, list) {
				if(input instanceof FormInputText || input instanceof FormTextArea) {
					this.textInputs.push(input);
				}
			}, this));
			this.$formFields = this.$(".form-fields");
			this.$("input[name=phone]").mask("999-999-9999", {placeholder: " "});
			this.$("input[name=zipcode]").mask("99999", {placeholder: " "});
			this.$("input[name=ext]").mask("9?999999999",{placeholder: " "});
			
			this.model.on("invalid", this.onInvalidModel, this);
		},
		reset: function() {
			this.formHelper.reset();
		},
		show: function() {
			StepView.prototype.show.apply(this, arguments);
			// Trick to get the placeholder in IE9 to behave
			for(var i = 0; i < this.textInputs.length; i++) {
				if(this.textInputs[i].placeholder) {
					this.textInputs[i].placeholder.updateStyles();
				}
			}
		},
		onInvalidModel: function(model, error, options) {
			this.formHelper.setError(error.fields);
			if (window.utag) {
				utag.link({_ga_category: 'lead form',_ga_action: 'error',_ga_label: 'form validation error step 2'});
			}
			if(!Env.IE8 && matchMedia(MediaQueries.HEADER_HAMBURGER).matches) {
				var lightbox = new ErrorLightbox({
					data: {
						title: "Error",
						message: error.message
					}
				});
				lightbox.show();
			}
			else {
				var isFixed = Util.isPositionFixed(this.$formFields[0]);
				var listBoundingRect = this.$formFields[0].getBoundingClientRect();
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
				infoboxPopup.show();
			}
		}
	});
	return EmployersContactInformationStep;
});