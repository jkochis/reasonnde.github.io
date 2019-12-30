/*
	Malin
*/

define([
	'backbone',
	"lib/WidgetView",
	"lib/MediaHelper",
	"lib/MediaQueries",
	"lib/Env"
],
function(
	Backbone,
	WidgetView,
	MediaHelper,
	MediaQueries,
	Env
) {

	var Policies = WidgetView.extend({

		initialize : function() {
			// console.log("POLICIES")
			this.setup();
		},

		setup: function() {

			this.ENV_TOUCH = Env.IOS || Env.ANDROID || Env.WP || Env.SURFACE;

			if(this.ENV_TOUCH) {
				this.$('.policy-item').addClass('no-hover');
			}
			var link = window.location.href.split('#');
			if(link[1]) {				
				var $current = this.$el.find('#'+link[1].replace('/', ''));
				if($current.length > 0) {
					$current.addClass('is-current');
				} else {
					this.$el.find('.policies-section').eq(0).addClass('is-current');
				}
			} else {
				this.$el.find('.policies-section').eq(0).addClass('is-current');
			}

			this.$('a').on('click', $.proxy(this.onClickItem, this));

			$('.w_tabs-menu').on('tabsMenuClicked', $.proxy(this.updateCurrent, this));

			var currentSection = this.$el.find('.policies-section.is-current');
			if(Env.IE8) {
				var numSections = this.$el.find('.policies-section').length;
				$('.policies-sections-container').css({'width': (100*numSections) + '%'})
				$('.policies-section').css({'width': ($('.policies-sections-container').width()/numSections)});
				$('.policies-sections-container').css({'margin-left': -currentSection.position().left});
			}

			$(window).on("scroll", $.proxy(this.onScrollWindow, this));

			this.registerMediaHelper(PoliciesSmallAndAbove);
			this.registerMediaHelper(PoliciesXSmall);

		},

		updateCurrent : function(e) {
			// console.log('updateCurrent Policies', e.id);
			
			var oldSection = $('.policies-section.is-current');
			var newSection = $('.policies-section[id='+e.id+']');

			TweenMax.to($('.policies-sections-container'), 0.5, {marginLeft: -newSection.position().left, ease: "Quad.easeInOut", onComplete: function(){
				oldSection.removeClass('is-current');
				newSection.addClass('is-current');
			}});
		},

		onClickItem : function(e) {
			//e.preventDefault();
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
		selector: '.w_policies'
	});

	var PoliciesSmallAndAbove = MediaHelper.extend({

		mediaQuery: MediaQueries.SMALL_AND_ABOVE,

		initialize: function(options) {
			this.$current = this.$el.find('.policies-section.is-current');
		},

		onSetUp: function() {
			// console.log("onSetUp SMALL")
			this.ENV_TOUCH = Env.IOS || Env.ANDROID || Env.WP || Env.SURFACE;

			if(!this.ENV_TOUCH) {
				$('.policy-item').on('mouseenter', this.onAddFilter);
				$('.policy-item').on('mouseleave', this.onRemoveFilter);
			}

			if(Env.IE9_PLUS || Env.NOT_IE) {

//				console.log('HIGHER THAN IE 9', Env.IE9_PLUS)
				$('.policy-item').each( function(){
					var holder = $(this).find('.img-holder').eq(0);
					var img = $(this).find('img').eq(0);
					var src = img.attr('src');
					
					img.remove();
					var filter = '<svg><filter id="svgBlur"><feGaussianBlur id="thblurrr" in="SourceGraphic" stdDeviation="3"></feGaussianBlur></filter><image xlink:href="'+ src +'" width="280px" height="190px"></image></svg>'
					holder.html(filter);
				});
			}
			
			$(window)
				.on('resize.w_policies', $.proxy(this.onResizeSmallAndAbove, this))
				.trigger('resize.w_policies');
		},

		onAddFilter: function(e) {			
			if(Env.IE9_PLUS || Env.NOT_IE) {
				$(this).find('image').eq(0).attr("filter", "url(#svgBlur)");
			}
		},

		onRemoveFilter: function(e) {
			if(Env.IE9_PLUS || Env.NOT_IE) {
				$(this).find('image').eq(0).removeAttr("filter");
			}
		},

		onResizeSmallAndAbove: function() {

			// console.log('RESIZE SMALL');
			var numSections = this.$el.find('.policies-section').length;
			$('.policies-sections-container').css({'width': (100*numSections) + '%'})
			$('.policies-section').css({'width': ($('.policies-sections-container').width()/numSections)});

			var windowWidth = $(window).innerWidth();
			var itemWidth = $('.policy-item').width() + 20;
	        var numItems = Math.floor(windowWidth/itemWidth);
	        if(this.$el.hasClass('has-copy')) { 
	        	if(numItems > 2) {
	        		$('.copy-holder').show();
	        		numItems -= 1;
	        	} else {
	        		$('.copy-holder').hide();
	        	}	
	        }
	        var maxItems = (this.$el.hasClass('has-copy')) ? 4 : 5;

	        /*$('.items-holder').each( function(){
	        	if( numItems < maxItems) {
	        		$(this).css('width', itemWidth * numItems);
	        	}
	        });*/
			
			if( itemWidth * numItems < 1520){
			$('.items-holder').css('width', itemWidth * numItems);
			}else {
			$('.items-holder').css('width', '100%');
			
			}
			
			
	        this.$current = this.$el.find('.policies-section.is-current');
			$('.policies-sections-container').css({'margin-left': -this.$current.position().left});
	        $('.policies-sections-container').fadeTo( "fast", 1 );
		},

		onTearDown: function() {
			// console.log("onTearDown SMALL")
			$('.policy-item').off('mouseenter', $.proxy(this.onAddFilter, this));
			$('.policy-item').off('mouseleave', $.proxy(this.onRemoveFilter, this));
			$(window).off('resize.w_policies');
		}
	},
	{
		 IE8: true
	});

	var PoliciesXSmall = MediaHelper.extend({

		mediaQuery: MediaQueries.X_SMALL,

		initialize: function(options) {
			this.$current = this.$el.find('.policies-section.is-current');
		},

		onSetUp: function() {
			// console.log("onSetUp X-SMALL")

			if(Env.IE9_PLUS || Env.NOT_IE) {
				$('.policy-item').each( function(){
					var holder = $(this).find('.img-holder').eq(0);
					var filter = $(this).find('svg');

					if(filter.length > 0) {
						var img = '<img src="' + $(this).find('image').attr('xlink:href') + '" height="100px" />'
						holder.empty();
						holder.append(img);
					}
				});
			}

			$(window)
				.on('resize.w_policies', $.proxy(this.onResizeXSmall, this))
				.trigger('resize.w_policies')
		},

		onResizeXSmall: function() {

			var numSections = this.$el.find('.policies-section').length;
			$('.policies-sections-container').css({'width': (100*numSections) + '%'})
			$('.policies-section').css({'width': ($('.policies-sections-container').width()/numSections)});

			// console.log("RESIZE X SMALL")
	        $('.items-holder').each( function(){	
	        	$(this).css('width', '100%');
	        });

	        this.$current = this.$el.find('.policies-section.is-current');
	        $('.policies-sections-container').css({'margin-left': -this.$current.position().left});
	        $('.policies-sections-container').fadeTo( "fast", 1 );
		},

		onTearDown: function() {
			// console.log("onTearDown X-SMALL")
			$(window).off('resize.w_policies');
		}

	});


	return Policies;
});