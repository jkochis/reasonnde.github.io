/**
 * Created by roel.kok on 6/16/14.
 */

define([
	"underscore",
	"backbone",
	"lib/Env",
	"lib/Util",
	"lib/BaseView",
	"lib/LightboxHelper",
	"./IndividualsForm",
	"./ProgressIndicator"
],
function(
	_,
	Backbone,
	Env,
	Util,
	BaseView,
	LightboxHelper,
	Form,
	ProgressIndicator
) {

	var IndividualsLightbox = BaseView.extend({

		isVisible: false,

		initialize: function(options) {
			_.bindAll(this,
				"onClickClose"
			);

			options = _.extend({}, options);

			this.setElement(Util.loadTemplate("contact-lightbox-individuals-tpl"));

			this.lightboxHelper = new LightboxHelper({
				el: this.el
			});

			this.form = new Form({
				el: this.el,
				interestsData: options.interestsData
			});

			this.$close = this.$(".close");

			this.progressIndicator = new ProgressIndicator({
				el: this.$(".progress-indicator")[0],
				model: this.form.stepNavModel
			});

			this.$close.on("click", this.onClickClose);
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
		}

	});

	return IndividualsLightbox;

});