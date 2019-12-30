define([
	"underscore",
	"lib/Env",
	"lib/Util",
	"lib/BaseView",
	"lib/LightboxHelper",
	"./EmployersForm",
	"./ProgressIndicator",
	"./CustomerSupportLightbox"
],
function(
	_,
	Env,
	Util,
	BaseView,
	LightboxHelper,
	Form,
	ProgressIndicator,
	CustomerSupportLightbox
) {
	var EmployersLightbox = BaseView.extend({
		initialize: function(options) {
			_.bindAll(this,
				"onClickClose",
				"onClickCustomerSupport"
			);
			options = _.extend({}, options);
			this.setElement(Util.loadTemplate("contact-lightbox-employers-tpl"));
			this.lightboxHelper = new LightboxHelper({
				el: this.el
			});
			this.form = new Form({
				el: this.$(".form-section"),
				startStepData: options.startStepData
			});
			this.progressIndicator = new ProgressIndicator({
				el: this.$(".progress-indicator"),
				model: this.form.stepNavModel
			});
			this.$close = this.$(".close");
			this.$customerSupport = this.$(".customer-support");
			this.$close.on("click", this.onClickClose);
			this.$customerSupport.on("click", this.onClickCustomerSupport);
		},
		show: function() {
			this.lightboxHelper.show();
            if(this.progressIndicator.model.get("index") == 0){
				if (window.utag) {	
					utag.link({_ga_category: 'lead form',_ga_action: 'view',_ga_label: utag.data.form_type});
				}
            }
		},
		hide: function() {
			this.lightboxHelper.hide();
			if (window.utag) {
				utag.link({_ga_category: 'lead form',_ga_action: 'hide',_ga_label: utag.data.form_type});
			}
		},
		onClickClose: function(event) {
			event.preventDefault();
			this.hide();
		},
		onClickCustomerSupport: function(event) {
			event.preventDefault();
			var customerSupportLightbox = new CustomerSupportLightbox({
				parent: this
			});
//			this.hide();
			customerSupportLightbox.show();
		}
	});
	return EmployersLightbox;
});