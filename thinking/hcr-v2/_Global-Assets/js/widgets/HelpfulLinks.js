define([
	"lib/Env",
	"lib/WidgetView",
	"lib/MediaHelper",
	"lib/MediaQueries",
	"vendor/jquery.matchHeight"
],
function(
	Env,
	WidgetView,
	MediaHelper,
	MediaQueries,
	matchHeight
) {

	var HelpfulLinks = WidgetView.extend({

		initialize: function() {
			this.setup();

			this.registerMediaHelper(HelpfulLinksSmallAndAbove);

			// console.log('Helpful Links');
		},

		setup: function() {

		},
//removed DL 08-19-2014
		//onResize: function() {
		//
		//},

		onTearDown: function() {

		}

	},
	{
		selector: '.w_helpful_links'
	});

	var HelpfulLinksSmallAndAbove = MediaHelper.extend({

		mediaQuery: MediaQueries.SMALL_AND_ABOVE,

		initialize: function(options) {

		},

		onSetUp: function() {
			this.$col_content = this.$el.find('.col_content');

			this.$col_content.matchHeight();

			$(window)
				.on('resize.w_helpful_links', $.proxy(this.onResize, this))
				.trigger('resize.w_helpful_links')

			this.$col_content.each( function(i){
				var arrow = $(this).find('.icon').eq(0);

				$(this).on(Env.IOS || Env.ANDROID ? "touchstart" : "mouseenter", function(){
					TweenMax.fromTo(arrow, 0.3, {'left': -60}, {'left': -30, ease: "Quad.easeOut"});
				}).on(Env.IOS || Env.ANDROID ? "touchend touchcancel" : "mouseleave", function(){
					TweenMax.fromTo(arrow, 0.3, {'left': -30}, {'left': 0, ease: "Quad.easeOut", onComplete: function(){
						TweenMax.to(arrow, 0, {'left': 0});
					}});
				});
			})
		},
// Removed DL 08-19-2014
		//onResize: function() {
		//	this.$el.find('.w_helpful_col').each(function() {
		//		var col_content = $(this).find('.col_content');
		//		col_content.css({
		//			'margin-top': ($(this).height() - col_content.outerHeight()) / 2
		//		})
		//	});
		//},

		onTearDown: function() {
			$(window).off('resize.w_helpful_links');
		}

	});

	return HelpfulLinks;
});