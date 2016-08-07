define([
	"underscore",
	"lib/Env",
	"lib/WidgetView",
	"lib/MediaHelper",
	"lib/MediaQueries",
	"lib/common_components/Carousel",
	"vendor/jquery.touchSwipe.min"
],
function(
	_,
	Env,
	WidgetView,
	MediaHelper,
	MediaQueries,
	Carousel
) {
	var CallToAction = WidgetView.extend({

		initialize: function() {
			this.setup();
			this.registerMediaHelper(CallToActionSmallAndAbove);
			this.registerMediaHelper(CallToActionXSmall);
		},

		defaults: {
			CallToActionDuration: 0.3,
			CallToActionEase: 'Expo.easeInOut'
		},

		events: {
			'click .read-testimonial': 'toggleCallToAction',
			'click .close-testimonial': 'toggleCallToAction',
			'mouseenter .read-testimonial': 'onReadCallToActionEnter',
			'mouseleave .read-testimonial': 'onReadCallToActionLeave'
		},

		setup: function() {
			var that = this;

			this.$el.find('.slide').each(function() {
				var slide_bg = $(this).find('.slide_bg');
				var bgUrl =	slide_bg.attr('data-bg');
				if(bgUrl) {
					slide_bg.css({
						'background-image': 'url(' + bgUrl + ')'
					});
				}
			})

			this.$el.find('.playbutton').each( function(i){
				var arrow = $(this).find('.icon').eq(0);

				$(this).mouseenter( function(){
					TweenMax.fromTo(arrow, 0.3, {'left': -254}, {'left': -127, ease: "Quad.easeOut"});
				}).mouseleave( function(){
					TweenMax.fromTo(arrow, 0.3, {'left': -127}, {'left': 0, ease: "Quad.easeOut", onComplete: function(){
						TweenMax.to(arrow, 0, {'left': -254});
					}});
				});
			})

			this.$el.find('[data-target-caption]').html( this.$el.find('[data-slide-caption]').eq(0).html() );
			this.$slides = this.$el.find('.slides');

			if(this.$slides.find('.slide').length > 1) {

				// on load
				var slide_link = window.location.href.split('#'),
					startingSlide;
				if(slide_link[1]) {
					startingSlide = this.getSlideIndexByAttribute(slide_link[1]);
				}

				this.carousel = new Carousel({
					el: this.$slides,
					startingSlide: startingSlide,
					copyTarget: this.$el.find('[data-target-caption]'),
					navArrows: this.$el.find('.nav-arrow'),
					fx: (Env.IOS || Env.ANDROID) ? 'scrollHorz' : 'fade',
					speed: (Env.IOS || Env.ANDROID) ? 350 : 1,
					timeout: 6000,
					pager: this.$el.find('.pagination'),
					pagerTemplate: '<li><div class="bg"></div></li>',
					onCycleCreated: function() {
						that.$el.find('.slide').each(function(index, el) {
							var paginationBgUrl = $(this).find('.slide_bg').attr('data-pagination-bg');
							if(paginationBgUrl) {
								that.$el.find('.pagination li').eq(index-1).find('.bg').css({
									'background-image': 'url(' + paginationBgUrl + ')'
								})
							}
						});
						that.$el.on("mouseenter click", function() {
							that.$slides.cycle('pause');
						});
//						that.$el.on("mouseleave", function() {
//							that.$slides.cycle('resume');
//						});
						that.$el.swipe({
							swipeLeft: function(event, direction, distance, duration, fingerCount, fingerData) {
								that.$slides.cycle('next');
								that.$slides.cycle('pause');
							},
							swipeRight: function(event, direction, distance, duration, fingerCount, fingerData) {
								that.$slides.cycle('prev');
								that.$slides.cycle('pause');
							}
						})
					}
				});
			} else {
				this.$el.find('[data-target-caption]').addClass('animate-come-in');
				this.$el.find('.slide_bg').addClass('animate-come-in');
			}
		},

		onTearDown: function() {

		},

		getSlideIndexByAttribute: function(id) {
			var $target_slide = this.$el.find('#'+id.replace('/', ''));
			return ($target_slide.length) ? $target_slide.index()+1 : '';
		},

		onReadCallToActionEnter: function(ev) {
			TweenMax.fromTo($(ev.currentTarget).find('.icon'), 0.15, {'top': 0}, {'top': -32, ease: "Quad.easeOut"});
		},

		onReadCallToActionLeave: function(ev) {
			TweenMax.fromTo($(ev.currentTarget).find('.icon'), 0.15, {'top': -32}, {'top': -62, ease: "Quad.easeOut"});
		},

		toggleCallToAction: function(ev) {
			var that = this;
			var slide = this.$el.find('.cycle-slide-active');
			var testimonial_wrapper = this.$el.find('.testimonial_wrapper');
			var testimonial = this.$el.find('.testimonial');
			var arrow = this.$el.find('.testimonial-arrow');
			var navbar = $('.w_nav-bar');

			if(navbar.length) {
				navbarHeight = navbar.height();
			} else {
				navbarHeight = 0;
			}

			this.$el.find('.target_testimonial').html( slide.find('.slide_testimonial').html() );

			if(testimonial_wrapper.height()) {
				testimonial.removeClass('visible');
				TweenMax.to(arrow,
					this.defaults.testimonialDuration,
					{'bottom': Env.IE8 ? -10 : -18, ease: this.defaults.testimonialEase}
				);
				TweenMax.fromTo(testimonial_wrapper,
					this.defaults.testimonialDuration,
					{'height': testimonial.outerHeight()},
					{'height': '0', ease: this.defaults.testimonialEase, onComplete: function() {
						testimonial_wrapper.addClass('overflow-visible');
					}
					});
			} else {
				testimonial.addClass('visible');
				TweenMax.to(arrow,
					this.defaults.testimonialDuration,
					{'bottom': Env.IE8 ? 0 : -7, ease: this.defaults.testimonialEase}
				);
				TweenMax.fromTo(testimonial_wrapper,
					this.defaults.testimonialDuration,
					{'height': 0},
					{'height': testimonial.outerHeight(), ease: this.defaults.testimonialEase, onComplete: function() {
						testimonial_wrapper.addClass('overflow-visible');
						TweenMax.to($('body, html'),
							0.9,
							{'scrollTop': testimonial.offset().top - navbarHeight, ease: that.defaults.testimonialEase}
						);
					}
					});
			}
			return false;
		}

	},
	{
		selector: '.w_calltoaction'
	});

var TestimonialSmallAndAbove = MediaHelper.extend({

		mediaQuery: MediaQueries.SMALL_AND_ABOVE,

		initialize: function(options) {

		},

		onSetUp: function() {
			var testimonial_wrapper = this.$el.find('.testimonial_wrapper');
			if(testimonial_wrapper.height()) {
				TweenMax.to(testimonial_wrapper,
					this.parent.defaults.testimonialDuration,
					{height: this.$el.find('.testimonial').outerHeight(), ease: this.parent.defaults.testimonialEase}
				)
			}
			$(window)
				.on('resize.testimonial_small_and_above', $.proxy(this.onResizeSmallAndAbove, this))
				.trigger('resize.testimonial_small_and_above')
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
		},

		onTearDown: function() {
			$(window).off('resize.testimonial_small_and_above');
		}

	},
	{
		IE8: true
	});

	var CallToActionXSmall = MediaHelper.extend({

		mediaQuery: MediaQueries.X_SMALL,

		initialize: function(options) {

		},

		onSetUp: function() {
			var testimonial_wrapper = this.$el.find('.testimonial_wrapper');
			if(testimonial_wrapper.height()) {
				TweenMax.to(testimonial_wrapper,
					this.parent.defaults.testimonialDuration,
					{height: this.$el.find('.testimonial').outerHeight(), ease: this.parent.defaults.testimonialEase}
				)
			}
		}

	});

	return CallToAction;
});