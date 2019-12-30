/* globals define */

'use strict';

define(['jquery', 'underscore', 'lib/Util', 'lib/BaseView', 'lib/LightboxHelper', "lib/MediaQueries"],
function($, _, Util, BaseView, LightboxHelper, MediaQueries) {

	var TestimonialLightbox = BaseView.extend({

		initialize: function() {
			_.bindAll(this, 'onClickClose');
		},

		createPopIn: function(templateIndex) {
			var testimonialTemplate = 'everwell-lightbox-testimonial-' + templateIndex + '-tpl';
			this.setElement(Util.loadTemplate(testimonialTemplate));

			// ... lel ie8
			var that = this;

			// Set height and marginTop
			window.setTimeout(function() {
				var popinHeight = that.$el.find('.ev_lightbox-testimonial-ctn').outerHeight();
				var minHeight = that.$el.find('.ev_lightbox-testimonial-head').outerHeight();
				var isMobile = (/iPhone|iPod|Android|BlackBerry|IEMobile/).test(navigator.userAgent);

				// Don't align it on mobile
				//if(!isMobile) {
					if(popinHeight < minHeight) {
						popinHeight = minHeight;
					}
					if(that.$el.length > 0) {
						that.$el.height(popinHeight);
						that.$el[0].style.marginTop = -(popinHeight / 2) + 'px';
					} else {
						console.log('debug: the popin template is not defined');
					}
				//} else {
					// On mobile, set a scroll container if the container is bigger that device
				//	var visibleHeight = $(window).height() - minHeight - 60;
				//	if(popinHeight > visibleHeight) {
				//		that.$el.find('.ev_lightbox-testimonial-ctn').height(visibleHeight);
				//	}
				//}
				if(matchMedia(MediaQueries.HEADER_DEFAULT).matches){
						$("body").css("overflow", "hidden");		
				}
			}, 100);

			this.lightboxHelper = new LightboxHelper({
				el: this.el
			});

			this.$close = this.$('.close');
			this.$close.on('click', this.onClickClose);
			this.$close.on('touchstart', this.onClickClose);
		},

		show: function(testimonialIndex) {
			this.createPopIn(testimonialIndex);
			this.lightboxHelper.show();
		},

		hide: function() {
			this.lightboxHelper.hide();
			$("body").css("overflow", "inherit");
		},

		onClickClose: function(event) {
			event.preventDefault();
			this.hide();
		}
	});

	return TestimonialLightbox;
});