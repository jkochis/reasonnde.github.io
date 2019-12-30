define([
	"lib/Env",
	"lib/WidgetView",
	"lib/MediaHelper",
	"lib/MediaQueries",
	"vendor/jquery.matchHeight"
],
function(
	Env,
	WidgetView,
	MediaHelper,
	MediaQueries,
	matchHeight
) {

	var HealthcareReformNews = WidgetView.extend({

		initialize: function() {
			this.setup();

			this.registerMediaHelper(HealthcareReformNewsSmallAndAbove);

			// console.log('Helpful Links');
		},

		setup: function() {
			this.$col_content = this.$el.find('.hrn-col');
			$(window)
				.on('resize.w_healthcare_reform_news', $.proxy(this.onResize, this))
				.trigger('resize.w_healthcare_reform_news')
		},

		onResize: function() {
			this.$col_content.css('height','auto');
			this.$col_content.find('h6').css('height','auto');
			this.$col_content.find('p').css('height','auto');
		},

		onTearDown: function() {
			$(window).off('resize.w_healthcare_reform_news');
		}

	},
	{
		selector: '.w_healthcare_reform_news'
	});

	var HealthcareReformNewsSmallAndAbove = MediaHelper.extend({

		mediaQuery: MediaQueries.SMALL_AND_ABOVE,

		initialize: function(options) {

		},

		onSetUp: function() {
			this.$col_content = this.$el.find('.hrn-col');
			this.rowNum = this.$col_content.length;
			//this.$col_content.matchHeight();

			$(window)
				.on('resize.w_healthcare_reform_news.hrn-col', $.proxy(this.onResize, this))
				.trigger('resize.w_healthcare_reform_news.hrn-col')
		},

		onResize: function() {

			var _tallestH6Height = 0,
				_tallestPHeight = 0,
				that = this;

			this.$col_content.css('height','auto');
			this.$col_content.each(function(i) {
				var h6 = $(this).find('h6');
				var p = $(this).find('p.is-large');
				if(h6.height() > _tallestH6Height){
					_tallestH6Height = h6.height();
				}
				if(p.height() > _tallestPHeight){
					_tallestPHeight = p.height();
				}
				if(i == that.rowNum-1){
					that.$col_content.find('h6').height(_tallestH6Height);
					that.$col_content.find('p.is-large').height(_tallestPHeight);
				}
			});

		},

		onTearDown: function() {
			$(window).off('resize.w_healthcare_reform_news.hrn-col');
		}

	},
	{
		IE8:true
	}
	);

	return HealthcareReformNews;
});