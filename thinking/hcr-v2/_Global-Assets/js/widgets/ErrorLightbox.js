/**
 * Created by roel.kok on 7/11/14.
 */

define([
	"underscore",
	"lib/Env",
	"lib/Util",
	"lib/BaseView",
	"lib/LightboxHelper"
],
function(
	_,
	Env,
	Util,
	BaseView,
	LightboxHelper
) {

	var ErrorLightbox = BaseView.extend({

		initialize: function(options) {
			_.bindAll(this,
				"onClickClose",
				"onClickOk"
			);

			this.setElement(Util.loadTemplate("error-lightbox-tpl"));

			this.lightboxHelper = new LightboxHelper({
				el: this.el
			});

			this.$close = this.$(".close");
			this.$ok = this.$(".textbutton");

			this.$("h6").text(options.data.title);
			this.$(".content p").text(options.data.message);

			this.$close.on("click", this.onClickClose);
			this.$ok.on("click", this.onClickOk);
		},

		show: function() {
			this.lightboxHelper.show();
			this.$el.css('margin-top', -this.$el.height() / 2);
		},

		hide: function() {
			this.lightboxHelper.hide();
		},

		onClickClose: function(event) {
			event.preventDefault();

			this.hide();
		},

		onClickOk: function(event) {
			event.preventDefault();

			this.hide();
		}

	});

	return ErrorLightbox;

});