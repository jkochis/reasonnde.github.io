define([
	"underscore",
	"lib/WidgetView",
	"lib/MediaQueries",
	"lib/Env",
	"./VideoPlayer"
],
function(
	_,
	WidgetView,
	MediaQueries,
	Env,
	VideoPlayer
) {
	var LightboxModal = WidgetView.extend({
		defaults: {
			duration: 0.5,
			tDelay: 0.15,
			easing: 'Expo.easeInOut',
			overlayOpacity: 0.67
		},
		events: {
			'click .hide-modal': 'hide'
		},
		initialize : function() {
			this.options = _.extend(this.defaults, this.$el.data());
			this.has_video = this.$el.find('.w_video_holder').length;

			// ADDENDUM EVERWELL: hide sharing
			this.has_sharing = this.$el.find('.w_video_holder').data('hide-sharing');
			// /ADDENDUM EVERWELL: hide sharing
			
			this.$overlay = $('.w_lightbox_overlay');
			this.setup();
		},
		setup: function() {
			var that = this;
			var el = this.$el;
			var dropdowns = this.$el.find('.dropdown-box');
			this.$shareWidget = this.$el.find('.w_share');

			// ADDENDUM EVERWELL: hide sharing
			if(this.has_sharing) {
				this.$shareWidget.hide();
			}
			// /ADDENDUM EVERWELL: hide sharing

			this.$submitButton = this.$el.find('.submit-form');
			// if(!this.isVisible()) {
				this.show();
			// }
			if(this.has_video) {
				// ADDENDUM EVERWELL
				var videoHolder = el.find('.w_video_holder');
				var videoType = videoHolder.attr('data-src') ? 'youtube' : 'brightcove';
				this.video_player = new VideoPlayer({
					el: videoHolder,
					videoType: videoType
				});
				// ADDENDUM EVERWELL
			}
			if(this.$shareWidget.length) {
				this.$shareWidget.trigger('collapseServices');
			}
			this.$overlay.on('click.lightboxModal', function(ev) {
				if(!that.$el.is(ev.target) && that.$el.has(ev.target).length === 0) {
					that.hide();
				}
			});
			$(document.body).on('keyup.lightboxModal', function(ev) {
				if(ev.keyCode === 27) {
					that.hide();
				}
			});
			// a dropdown which, when selected, highlights the submit button
			this.$el.find('[data-highlight-submit]').on('click.lightboxModal', function() {
				that.$submitButton.addClass('has-selection');
			});
			$(window)
				.on('resize.lightboxModal', $.proxy(that.onResize, that))
				.trigger('resize.lightboxModal')
		},
		onResize: function() {
			var data = this.$el.data('aspect-ratio') || '',
				windowWidth = $(window).width(),
				windowHeight = $(window).height(),
				toolsWidth = 60;
			if(this.has_video && data && data.indexOf(':') !== -1) {
				var ar = this.$el.data('aspect-ratio').split(':'),
					maxW = windowWidth * 0.75,
					maxH = windowHeight * 0.75,
					w = maxW,
					h = w / (ar[0] / ar[1]);
				if(h > maxH) {
					h = maxH;
					w = (ar[0] * maxH) / ar[1]
				}
				this.$el.css({
					'width': w,
					'margin-left': -(w+toolsWidth)/2,
					'height': h,
					'margin-top': -h/2
				})

				// ADDEDDUM EVERWELL
				if(this.$el.find('object').length > 0) {
					this.$el.find('object').css({
						'height': h,
						'width': w
					});
				}
				// /ADDEDDUM EVERWELL
			} else {
				this.$el.css('margin-top', -this.$el.height()/2)
			}
		},
		tearDown: function() {
			this.$overlay.off('click.lightboxModal');
			this.$el.find('[data-highlight-submit]').off('click.lightboxModal');
			this.$submitButton.removeClass('has-selection');
			$(document.body).off('keyup.lightboxModal');
			$(window).off('resize.lightboxModal');
			this.undelegateEvents();
			this.$el.removeData().unbind();
			if(this.video_player instanceof VideoPlayer) {
				this.video_player.tearDown();
			}
		},
		isVisible: function() {
			return this.$overlay.is(':visible') && this.$overlay.css('opacity')
		},
		isHidden: function() {
			return this.$overlay.is(':hidden') && this.$overlay.css('opacity') === 0
		},
		show: function() {
			TweenMax.killAll();
			this.$overlay.css('visibility', 'visible');
			// this.$overlay.css('display', 'block');
			this.$el
				.css('visibility', 'visible')
				// .css('display', 'block')
				.css('margin-top', -this.$el.height()/2)
			var t_show = new TimelineLite();
			t_show.fromTo(this.$overlay,
				this.options.duration,
				{'opacity': 0},
				{'opacity': this.options.overlayOpacity, ease: this.options.easing}
			);
			t_show.fromTo(this.$el.find('.item_wrapper'),
				this.options.duration,
				{rotationX: '-25deg', opacity: 0},
				{rotationX: '0deg', opacity: 1, ease: this.options.easing},
				'-='+this.options.tDelay
			);
			if(this.has_video) {
				t_show.fromTo(this.$el.find('.lightbox_tools'),
					this.options.duration,
					{'x': '-100%', 'opacity': 0},
					{'x': "0%", 'opacity': 1, ease: this.options.easing},
					'-='+this.options.tDelay
				);
			}
			/*
			//position absolute for touch devices.
			 if(Env.IOS){
			    this.$el.css('position','absolute');
			    $('body').css('overflow','hidden');
			    $('html').css('overflow','hidden');
			} */
		},
		hide: function(event) {
			if(event) {
				event.preventDefault();
			}
			var that = this;
			var t_hide = new TimelineLite();
			if(this.$shareWidget.length) {
				this.$shareWidget.trigger('collapseServices');
			}
			if(this.has_video) {
				t_hide.fromTo(this.$el.find('.lightbox_tools'),
					this.options.duration,
					{'x': '0'},
					{'x': '-100%', ease: this.options.easing}
				);
			}
			t_hide.fromTo(this.$el.find('.item_wrapper'),
				this.options.duration,
				{rotationX: '0', opacity: 1},
				{rotationX: '-25deg', opacity: 0, ease: this.options.easing},
				'-='+this.options.tDelay
			);
			t_hide.fromTo(this.$overlay,
				this.options.duration,
				{'opacity': this.options.overlayOpacity},
				{'opacity': 0, ease: this.options.easing},
				'-='+this.options.tDelay
			);
			t_hide.call(function() {
				that.$overlay.css('visibility', 'hidden');
				// that.$overlay.css('display', 'none');
				that.$el
					// .css('display', 'none')
					.css('visibility', 'hidden')
					.removeClass('before-hide');
				that.tearDown();
			});
			/*
			//position absolute for touch devices.
			if(Env.IOS){
			    this.$el.css('position','absolute');
			    $('body').css('overflow','inherit');
			    $('html').css('overflow','inherit');
			}
			*/
		},
	},
	{
		build: function() {
			$("a[rel^=lightbox]").on('click', function(ev) {
				var self = $(this);
				var target = self.attr('href');
				if(!target.match(/^http\:/) && $(target).length) {
					new LightboxModal({
						el: $(target)
					});
					return false;
				}
			});
		}
	});
	return LightboxModal;
});