/**
 * Created by roel.kok on 4/28/14.
 */

define([
	"./nav_bar/DefaultMediaHelper",
	"./nav_bar/HamburgerMediaHelper",
	"lib/WidgetView"
],
function(
	DefaultMediaHelper,
	HamburgerMediaHelper,
	WidgetView
) {
	

	var NavBarWidget = WidgetView.extend({

		initialize: function(options) {
			this.registerMediaHelper(DefaultMediaHelper);
			this.registerMediaHelper(HamburgerMediaHelper);
		}

	},
	{
		selector: ".w_nav-bar"
	});

	return NavBarWidget;
});