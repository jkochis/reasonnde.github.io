define([
	"underscore",
	"vendor/jquery.matchHeight",
	"lib/WidgetView",
	"lib/MediaHelper",
	"lib/MediaQueries"
],
function(
	_,
	matchHeight,
	WidgetView,
	MediaHelper,
	MediaQueries
) {

	var IsIsNot = WidgetView.extend({

		initialize: function() {
			this.setup();
			this.registerMediaHelper(IsIsNotXSmall);

//			console.log('Is Is Not');
		},

		setup: function() {
			// takes care of window resize by itself
			this.$el.find('.col').matchHeight();
		},

		onTearDown: function() {

		}

	},
	{
		selector: '.w_is_is_not'
	});

	var IsIsNotXSmall = MediaHelper.extend({

		mediaQuery: MediaQueries.X_SMALL,

		initialize: function(options) {

		},

		onTabToggle: function(ev) {
			var trigger = $(ev.currentTarget),
				index = trigger.index();
			this.$el.find('.toggle-tab').removeClass('active');
			trigger.addClass('active');
			this.$el.find('.col').hide().eq(index).show();

			return false;
		},

		onSetUp: function() {
			var toggleTab = this.$el.find('.toggle-tab');
			toggleTab.on('click', $.proxy(this.onTabToggle, this));
		}

	});

	return IsIsNot;
});