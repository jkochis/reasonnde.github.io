/**
 * Created by roel.kok on 7/17/14.
 */
define([
	"underscore",
	"vendor/jquery.maskedinput.min",
	"lib/Env",
	"lib/Util",
	"lib/MediaQueries",
	"lib/BaseView",
	"lib/LightboxHelper",
	"lib/common_components/InfoboxPopup",
	"lib/common_components/FormInputText",
	"lib/common_components/FormTextArea",
	"widgets/ErrorLightbox",
	"./FormHelper",
	"./CustomerSupportModel"
],
function(
	_,
	maskedinput,
	Env,
	Util,
	MediaQueries,
	BaseView,
	LightboxHelper,
	InfoboxPopup,
	FormInputText,
	FormTextArea,
	ErrorLightbox,
	FormHelper,
	FormModel
) {
	var CustomerSupportLightbox = BaseView.extend({
		initialize: function(options) {
			_.bindAll(this,
				"onClickClose",
				"onClickBack",
				"onClickSubmit"
			);
			this.model = new FormModel();
			this.parent = options.parent;
			this.setElement(Util.loadTemplate("customer-support-lightbox-tpl"));
			this.lightboxHelper = new LightboxHelper({
				el: this.el
			});
			this.formHelper = new FormHelper({
				el: this.$(".form-section"),
				model: this.model
			});
			this.textInputs = [];
			_.each(this.formHelper.inputs, _.bind(function(input, index, list) {
				if(input instanceof FormInputText || input instanceof FormTextArea) {
					this.textInputs.push(input);
				}
			}, this));
			this.$("input[name=phone_number]").mask("999-999-9999", {placeholder: " "});
			this.$("input[name=zipcode]").mask("99999", {placeholder: ""});
			this.$("input[name=account_number]").mask("****?******", {placeholder: ""});
			this.$close = this.$(".close");
			this.$formPanel = this.$(".form-panel");
			this.$completePanel = this.$(".complete-panel");
			this.$form = this.$("form");
			this.$formFields = this.$(".form-fields");
			this.$back = this.$(".back");
			this.$submit = this.$(".submit");
			this.model.on("invalid", this.onInvalidModel, this);
			this.$close.on("click", this.onClickClose);
			this.$back.on("click", this.onClickBack);
			this.$submit.on("click", this.onClickSubmit);
		},
		show: function() {
			this.lightboxHelper.show();
			// Trick to get the placeholder in IE9 to behave
			var fn = _.bind(function() {
				for(var i = 0; i < this.textInputs.length; i++) {
					if(this.textInputs[i].placeholder) {
						this.textInputs[i].placeholder.updateStyles();
					}
				}
			}, this);
			fn();
			setTimeout(fn, 100);
		},
		hide: function() {
			this.lightboxHelper.hide();
		},
		onInvalidModel: function(model, error, options) {
			this.formHelper.setError(error.fields);
			if(!Env.IE8 && matchMedia(MediaQueries.HEADER_HAMBURGER).matches) {
				var errorLightbox = new ErrorLightbox({
					data: {
						title: "Error",
						message: error.message
					}
				});
				errorLightbox.show();
			}
			else {
				// TODO Show infobox
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
		},
		onClickClose: function(event) {
			event.preventDefault();
			this.lightboxHelper.hideAll();
		},
		onClickBack: function(event) {
			event.preventDefault();
			this.hide();
			this.parent.show();
		},
		onClickSubmit: function(event) {
			event.preventDefault();
			if(this.model.isValid()) {
				/*var data = this.$form.serialize();*/
				/*$.ajax({
					dataType: 'json',
					contentType: 'application/json; charset=utf-8',
					url: Util.webserviceURL('/api/genericservice/SendEmail'),
					data: JSON.stringify(data),
					type: 'POST',
					error: function (xhr, textStatus, errorThrown){
						if (window.utag) {
							utag.link({_ga_category: 'site diagnostics',_ga_action: 'customer support form submission error: web server',_ga_label: 'status code: ' + xhr.status }); 
						}
					}
				});*/
				this.$formPanel.css("display", "none");
				this.$completePanel.css("display", "block")
			}
		}
	});
	return CustomerSupportLightbox;
});