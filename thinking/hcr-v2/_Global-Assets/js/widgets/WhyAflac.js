define([
	"lib/WidgetView"
],
function(
	WidgetView
) {

	var WhyAflac = WidgetView.extend({

		initialize: function() {
			this.setup();
		},

		setup: function() {

			var link = window.location.href.split('#');
			if(link[1]) {				
				var $current = this.$el.find('#'+link[1].replace('/', ''));
				if($current.length > 0) {
					$current.addClass('is-current');
				} else {
					this.$el.find('.whyaflac-section').eq(0).addClass('is-current');
				}
			} else {
				this.$el.find('.whyaflac-section').eq(0).addClass('is-current');
			}

			$('.w_tabs-menu').on('tabsMenuClicked', $.proxy(this.updateCurrent, this));
			$(window).on('resize.w_whyaflac', $.proxy(this.onResize, this)).trigger('resize.w_whyaflac');
			$(window).on("scroll", $.proxy(this.onScrollWindow, this));
		},

		updateCurrent : function(e) {
			
			var oldSection = $('.whyaflac-section.is-current');
			var newSection = $('.whyaflac-section[id='+e.id+']');

			TweenMax.to($('.whyaflac-sections-container'), 0.5, {marginLeft: -newSection.position().left, ease: "Quad.easeInOut", onComplete: function(){
				oldSection.removeClass('is-current');
				newSection.addClass('is-current');
			}});
		},

		onResize: function() {

	        var current = $('.whyaflac-section.is-current');
	        $('.whyaflac-sections-container').css({'margin-left': -current.position().left});

	        if($('.w_nav-bar').hasClass('is-sticky')) {
	        	this.$el.addClass('has-padding');
	        } else {
	        	this.$el.removeClass('has-padding');
	        }
		},

		onScrollWindow: function() {

			if( (this.$el.offset().top - $('.w_nav-bar').height()) <= $(window).scrollTop()) {
	        	this.$el.addClass('has-padding');
	        } else {
	        	this.$el.removeClass('has-padding');
	        	$('.w_tabs-menu').removeClass('is-sticky');
	        }
		}

	},
	{
		selector: '.w_whyaflac'
	});

	return WhyAflac;
});