/*
	Malin
*/

define([
	"lib/Env",
	"lib/WidgetView",
	"lib/MediaHelper",
	"lib/MediaQueries",
	"./segmentations_menu/HeaderDefaultMediaHelper"
],
function(
	Env,
	WidgetView,
	MediaHelper,
	MediaQueries,
	HeaderDefaultMediaHelper
) {

	var segMenuFindAgentText,
		segMenuLoginText;

	var SegmentationsMenu = WidgetView.extend({


		initialize : function() {
			this.setup();
			this.registerMediaHelper(SmallMediaHelper);
			this.registerMediaHelper(HeaderDefaultMediaHelper);
		},

		setup: function() {

			var selfEl = this.$el;
			var content = this.$el.find('.w_segmenu__content ul').eq(0);
			var originalHeight = content.height();

			this.$el.find('.w_segmenu__item').each( function(i){
				var $this = $(this);
				var bgUrl = $this.attr('data-bg');
				if(bgUrl) {
					$this.css({
						'background-image': 'url(' + bgUrl + ')'
					});
				}

				var arrow = $this.find('.icon').eq(0);

				$this.on(Env.IOS ? "touchstart" : "mouseenter", function(){
					$this.parent().addClass("hover");
					TweenMax.fromTo(arrow, 0, {'left': -2}, {'left': -36, ease: "Quad.easeOut"});
					// TweenMax.fromTo(arrow, 0.3, {'bottom': 0}, {'bottom': -30, ease: "Quad.easeOut"});
				}).on(Env.IOS ? "touchend touchcancel" : "mouseleave", function(){
					$this.parent().removeClass("hover");
					TweenMax.fromTo(arrow, 0, {'left': -36}, {'left': -2, ease: "Quad.easeOut"});
					// TweenMax.fromTo(arrow, 0.3, {'bottom': -30}, {'bottom': -60, ease: "Quad.easeOut", onComplete: function(){
					// 	TweenMax.to(arrow, 0, {'bottom': 0});
					// }});
				});
			})

			this.$el.find('.w_segmenu__top-tab').eq(0).click( function(e){
				e.preventDefault();
				if(selfEl.hasClass('is-open')){
					TweenMax.to(content, 0.3, {height: 0, ease: "Quad.easeInOut", onComplete: function() {
						selfEl.removeClass('is-open');
					}});

				} else {
					content.height(0);
					selfEl.addClass('is-open');
					TweenMax.to(content, 0.3, {height: originalHeight, ease: "Quad.easeInOut"});
				}
			})
		}
	},
	{
		selector: '.w_segmenu'
	});


	var SmallMediaHelper = MediaHelper.extend({

		mediaQuery: MediaQueries.SMALL,

		initialize: function(options) {
			segMenuFindAgentText = this.$el.find('a.find-agent').eq(0).html();
			segMenuLoginText = this.$el.find('a.login').eq(0).html();
		},

		onSetUp: function() {
			this.$el.find('a.find-agent').eq(0).html('');
			this.$el.find('a.login').eq(0).html('');
		},

		onTearDown: function() {
			this.$el.find('a.find-agent').eq(0).html(segMenuFindAgentText);
			this.$el.find('a.login').eq(0).html(segMenuLoginText);
		}

	});

	return SegmentationsMenu;
});