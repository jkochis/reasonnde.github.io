/**
 * Created by roel.kok on 7/7/14.
 */

define([
	"underscore",
	"lib/MediaQueries",
	"lib/WidgetView",
	"lib/MediaHelper",
	"./Sidebar",
	"./contact/AgentsForm"
],
function(
	_,
	MediaQueries,
	WidgetView,
	MediaHelper,
	Sidebar,
	Form
) {

	var SidebarAgents = WidgetView.extend({

		initialize: function(options) {
			this.registerMediaHelper(DefaultMediaHelper);
		}

	},
	{
		selector: ".w_sidebar-agents"
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

	return SidebarAgents;

});