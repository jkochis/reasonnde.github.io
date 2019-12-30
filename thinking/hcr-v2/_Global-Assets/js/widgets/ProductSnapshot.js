/*
	Malin
*/

define([
	"vendor/jquery.matchHeight",
	"lib/WidgetView",
	"lib/MediaHelper",
	"lib/MediaQueries"
],
function(
	matchHeight,
	WidgetView,
	MediaHelper,
	MediaQueries
) {

	var ProductSnapshot = WidgetView.extend({

		initialize : function() {
			this.setup();
		},

		setup : function() {
			this.$a = this.$(".details-menu ul li a");
			this.$a.on("click", $.proxy(this.toggleTabs, this));

			// takes care of window resize by itself
			this.$el.find('.details-menu ul li a').matchHeight();
		},

		toggleTabs : function(event) {
			event.preventDefault();
			var target = event.target;
			var self = this;

			this.$a.removeClass('is-active');
			this.$('.product-details').removeClass('is-active');

			this.$a.each( function(index){
				if(target == this) {
					$(this).addClass('is-active');
					self.$('.product-details').eq(index).addClass('is-active');
				}
			});
			
		}
	},
	{
		selector: '.w_product-snapshot'
	});

	return ProductSnapshot;
});