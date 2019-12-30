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

	var SecondaryPage = WidgetView.extend({

		initialize : function() {

			this.$el.find('[data-bg]').each( function(index) {
				var bgUrl = $(this).attr('data-bg');
				if(bgUrl) {
					$(this).css({
						'background-image': 'url(' + bgUrl + ')'
					});
				}
			});

			/* $('blockquote').each(function(){
				var text = $(this).html().split(' '),
					len = text.length,
					result = [];

				for( var i = 0; i < len; i++ ) {

					if(i<4) {
						result[i] = '<span class="is-darker">' + text[i] + '</span>';
					} else {
						result[i] = text[i];
					}

				}
				$(this).html(result.join(' '));
			}); */

		}
	},
	{
		selector: '.w_page'
	});

	return SecondaryPage;
});