define([
	"underscore",
	"lib/Env",
	"lib/Util",
	"lib/WidgetView",
	"lib/MediaHelper",
	"lib/MediaQueries",
	"lib/common_components/LightboxModal"
],
function(
	_,
	Env,
	Util,
	WidgetView,
	MediaHelper,
	MediaQueries,
	LightboxModal,
	cycle
) {
	var Carousel = WidgetView.extend({
		defaults: {
			onCycleCreated: ''
		},
		initialize : function(options) {
			this.options = _.extend(this.defaults, options);
			this.setup();
			this.registerMediaHelper(CarouselSliderXSmall);
			this.registerMediaHelper(CarouselSliderSmallAndAbove);
		},
		setup: function() {
			var that = this;
			this.$pager = this.options.pager;
			this.$navArrows = this.options.navArrows;
			this.$copyTarget = this.options.copyTarget;
//Added DL product hash selectors
			var $noHash = $('.no-hash');
			var $isProduct = $('body').hasClass('w_product-snapshot');
//end added 08-19-2014
			this.$el.data('transition-delay', (Env.IOS || Env.Android) ? 0 : 1000)
			this.$el
				.cycle({
					slides: '> .slide',
					fx: this.options.fx,
					speed: Env.IE8 ? 1 : this.options.speed,
					timeout: this.options.timeout,
					transitionDelay: Env.IE8 ? 0 : this.$el.data('transition-delay'),
					pager: this.$pager,
					pagerTemplate: this.options.pagerTemplate,
					pagerActiveClass: 'is-active',
					startingSlide: this.options.startingSlide
				})
				// custom post-init event as the built-in doesn't really work
				.on('cycle-created', this.options.onCycleCreated)
				.on('cycle-before', function() {
					that.$copyTarget.removeClass('animate-come-in');
					that.$el.find('.slide_bg').removeClass('animate-come-in');
				})
				.on('cycle-after', function(event, optionHash, outgoingSlideEl, incomingSlideEl, forwardFlag) {
					var $incoming = $(incomingSlideEl);
				//	if($noHash.length < 1 && !$isProduct){
				//	window.location.hash = '/' + $incoming.attr('id');
				//	}
					that.$copyTarget.html( $incoming.find('[data-slide-caption]').html() )
					that.$el.find('.slide_bg').addClass('animate-come-in');
					setTimeout(function() {
						that.$copyTarget.addClass('animate-come-in');
						LightboxModal.build();
					}, Env.IE8 ? 0 : 125);
				})
			this.$pager.on('click', function() {
				that.$el
					.data('pause-triggered', true)
					.cycle('pause')
			});
			this.$navArrows.on('click', function() {
				var self = $(this);
				that.$el
					.data('pause-triggered', true)
					.cycle('pause')
				if(!that.$el.data('cycle.opts').busy) {
					if(self.hasClass('right')) {
						that.$el.cycle('next');
					}
					else if(self.hasClass('left')) {
						that.$el.cycle('prev');
					}
				}
				return false;
			});
			setTimeout(function() {
				that.$el.trigger('cycle-created');
				that.$copyTarget.addClass('animate-come-in')
				that.$el.find('.slide_bg').addClass('animate-come-in');
				
				$("a[rel^=lightbox]").off('click');
				LightboxModal.build();
				//if($noHash.length < 1 && !$isProduct){
					//window.location.hash = '/' + that.$el.find('.slide[id]').eq(0).attr('id');
				//}	
			}, 250);
		},
		tearDown: function() {
		}
	},
	{
		build: function() {
		}
	});
	var CarouselSliderSmallAndAbove = MediaHelper.extend({
		mediaQuery: MediaQueries.SMALL_AND_ABOVE,
		initialize: function(options) {
		},
		onSetUp: function() {
			this.$el.cycle('delay', this.$el.data('transition-delay'));
		}
	});
	var CarouselSliderXSmall = MediaHelper.extend({
		mediaQuery: MediaQueries.X_SMALL,
		initialize: function(options) {
		},
		onSetUp: function() {
			this.$el.cycle('delay', 0);
		}
	});
	return Carousel;
});