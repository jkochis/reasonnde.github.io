define('jquery', [], function () {
    return jQuery;
});
require([
	"lib/WidgetView",
	"lib/Env",
	"query-dom-components"
],
function(
	WidgetView,
	Env,
	queryDom
) {
	var AnchorTabsMenu = WidgetView.extend({
		initialize : function(options) {
		    $el = options.el;
				dom = {
					anchor: $('.anchor-w_tabs-menu ul li a'),
					anchorNav: $('.anchor-w_tabs-menu')
				};
			this.setup();
		},
		setup: function() {
			
			this.$ul = dom.anchorNav.find('ul').eq(0);
			this.ENV_TOUCH = Env.IOS || Env.ANDROID || Env.WP || Env.SURFACE;
			this.pos = dom.anchorNav.offset().top - $('.w_nav-bar').height();	
			//this.pos = $('.w_page_static_header').height() + 65;	
			//console.log("1- " + this.pos);
			
			var link = window.location.href.split('#');
			if(link[1]) {
				var $current = dom.anchorNav.find('#'+link[1].replace('/', ''));
				
				if($current.length > 0) {
					$current.parent().addClass('is-active');
				} else {
					var $first = dom.anchorNav.find('a').eq(0);
					$first.parent().addClass('is-active');
				}
			} else {
				var $first = dom.anchorNav.find('a').eq(0);
				$first.parent().addClass('is-active');
			}		
			
			var urlhash = window.location.hash;
			$urlhash = $(urlhash);
			if ($(urlhash).length > 0) {
				var currElement = dom.anchor.filter(function() {return this.hash == location.hash;})
				if(this.ENV_TOUCH) {
					dom.anchorNav.find('li').removeClass('is-active');	
					$(currElement).parent().addClass('is-active');
				}
				setTimeout(function(){
					//console.log($urlhash);
					$('html, body').animate({ scrollTop: $urlhash.offset().top - 131}, 800); 
				}, 500);
			}	
			
			$(window).on("scroll", $.proxy(this.onScrollWindow, this));
			$(window).on('resize.anchor-w_tabs-menu', $.proxy(this.onResize, this));
			
			this.onScrollWindow();
			this.onResize();
			if(Env.IE8) {
				var arrow = $('<div class="ie-arrow">');
				this.$("li").append(arrow);
			}
			var self = this;
			if(this.ENV_TOUCH) {
				dom.anchorNav.swipe({
					swipe: function(event, direction, distance, duration, fingerCount, fingerData) {
						self.onSwipe(event, direction, self);
					},
					threshold: 30,
					excludedElements:"button, input, select, textarea, .noSwipe",
					context: self
				});
			}
			
			this.$a = dom.anchorNav.find("a");
			this.$a.on("click touchend", $.proxy(this.onClickMenuItem, this));
			
			dom.anchorNav.find("ul").show();
		},
		onSwipe : function(event, direction, context) {
			
			// console.log('context', context)
			var numSections = dom.anchorNav.find("li").length;
			var newIndex = -1
			dom.anchorNav.find("li").each(function(index){
				if($(this).hasClass('is-active')) {
					 //console.log('index, this.numSections', index, numSections);
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
				dom.anchorNav.find("li").removeClass('is-active');
				var newActive = dom.anchorNav.find("li").eq(newIndex);
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
		
			var gaClickLabel = $(current).text();
			if (window.utag) {
				utag.link({_ga_category: 'navigation',_ga_action: 'sticky nav',_ga_label: gaClickLabel });
			}
		
			var id = $(current).attr('href');
			
			if(this.ENV_TOUCH) {
				dom.anchorNav.find("li.is-active").removeClass('is-active');
				$(current).parent().addClass('is-active');
				var target = dom.anchorNav.find('li.is-active a').attr('href');
			}
			$('html, body').animate({ scrollTop: $(id).offset().top - 130}, 800);
			
			//this.$el.trigger({
			//	type: "tabsMenuClicked",
			//	id: id
			//});
			this.onResize();
		},
		onResize: function() {
		//this.pos = $('.w_page_static_header').height() + 65;	
		//console.log("2- " + this.pos);
			
			var totalWidth = 0
			
			dom.anchorNav.find('li').each(function(){
	        	totalWidth += $(this).width() + 1;
	        });
	        dom.anchorNav.find('ul').css({
		        'width': totalWidth + 'px',
		    });
				if(dom.anchorNav.find("ul").width() > $(window).innerWidth() || $(window).innerWidth() < 605) {
					// console.log('is bigger than screen');
					this.tooBig = true;
					//$(this.$el).swipe("enable");
					dom.anchorNav.find('ul').addClass('is-bigger-than-screen');
					this.moveMenu();
				} else {
					this.tooBig = false;
					//$(this.$el).swipe("disable");
					dom.anchorNav.find('ul').removeClass('is-bigger-than-screen').css('margin-left', 0);
			}
	        //dom.anchorNav.find('ul').fadeTo( "fast", 1 );
			
		},
		moveMenu : function() {
			
			var margin = 0;
			var isDone = false;
			for (var i = 0; i < dom.anchorNav.find('li').length; i++) {
				var item = dom.anchorNav.find('li').eq(i);
				if(item.hasClass('is-active')) {
					margin += (item.width()*0.5);
					isDone = true;
				} else {
					if(!isDone) {
						margin += item.width();
					}
				}
			};
			dom.anchorNav.find('ul').css('margin-left', '-' + Math.floor(margin) + 'px');
		},
		
		onScrollWindow: function() {
				var item1 = dom.anchorNav.find('a:first-of-type').attr('href');
				var anchor_vis = $('.anchor-w_tabs-menu').css('display');
				
					if (!(anchor_vis == 'none')) {
						if(this.pos <= $(window).scrollTop()) {
							dom.anchorNav.addClass('is-sticky');			
							$(item1).css('margin-top', '66px');
						} else {
							$(item1).css('margin-top', '0');
							dom.anchorNav.removeClass('is-sticky');
						}		
					}
			if(!this.ENV_TOUCH) {
					// Empty anchorTargetsOffsets
				anchorTargetsOffsets = [];
				for (var i = 0; i < dom.anchor.length; i++) {
					var anchor = dom.anchor.eq(i);
					var target = $(anchor.attr('href'));
					if(target.length > 0) {
						anchorTargetsOffsets.push(target.offset().top);
					}
				}
				var scrollToTop = $(window).scrollTop();
				var scrollToBottom = $(document).height() - $(window).height() - 3;
				
				//console.log(scrollToTop);
				//console.log(scrollToBottom);
				
				if(anchorTargetsOffsets) {
					for (var i = 0; i < anchorTargetsOffsets.length; i++) {
						var offset = anchorTargetsOffsets[i];
						var target = dom.anchorNav.find('li').eq(i);
						var lastTarget = dom.anchorNav.find('li:last');
						
						if(scrollToTop >= offset - dom.anchorNav.height() - 66) {
							var activeEl = dom.anchorNav.find('li.is-active');
							if(activeEl.hasClass('is-active')) {
								activeEl.removeClass('is-active');
								this.onResize();
							}
							if(!target.hasClass('is-active')) {
								target.addClass('is-active');
								this.onResize();
							}
							if (scrollToTop >= scrollToBottom) {
								target.removeClass('is-active');
								lastTarget.addClass('is-active');
								//console.log('bottom of page');
							}
						//} else {
						//if(target.hasClass('is-active')) {
						//  target.removeClass('is-active');  
						//console.log('target removing class')							  
						//	this.moveMenu();
						//}
						}
					}
				}
			}		  
		}
	},
	{
		selector: '.anchor-w_tabs-menu'
	});
	var anchorTabNavInit = {
		createAnchorTabNav: function(options) {
			var init;
					init = new AnchorTabsMenu(options);
			return init;
		}
	};
	anchorTabNavInit.createAnchorTabNav();
	return AnchorTabsMenu;
});