/**
 * Created by roel.kok on 7/7/14.
 */

define([
	"underscore",
	"backbone",
	"vendor/jquery.maskedinput.min",
	"lib/Util",
	"lib/MediaQueries",
	"lib/WidgetView",
	"lib/MediaHelper",
	"./Sidebar",
	"./contact/BrokersForm"
],
function(
	_,
	Backbone,
	maskedinput,
	Util,
	MediaQueries,
	WidgetView,
	MediaHelper,
	Sidebar,
	Form
) {

	var SidebarBrokers = WidgetView.extend({

		initialize: function(options) {
			this.registerMediaHelper(DefaultMediaHelper);
		}

	},
	{
		selector: ".w_sidebar-brokers"
	});

	var DefaultMediaHelper = MediaHelper.extend({

		mediaQuery: MediaQueries.HEADER_DEFAULT,

		initialize: function(options) {
			_.bindAll(this,
				"onUpdateRoot"
			);

			this.form = new Form({
				el: this.$el
			});
		},

		onSetUp: function() {
			this.$el.on(Sidebar.UPDATE_EVENT, this.onUpdateRoot);
		},

		onTearDown: function() {
			this.$el.off(Sidebar.UPDATE_EVENT, this.onUpdateRoot);
		},

		onUpdateRoot: function() {
			if(!this.$el.hasClass("active")) {
				// Collapsed
				this.form.removeErrors();
			}
		}

	},
	{
		IE8: true
	});

	return SidebarBrokers;

});