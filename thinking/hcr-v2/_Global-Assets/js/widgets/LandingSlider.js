define([
	"lib/Env",
	"underscore",
	"vendor/jquery.ba-hashchange",
	"vendor/jquery.cycle2",
	"lib/WidgetView",
	"lib/MediaHelper",
	"lib/MediaQueries",
	"vendor/jquery.touchSwipe.min"
],
function(
	Env,
	_,
	hashchange,
	cycle,
	WidgetView,
	MediaHelper,
	MediaQueries
) {

	var LandingSlider = WidgetView.extend({

		stopped: false,

		initialize: function() {
			_.bindAll(this,
				"onMouseEnterCta",
				"onMouseLeaveCta"
			);

			this.setup();

			this.registerMediaHelper(LandingSliderXSmall);
			this.registerMediaHelper(LandingSliderSmallAndAbove);

//			console.log('Landing Slider');
		},

		setup: function() {
			var that = this,
				copyTarget = that.$el.find('[data-target-caption]');


			// Applies only to small and above but we have to do this here becuase the mediahelper doesn't know when the slide is updated
			function setUpCta() {
				var $cta = copyTarget.find(".cta");
				if($cta.length > 0) {
					that.$cta = $cta;
					that.$cta.on("mouseenter", that.onMouseEnterCta);
					that.$cta.on("mouseleave", that.onMouseLeaveCta);
				}
			}

			function tearDownCta() {
				if(that.$cta) {
					// Clean up
					that.$cta.off("mouseenter", that.onMouseEnterCta);
					that.$cta.off("mouseleave", that.onMouseLeaveCta);
					TweenMax.killTweensOf(that.$cta.find(".icon"));
					that.$cta = null;
				}
			}

			this.$el.find('.slide_bg').each( function(i){
				var bgUrl = $(this).attr('data-bg');
				if(bgUrl) {
					$(this).css({
						'background-image': 'url(' + bgUrl + ')'
					});
				}
			})

			// cycle pre-init: fill the copy from a first slide
			this.$el.find('[data-target-caption]').html( this.$el.find('[data-slide-caption]').eq(0).html() );
			setUpCta();

			this.$slides = this.$el.find('.slides');

			this.$slides.data('transition-delay', (Env.IOS || Env.ANDROID) ? 0 : 1000)

			// on load
			var slide_link = window.location.href.split('#'),
				startingSlide;
			if(slide_link[1]) {
				startingSlide = this.getSlideIndexByAttribute(slide_link[1]);
			}

			this.$slides

				.cycle({
					slides: '> .slide',
					fx: (Env.IOS || Env.ANDROID) ?  'scrollHorz' : 'none',
					speed: (Env.IOS || Env.ANDROID) ? 350 : 1,
					timeout: 6000,
					transitionDelay: this.$slides.data('transition-delay'),
					pager: this.$el.find('.pagination'),
					pagerTemplate: '<li></li>',
					pagerActiveClass: 'is-active',
					startingSlide: startingSlide
				})

				.on('cycle-before', function() {
					that.$el.find('[data-target-caption]').removeClass('animate-come-in')
					that.$el.find('.slide_bg').removeClass('animate-come-in')
				})

				.on('cycle-after', function(event, optionHash, outgoingSlideEl, incomingSlideEl, forwardFlag) {
					var $incoming = $(incomingSlideEl);
					//window.location.hash = '/' + $incoming.attr('id');

					tearDownCta();

					copyTarget.html( $incoming.find('[data-slide-caption]').html() )
					that.$el.find('.slide_bg').addClass('animate-come-in')
					setTimeout(function() {
						copyTarget.addClass('animate-come-in')
					}, 125);

					setUpCta();
				})

			this.$el.find('.pagination').on('click', function() {
				that.$slides
					.data('pause-triggered', true)
					.cycle('pause')
				that.stopped = true;
			});

			this.$el.find('.nav-arrow').on('click', function() {
				var self = $(this);

				that.$slides
					.data('pause-triggered', true)
					.cycle('pause')
				that.stopped = true;

				if(!that.$slides.data('cycle.opts').busy) {
					if(self.hasClass('right')) {
						that.$slides.cycle('next');
					}
					else if(self.hasClass('left')) {
						that.$slides.cycle('prev');
					}
				}
				return false;
			});

			this.$el
				.on('mouseenter', function() {
					that.$slides.cycle('pause')
				})
				.on('mouseleave', function() {
					if ( !that.stopped )
						that.$slides.cycle('resume')
				})
				.swipe({
					swipeLeft: function(event, direction, distance, duration, fingerCount, fingerData) {
						that.$slides.cycle('next');
						that.$slides.cycle('pause');
						that.stopped = true;
					},
					swipeRight: function(event, direction, distance, duration, fingerCount, fingerData) {
						that.$slides.cycle('prev');
						that.$slides.cycle('pause');
						that.stopped = true;
					}
				})

			setTimeout(function() {
				copyTarget.addClass('animate-come-in')
				that.$el.find('.slide_bg').addClass('animate-come-in')

				//window.location.hash = '/' + that.$el.find('.slide[id]').eq(0).attr('id');
			}, 250);

			$(window)
				.on('resize.w_landing_slider', $.proxy(this.onResize, this))
				.on('resize.w_landing_slider.end', _.debounce($.proxy(this.onResizeEnd, this), 1000));
		},

		getSlideIndexByAttribute: function(id) {
			var $target_slide = this.$el.find('#'+id.replace('/', ''));
			return ($target_slide.length) ? $target_slide.index() : '';
		},

		onMouseEnterCta: function() {
			var $icon = this.$cta.find(".icon");
			TweenMax.fromTo($icon, 0.3, {'left': -60}, {'left': -30, ease: "Quad.easeOut"});
		//	this.$slides.cycle('pause');
		},

		onMouseLeaveCta: function() {
			var $icon = this.$cta.find(".icon");
			TweenMax.fromTo($icon, 0.3, {'left': -30}, {'left': 0, ease: "Quad.easeOut", onComplete: function(){
				TweenMax.set($icon, 0, {'left': 0});
			}});
			//this.$slides.cycle('resume');
		},

		onResize: function() {
			this.$slides.cycle('pause');
		},

		onResizeEnd: function() {
			if(!this.$slides.data('pause-triggered')) {
				this.$slides.cycle('resume');
			}
		},

		onTearDown: function() {
			$(window).off('resize.w_landing_slider')
		}

	},
	{
		selector: '.w_landing_slider'
	});

	var LandingSliderSmallAndAbove = MediaHelper.extend({

		mediaQuery: MediaQueries.SMALL_AND_ABOVE,

		initialize: function(options) {

			this.registerChildMediaHelper(new ScrollCta({
				el: this.$(".scroll-cta")
			}))
		},

		onSetUp: function() {
			var $slides =  this.$el.find('.slides');

			$slides.cycle('delay', $slides.data('transition-delay'));

			$(window)
				.on('resize.w_landing_slider_small_and_above', $.proxy(this.onResizeSmallAndAbove, this))
				.trigger('resize.w_landing_slider_small_and_above')
		},

		onTearDown: function() {
			$(window).off('resize.w_landing_slider_small_and_above');
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
			this.$el.find('.slider').css({
				height: h
			})
		}

	},
	{
		IE8: true
	});

	var LandingSliderXSmall = MediaHelper.extend({

		mediaQuery: MediaQueries.X_SMALL,

		initialize: function(options) {

		},

		onSetUp: function() {
			this.$el.find('.cta').addClass('textlink has-arrow');
			this.$el.find('.slides').cycle('delay', 0);
		},

		onTearDown: function() {
			this.$el.find('.cta').removeClass('textlink has-arrow');
		}

	});

	var ScrollCta = MediaHelper.extend({

		initialize: function(options) {
			this.$arrow1 = this.$(".arrow.is-1");
			this.$arrow2 = this.$(".arrow.is-2");
		},

		// onSetUp: function() {
		// 	var duration = 1;
		// 	var repeatDelay = 2;

		// 	TweenMax.fromTo(this.$arrow1, duration, {
		// 		opacity: 1
		// 	}, {
		// 		opacity: .5,
		// 		repeat: -1,
		// 		delay: 0,
		// 		repeatDelay: repeatDelay,
		// 		ease: Quad.easeIn
		// 	});

		// 	TweenMax.fromTo(this.$arrow2, duration, {
		// 		opacity: 1
		// 	}, {
		// 		opacity: .5,
		// 		repeat: -1,
		// 		delay: .15,
		// 		repeatDelay: repeatDelay,
		// 		ease: Quad.easeIn
		// 	});
		// },

		onTearDown: function() {
			TweenMax.killTweensOf(this.$arrow1);
			TweenMax.killTweensOf(this.$arrow2);
		}

	});

	return LandingSlider;
});