/**
 * Created by roel.kok on 7/9/14.
 */

define([
	"underscore",
	"lib/Env",
	"lib/Util",
	"lib/BaseView",
	"lib/LightboxHelper",
	"./AgentsForm"
],
function(
	_,
	Env,
	Util,
	BaseView,
	LightboxHelper,
	Form
) {

	var AgentsLightbox = BaseView.extend({

		initialize: function(options) {
			_.bindAll(this,
				"onClickClose"
			);

			this.setElement(Util.loadTemplate("contact-lightbox-agents-tpl"));

			this.lightboxHelper = new LightboxHelper({
				el: this.el
			});

			this.form = new Form({
				el: this.$(".form-section")
			});

			this.$close = this.$(".close");

			this.$close.on("click", this.onClickClose);
		},

		show: function() {
			this.lightboxHelper.show();
			if (window.utag) {
				utag.link({_ga_category: 'lead form',_ga_action: 'view',_ga_label: utag.data.form_type});
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

	return AgentsLightbox;

});