/*
	Malin
*/

define([
	"lib/WidgetView",
	"lib/Env"
],
function(
	WidgetView,
	Env
) {

	var TabsMenu = WidgetView.extend({

		initialize : function() {
			this.setup();
		},

		setup: function() {

			this.$a = this.$("a");
			this.$ul = this.$el.find('ul').eq(0);
			this.ENV_TOUCH = Env.IOS || Env.ANDROID || Env.WP || Env.SURFACE;

			var link = window.location.href.split('#');

			if(link[1]) {
				var $current = this.$el.find('#'+link[1].replace('/', ''));
				
				if($current.length > 0) {
					$current.parent().addClass('is-active');
				} else {
					var $first = this.$el.find('a').eq(0);
					$first.parent().addClass('is-active');
					window.location.hash = '/' + $first.attr('id');
				}
			} else {
				var $first = this.$el.find('a').eq(0);
				$first.parent().addClass('is-active');
				window.location.hash = '/' + $first.attr('id');
			}

			$(window).on("scroll", $.proxy(this.onScrollWindow, this));
			$(window).on('resize.w_tabs-menu', $.proxy(this.onResize, this));
			
			this.onScrollWindow();
			this.onResize();

			if(Env.IE8) {
				var arrow = $('<div class="ie-arrow">');
				this.$("li").append(arrow);
			}

			var self = this;

			if(this.ENV_TOUCH) {

			//	console.log('is touch')
				$(this.$el).swipe({
					swipe: function(event, direction, distance, duration, fingerCount, fingerData) {
						self.onSwipe(event, direction, self);
					},
					threshold: 30,
					excludedElements:"button, input, select, textarea, .noSwipe",
					context: self
				});
			}

			this.$a = this.$("a");
			this.$a.on("click", $.proxy(this.onClickMenuItem, this));

			this.$("ul").show();
		},

		onSwipe : function(event, direction, context) {
			
			// console.log('context', context)

			var numSections = context.$('li').length;
			var newIndex = -1
			context.$('li').each(function(index){
				if($(this).hasClass('is-active')) {
					
					// console.log('index, this.numSections', index, numSections);
					switch(direction) {
						case 'left':
							// console.log('LEFT');
							if(index < numSections-1) {
								// console.log('not last so go left')
								newIndex = index+1;
							}
							break;
						case 'right':
							// console.log('RIGHT');
							if(index > 0) {
								// console.log('not first so go right')
								newIndex = index-1;
							}
							break;
					}
				}
			});
			// console.log('newIndex', newIndex)
			if(newIndex >= 0) {
				context.$('li').removeClass('is-active');
				var newActive = context.$('li').eq(newIndex);
				// console.log('newActive', newActive)
				newActive.addClass('is-active');
				var clickTarget = newActive.find('a').eq(0);
				context.updateCurrent(clickTarget);
			} else {
				return;
			}
						
		},

		onClickMenuItem : function(e) {
			e.preventDefault();
			this.updateCurrent(e.target);
		},

		updateCurrent : function(current) {

			var id = $(current).attr('id');
			window.location.hash = '/' + id;

			this.$("li").removeClass('is-active');
			$(current).parent().addClass('is-active');

			this.$el.trigger({
				type: "tabsMenuClicked",
				id: id
			});

			this.onResize();
		},

		onResize: function() {
			
			var totalWidth = 0
			this.$el.find('li').each(function(){
	        	totalWidth += $(this).width() + 1;
	        });

	        this.$ul.css({
		        'width': totalWidth + 'px',
		    });

		    // console.log('this.$ul.width()', this.$ul.width(), ', $(window).innerWidth()', $(window).innerWidth());

	        if(this.$ul.width() > $(window).innerWidth() || $(window).innerWidth() < 605) {
	        	// console.log('is bigger than screen');
	        	this.tooBig = true;
	        	$(this.$el).swipe("enable");
	        	this.$ul.addClass('is-bigger-than-screen');
	        	this.moveMenu();
	        } else {
	        	this.tooBig = false;
	        	$(this.$el).swipe("disable");
				this.$ul.removeClass('is-bigger-than-screen').css('margin-left', 0);
	        }

	        this.$ul.fadeTo( "fast", 1 );

		},

		moveMenu : function() {

			// console.log('moveMenu')
			
			var margin = 0;
			var isDone = false;
			for (var i = 0; i < this.$('li').length; i++) {
				var item = this.$('li').eq(i);
				if(item.hasClass('is-active')) {
					margin += (item.width()*0.5);
					isDone = true;
				} else {
					if(!isDone) {
						margin += item.width();
					}
				}
			};
			this.$ul.css('margin-left', '-' + Math.floor(margin) + 'px');
		},

		onScrollWindow: function() {

			if( (this.$el.offset().top - $('.w_nav-bar').height()) <= $(window).scrollTop()) {
				this.$el.addClass('is-sticky');
				$('.w_policies').addClass('has-padding');
			} else {
				this.$el.removeClass('is-sticky');
			}
		}
		
	},
	{
		selector: '.w_tabs-menu'
	});


	return TabsMenu;
});