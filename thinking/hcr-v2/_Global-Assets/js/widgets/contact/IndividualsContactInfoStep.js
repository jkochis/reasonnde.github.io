/**
 * Created by roel.kok on 6/26/14.
 */
define([
	"underscore",
	"vendor/jquery.maskedinput.min",
	"lib/Env",
	"lib/Util",
	"lib/MediaQueries",
	"lib/common_components/FormInputText",
	"lib/common_components/InfoboxPopup",
	"widgets/ErrorLightbox",
	"./StepView"
],
function(
	_,
	maskedinput,
	Env,
	Util,
	MediaQueries,
	FormInputText,
	InfoboxPopup,
	ErrorLightbox,
	StepView
) {
	var ContactInfoStepView = StepView.extend({
		initialize: function(options) {
			_.bindAll(this,
				"onChangeInput"
			);
			this.model = new Backbone.Model({
				firstname: "",
				lastname: "",
				phone: "",
				zipcode: "",
				email: ""
			});
			this.model.validate = function(attr, options) {
				var invalidFields = [];
				// Validate first and last name
				_.each(["firstname", "lastname"], function(fieldName, index, list) {
					if(!attr[fieldName].match(/[a-zA-Z]+/)) {
						invalidFields.push(fieldName);
					}
				});
				// Validate phone number
				if(!Util.validatePhone(attr["phone"])) {
					invalidFields.push("phone");
				}
				// Validate zip code
				if(!Util.validateZipCode(attr["zipcode"])) {
					invalidFields.push("zipcode");
				}
				// Validate email
				if(!Util.validateEmail(attr["email"])) {
					invalidFields.push("email");
				}
			if (!Util.isSpanish()) {
				if(invalidFields.length > 0) {
					return {
						message: "Please complete all required fields to continue.",
						fields: invalidFields
					};
				}
			} else {
				if(invalidFields.length > 0) {
					return {
						message: "Por favor, complete todos los campos necesarios para continuar.",
						fields: invalidFields
					};
				}
			}
			};
			this.$formFields = this.$(".form-fields");
			this.$("input[name=phone]").mask("999-999-9999", {placeholder: " "});
			this.$("input[name=zipcode]").mask("99999", {placeholder: ""});
			this.textInputs = [];
			var $inputText = this.$(".input-text");
			$inputText.each(_.bind(function(i, el) {
				var formInputText = new FormInputText({
					el: el
				});
				formInputText.on("change", this.onChangeInput, this);
				this.textInputs.push(formInputText);
			}, this));
			this.model.on("invalid", this.onInvalidModel, this);
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
		reset: function() {
			for(var i = 0; i < this.textInputs.length; i++) {
				this.textInputs[i].clear();
			}
		},
		onInvalidModel: function(model, error, options) {
			for(var i = 0; i < this.textInputs.length; i++) {
				var input = this.textInputs[i];
				if(_.indexOf(error.fields, input.name) > -1) {
					input.setError(true);
				}
				else {
					input.setError(false);
				}
			}
			if(!Env.IE8 && matchMedia(MediaQueries.HEADER_HAMBURGER).matches) {
				var lightbox = new ErrorLightbox({
					data: {
						title: "Error",
						message: error.message
					}
				});
				if (window.utag) {
					utag.link({_ga_category: 'lead form',_ga_action: 'error',_ga_label: 'form validation step 2'});
				}
				lightbox.show();
			}
			else {
				var isFixed = Util.isPositionFixed(this.$formFields[0]);
				var formFieldsBoundingRect = this.$formFields[0].getBoundingClientRect();
				var infoboxPopup = new InfoboxPopup({
					title: "Error",
					message: error.message,
					origin: {
						position: isFixed ? "fixed" : "absolute",
						top: (formFieldsBoundingRect.top + formFieldsBoundingRect.bottom) / 2 + (isFixed ? 0 : $(window).scrollTop()),
						left: formFieldsBoundingRect.left + (isFixed ? 0 : $(window).scrollLeft())
					},
					error: true
				});
				if (window.utag) {
					utag.link({_ga_category: 'lead form',_ga_action: 'error',_ga_label: 'form validation step 2'});
				}
				infoboxPopup.show();
			}
		},
		onChangeInput: function(inputView) {
			var name = inputView.name;
			if(this.model.has(name)) {
				this.model.set(name, inputView.getValue());
			}
		}
	});
	return ContactInfoStepView;
});