/**
 * Created by roel.kok on 4/25/14.
 */

define([
	"underscore",
	"lib/WidgetView",
	"lib/MediaHelper",
	"lib/MediaQueries"
],
function(
	_,
	WidgetView,
	MediaHelper,
	MediaQueries
) {

	// Please postfix your class names with 'Widget' or at least don't make it to generic like 'Video'
	var SampleWidget = WidgetView.extend({

		// Backbone style constructor
		initialize: function(options) {
			// Register a media helper by just passing the class name.
			// Constructor options can be passed as an object as a second param
			this.registerMediaHelper(SmallMediaHelper);
		}

	},
	// Static properties (second argument to 'extend' method)
	{
		// The css selector to look up the widget DOM node
		selector: ".w_sample-widget"
	});


	var SmallMediaHelper = MediaHelper.extend({

		mediaQuery: MediaQueries.X_SMALL,

		initialize: function(options) {
			_.bindAll(this,
				"onClickUl"
			);

			this.$ul = this.$("ul");
			this.$listItems = this.$("li");

			this.activeIndex = 0;
		},

		onSetUp: function() {
			this.$listItems.each(_.bind(function(i, el) {
				if(i == this.activeIndex) {
					$(el).css("display", "block")
				}
				else {
					$(el).css("display", "none");
				}
			}, this));

			this.$ul.on("click", this.onClickUl);
		},

		onTearDown: function() {
			this.$listItems.each(function(i, el) {
				$(el).css("display", "");
			});

			this.$ul.off("click", this.onClickUl);
		},

		next: function() {
			var prevIndex = this.activeIndex;
			this.activeIndex++;
			if(this.activeIndex >= this.$listItems.length) {
				this.activeIndex = 0;
			}

			$(this.$listItems[prevIndex]).css("display", "none");
			$(this.$listItems[this.activeIndex]).css("display", "block");
		},

		onClickUl: function(event) {
			event.preventDefault();

			this.next();
		}

	});


	// Don't forget to export your class
	return SampleWidget;
});


