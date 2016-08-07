define([
	"lib/WidgetView",
	"lib/MediaHelper",
	"lib/MediaQueries"
],
function(
	WidgetView,
	MediaHelper,
	MediaQueries
) {
	var Disclaimer = WidgetView.extend({

		initialize: function() {
			_.bindAll(this,
				'toggleVisibility',
				'onDisclaimerResize'
			);

			this.disclaimerBody = this.$('.disclaimer-body');
			this.disclaimerCopy = this.$('.disclaimer-copy');
			this.contentHeight = this.disclaimerCopy.height() + 50;

			this.setup();
		},

		setup: function() {
			
			this.$('.disclaimer-link').on('click', this.toggleVisibility);
			this.$('.disclaimer-close').on('click', this.toggleVisibility);
			$(window).on('resize.w_disclaimer', this.onDisclaimerResize);
		},

		toggleVisibility: function(e) {
			e.preventDefault();
			var self = this;
			var navbar = $('.w_nav-bar');

			if(navbar.length) {
				navbarHeight = navbar.height();
			} else {
				navbarHeight = 0;
			}

			if(this.disclaimerBody.hasClass('is-hidden')) {
				this.disclaimerBody.removeClass('is-hidden');
				TweenMax.to(this.disclaimerBody, 0.4, {'height': this.contentHeight, ease: "Quad.easeIn", onComplete: function() {
					TweenMax.to($('body, html'), 0.9, {'scrollTop': self.disclaimerBody.offset().top - navbarHeight, ease: "Quad.easeIn"});
				}});
			} else {
				TweenMax.to(this.disclaimerBody, 0.4, {'height': 0, ease: "Quad.easeOut", onComplete:function(){
					self.disclaimerBody.addClass('is-hidden');
				}});
			}
			
		},

		onDisclaimerResize: function() {
			this.contentHeight = this.disclaimerCopy.height() + 50;
		}
	},
	{
		selector: '.w_disclaimer'
	});

	return Disclaimer;
});