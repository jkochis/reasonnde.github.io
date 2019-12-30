/*
	Malin
*/

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

	var Footer = WidgetView.extend({

		initialize : function() {
			this.setup();
			this.registerMediaHelper(SmallMediaHelper);
		},

		setup : function() {
			var legalLink = this.$el.find('a.legal-link').eq(0);
			var legalContent = this.$el.find('.footer_legal-content').eq(0);

			$(legalLink).click( function(e){
				e.preventDefault();
				if( legalLink.hasClass('is-open')) {
					legalLink.removeClass('is-open');
					legalContent.removeClass('is-open');
				} else {
					legalLink.addClass('is-open');
					legalContent.addClass('is-open');
					$("html, body").animate({ scrollTop: $(document).height() });
				}
			})
		}
	},
	{
		selector: '.w_footer'
	});


	var SmallMediaHelper = MediaHelper.extend({

		mediaQuery: MediaQueries.X_SMALL,

		initialize: function(options) {
			this.phoneEl = this.$el.find('.footer_header-container h3').eq(0);
			this.phoneNumber = this.phoneEl.attr('data-number');
		},

		onSetUp: function() {
			this.phoneEl.wrap('<a href="tel:'+this.phoneNumber+'"></a>');
		},

		onTearDown: function() {
			this.phoneEl.unwrap();
		}

	});

	return Footer;
});