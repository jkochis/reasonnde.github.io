/**
 * Created by roel.kok on 6/26/14.
 */

define([
	"lib/BaseView"
],
function(
	BaseView
) {


	var StepView = BaseView.extend({

		initialize: function(options) {},

		show: function() {
			this.$el.css("display", "block");
		},

		hide: function() {
			this.$el.css("display", "none")
		}

	});

	return StepView;
});