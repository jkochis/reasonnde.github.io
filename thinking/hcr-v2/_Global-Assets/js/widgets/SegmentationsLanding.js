define([
	"underscore",
	"lib/Env",
	"lib/WidgetView",
	"lib/MediaHelper",
	"lib/MediaQueries"
],
function(
	_,
	Env,
	WidgetView,
	MediaHelper,
	MediaQueries
) {
	var POINTER_START_EVENT = "MSPointerOver MSPointerDown pointerover pointerdown";
	var POINTER_END_EVENT = "MSPointerUp MSPointerOut pointerup pointerout pointerleave";
	var SegmentationsLanding = WidgetView.extend({
		initialize: function() {
			this.setup();
			this.registerMediaHelper(SmallMediaHelper);
			this.registerMediaHelper(XSmallMediaHelper);
//			console.log('Segmentations Landing');
		},
		setup: function() {
			this.ENV_TOUCH = Env.IOS || Env.ANDROID || Env.WP || Env.SURFACE;
			$(window)
				.on('resize.w_segmenu_landing', $.proxy(this.onResize, this))
				.trigger('resize.w_segmenu_landing')
			this.$el.find('.item_bg').each( function(i){
				var bgUrl = $(this).attr('data-bg');
				if(bgUrl) {
					$(this).css({
						'background-image': 'url(' + bgUrl + ')'
					});
				}
			})
			var ducks = this.$el.find('.item_duck'),
				numbers = (function(a,b){while(a--){b[a]=a+1}return b})(ducks.length,[]);
			_.each(_.shuffle(numbers), function(item, index) {
				ducks.eq(index).addClass('duck_'+item);
			});
			if(this.ENV_TOUCH) this.$el.addClass('mobile-touch');
			if(Env.SURFACE) this.$el.addClass('microsoft-surface');
		},
		onResize: function() {
			var h = $(window).height();
			this.$el
				.css({
					'height': h
				})
				.find('.w_segmenu__content')
				.css({
					'height': h - $('.w_segmenu__top').height() - this.$el.find('.w_nav-bar').height()
				})
		},
		onTearDown: function() {
			$(window).off('resize.w_segmenu_landing');
		}
	},
	{
		selector: '.w_segmenu_landing'
	});
	var SmallMediaHelper = MediaHelper.extend({
		mediaQuery: MediaQueries.SMALL_AND_ABOVE,
		initialize: function(options) {
			var $segmenuItems = this.$el.find('.w_segmenu__item');
			$segmenuItems.each(_.bind(function(i, el){
				this.registerChildMediaHelper(new SmallMediaHelper.SegmenuItem({
					el: el
				}));
//				var $this = $(this);
//
//				if(!this.ENV_TOUCH) {
//					$this
//						.on('mouseenter', function(e) {
//							$this.addClass('active');
//							$this.parent().addClass("hover");
//						})
//						.on('mouseleave', function(e) {
//							$this.removeClass('active');
//							$this.parent().removeClass("hover");
//						});
//				}
			}, this));
		},
		onSetUp: function() {
		},
		onTearDown: function() {
			//
		}
	});
	SmallMediaHelper.SegmenuItem = MediaHelper.extend({
		ignoreMouseEnter: false,
		initialize: function() {
			_.bindAll(this,
				"onPointerStart",
				"onPointerEnd",
				"onTouchStart",
				"onMouseEnter",
				"onMouseLeave"
			);
		},
		onSetUp: function() {
			this.$el.on(POINTER_START_EVENT, this.onPointerStart);
			this.$el.on(POINTER_END_EVENT, this.onPointerEnd);
			this.$el.on("touchstart", this.onTouchStart);
			this.$el.on("mouseenter", this.onMouseEnter);
			this.$el.on("mouseleave", this.onMouseLeave);
		},
		onTearDown: function() {
			this.$el.off(POINTER_START_EVENT, this.onPointerStart);
			this.$el.off(POINTER_END_EVENT, this.onPointerEnd);
			this.$el.off("touchstart", this.onTouchStart);
			this.$el.off("mouseenter", this.onMouseEnter);
			this.$el.off("mouseleave", this.onMouseLeave);
		},
		onPointerStart: function(event) {
			if(event.originalEvent.pointerType === 2 || event.originalEvent.pointerType === 3 || event.originalEvent.pointerType === "touch" || event.originalEvent.pointerType === "pen") {
				this.ignoreMouseEnter = true;
			}
		},
		onPointerEnd: function() {
			this.ignoreMouseEnter = false;
		},
		onTouchStart: function() {
			this.ignoreMouseEnter = true;
		},
		onMouseEnter: function() {
			if(!this.ignoreMouseEnter) {
				this.$el.addClass("active");
				this.$el.parent().addClass("hover");
			}
		},
		onMouseLeave: function() {
			this.$el.removeClass("active");
			this.$el.parent().removeClass("hover");
		}
	});
	var XSmallMediaHelper = MediaHelper.extend({
		mediaQuery: MediaQueries.X_SMALL,
		initialize: function(options) {
			var $segmenuItems = this.$(".w_segmenu__item");
			$segmenuItems.each(_.bind(function(i, el) {
				this.registerChildMediaHelper(new XSmallMediaHelper.SegmenuItem({
					el: el
				}))
			}, this));
		}
	});
	XSmallMediaHelper.SegmenuItem = MediaHelper.extend({
		ignoreMouseEnter: false,
		initialize: function() {
			_.bindAll(this,
				"onPointerStart",
				"onPointerEnd",
				"onTouchStart",
				"onMouseEnter",
				"onMouseLeave"
			);
		},
		onSetUp: function() {
			this.$el.on(POINTER_START_EVENT, this.onPointerStart);
			this.$el.on(POINTER_END_EVENT, this.onPointerEnd);
			this.$el.on("touchstart", this.onTouchStart);
			this.$el.on("mouseenter", this.onMouseEnter);
			this.$el.on("mouseleave", this.onMouseLeave);
		},
		onTearDown: function() {
			this.$el.off(POINTER_START_EVENT, this.onPointerStart);
			this.$el.off(POINTER_END_EVENT, this.onPointerEnd);
			this.$el.off("touchstart", this.onTouchStart);
			this.$el.off("mouseenter", this.onMouseEnter);
			this.$el.off("mouseleave", this.onMouseLeave);
		},
		onPointerStart: function(event) {
			if(event.originalEvent.pointerType === 2 || event.originalEvent.pointerType === 3 || event.originalEvent.pointerType === "touch" || event.originalEvent.pointerType === "pen") {
				this.ignoreMouseEnter = true;
			}
		},
		onPointerEnd: function() {
			this.ignoreMouseEnter = false;
		},
		onTouchStart: function() {
			this.ignoreMouseEnter = true;
		},
		onMouseEnter: function() {
			if(!this.ignoreMouseEnter) {
				this.$el.parent().addClass("hover");
			}
		},
		onMouseLeave: function() {
			this.$el.parent().removeClass("hover");
		}
	});
	return SegmentationsLanding;
});