/**
 * Created by roel.kok on 6/25/14.
 */

define([
	"lib/WidgetView",
	"lib/Env"
],
function(
	WidgetView,
	Env
) {

	var RightPlan = WidgetView.extend({

		initialize: function(options) {

			this.ENV_TOUCH = Env.IOS || Env.ANDROID || Env.WP || Env.SURFACE;

			if(!this.ENV_TOUCH) {
				this.$el.addClass('not-touch');
			}

			this.$("a").each(function(i, el) {
				var $el = $(el);
				$el.find(".visual").css("background-image", "url(" + $el.data("bg") + ")");
			});
		}
	},
	{
		selector: ".w_right-plan"
	});

	return RightPlan;

});