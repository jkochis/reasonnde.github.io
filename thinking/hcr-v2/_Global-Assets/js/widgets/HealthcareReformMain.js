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

	var HealthcareReformMain = WidgetView.extend({

		initialize: function() {
			this.setup();

			this.registerMediaHelper(HealthcareReformMainSmallAndAbove);

			// console.log('Helpful Links');
		},

		setup: function() {
			this.$col_content = this.$el.find('.col_content');

			this.$el.find('.w_col').css('opacity',1);

			$(window)
				.on('resize.w_healthcare_reform_main', $.proxy(this.onResize, this))
				.trigger('resize.w_healthcare_reform_main')
		},

		onResize: function() {
			this.$col_content.css('height','auto');
		},

		onTearDown: function() {
			$(window).off('resize.w_healthcare_reform_main');
		}

	},
	{
		selector: '.w_healthcare_reform_main'
	});

	var HealthcareReformMainSmallAndAbove = MediaHelper.extend({

		mediaQuery: MediaQueries.SMALL_AND_ABOVE,
		

		initialize: function(options) {

		},

		onSetUp: function() {
			this.$col_content = this.$el.find('.col_content');
			this.rowNum = this.$col_content.length;
			//this.$col_content.matchHeight();

			$(window)
				.on('resize.w_healthcare_reform_main.cols', $.proxy(this.onResize, this))
				.trigger('resize.w_healthcare_reform_main.cols');

			this.$col_content.each( function(i){
				var arrow = $(this).find('.icon').eq(0);

				$(this).on(Env.IOS || Env.ANDROID ? "touchstart" : "mouseenter", function(){
					TweenMax.fromTo(arrow, 0.3, {'left': -60}, {'left': -30, ease: "Quad.easeOut"});
				}).on(Env.IOS || Env.ANDROID ? "touchend touchcancel" : "mouseleave", function(){
					TweenMax.fromTo(arrow, 0.3, {'left': -30}, {'left': 0, ease: "Quad.easeOut", onComplete: function(){
						TweenMax.to(arrow, 0, {'left': 0});
					}});
				});
			})

		},

		onResize: function() {

			var _tallestHeight = 0,
				that = this;

			this.$col_content.css('height','auto');
			this.$el.find('.w_col').each(function(i) {
				var col_content = $(this).find('.col_content');
				if(col_content.height() > _tallestHeight){
					_tallestHeight = col_content.height();
				}
				if(i == that.rowNum-1){
					that.$col_content.height(_tallestHeight);
				}
			});

			this.$el.find('.w_col').css('opacity',1);

		},

		onTearDown: function() {
			$(window).off('resize.w_healthcare_reform_main.cols');
		}

	},
	{
		IE8: true
	});

	return HealthcareReformMain;
});