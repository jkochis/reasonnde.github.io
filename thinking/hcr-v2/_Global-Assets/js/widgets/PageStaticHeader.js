define([
	"lib/Env",
	"lib/WidgetView",
	"lib/MediaHelper",
	"lib/MediaQueries"
],
function(
	Env,
	WidgetView,
	MediaHelper,
	MediaQueries
) {

	var PageStaticHeader = WidgetView.extend({

		initialize: function() {
			this.setup();

			this.registerMediaHelper(PageStaticHeaderSmallAndAbove);

//			console.log('Page Static Header');
		},

		setup: function() {
			this.$el.find('.bg').each( function(i){
				var bgUrl = $(this).attr('data-bg');
				if(bgUrl) {
					$(this).css({
						'background-image': 'url(' + bgUrl + ')'
					});
				}
			})
			$(window)
				.on('resize.w_page_static_header', $.proxy(this.onResize, this))
				.trigger('resize.w_page_static_header')
		},

		onTearDown: function() {
			$(window).off('resize.page_static_header');
		},

		onResize: function() {
			var h;
			if(Env.IE8) {
				h = $(window).height() - $('.w_segmenu .w_segmenu__top').height() - $('.w_nav-bar').height();
				if(h < this.$el.data('min-height')) {
					h = this.$el.data('min-height')
				} 
				if(h > this.$el.data('max-height')) {
					h = this.$el.data('max-height')
				} 
			} else {
				h = 'auto'
			}
			this.$el.css({
				height: h
			})
			
		}

	},
	{
		selector: '.w_page_static_header'
	});

	var PageStaticHeaderSmallAndAbove = MediaHelper.extend({

		mediaQuery: MediaQueries.SMALL_AND_ABOVE,

		initialize: function(options) {

		},

		onSetUp: function() {
			$(window)
				.on('resize.page_static_header_small_and_above', $.proxy(this.onResizeSmallAndAbove, this))
				.trigger('resize.page_static_header_small_and_above')
		},

		onResizeSmallAndAbove: function() {
			var h = $(window).height() - $('.w_segmenu .w_segmenu__top').height() - $('.w_nav-bar').height();
			h = (Env.IOS || Env.ANDROID) ? h - 20 : h;
			if(h < this.$el.data('min-height')) {
				h = this.$el.data('min-height')
			} 
			if(h > this.$el.data('max-height')) {
				h = this.$el.data('max-height')
			} 
			this.$el.height(h).find('.slider').css({
				height: h
			})

		},

		onTearDown: function() {
			$(window).off('resize.page_static_header_small_and_above');
		}

	});

	return PageStaticHeader;
});