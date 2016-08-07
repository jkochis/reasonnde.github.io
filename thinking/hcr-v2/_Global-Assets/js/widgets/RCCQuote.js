define([
    "lib/Env",
    "lib/WidgetView",
    "lib/MediaHelper",
    "lib/MediaQueries",
    "vendor/jquery.matchHeight",
    "vendor/jquery.cycle2",
    "vendor/jquery.touchSwipe.min",
    "vendor/jquery.placeholder"
],
function(
    Env,
    WidgetView,
    MediaHelper,
    MediaQueries,
    matchHeight,
    cycle,
    touchSwipe,
    jqueryPlaceholder
) {
    var cycleOpts = {
        slides: '> .injury',
        fx: 'scrollHorz',
        speed: 350,
        timeout: 6000,
        pagerTemplate: '<li></li>',
        pagerActiveClass: 'is-active'
    };
    var RCCQuote = WidgetView.extend({
        events: {
            'click .rcc-gender': 'onGenderSelect',
			'click input.rcc-age': 'onAgeSelect',
			'click .rcc-button--next': 'onGetRealCost',
			'change input.rcc-age': 'onAgeChange'
        },
        initialize: function() {
            this.setup();
            this.$(".rcc-age").placeholder();
			
            this.registerMediaHelper(RCCQuoteSmallAndAbove);
            this.registerMediaHelper(RCCQuoteXSmall);
            this.registerMediaHelper(RCCQuoteTabletLandscape);
        },
        setup: function() {
          //  $(".fieldset--gender").find(".tooltip--prompt").css("display","block");
			//$(".fieldset--gender").find(".tooltip--prompt").css("top","185px"); 
        },
		start: function(){
				//$(".fieldset--gender").find(".tooltip--prompt").css("display","none");
		},
		
        onGenderSelect: function(ev) {
			this.start();
			$(".fieldset--gender").find(".tooltip--gender").css("display","none");
            var $self = $(ev.currentTarget),
                $input = $self.find('input');
            this.$el.find('.rcc-gender').removeClass('checked');
            this.$el.find('.rcc-gender input').prop('checked', false);
            if($self.hasClass('checked')) {
                $self.removeClass('checked');
                $input.prop('checked', false);
            } else {
                $self.addClass('checked');
                $input.prop('checked', true);
            }
            return false;
        },
		
		onAgeSelect: function(ev) {
			this.start();
			$(".tooltip--age").css("display","none");
			$(".tooltip--age").css("top","285px"); 
			$(".fieldset--age").find(".tooltip--age-limitations").css("display","none");	
		},
		onAgeChange: function() {
		var $age = $(".fieldset--age").find("input").val();
				if($age > 69){
					$(".fieldset--age").find(".tooltip--age-limitations").css("display","block");
					$(".fieldset--age").find(".tooltip--age-limitations").css("top","285px"); 
				}
				else{
					$(".fieldset--age").find(".tooltip--age-limitations").css("display","none");
				}
		},
		
		onGetRealCost: function(ev) {
			this.start();
			var $self = $(ev.currentTarget)
			var $currentURL = $self.data("url") || '';
			var $illness = $self.data("illness") || '';
			var $gender  = $(".fieldset--gender").find(".checked > input").val();
			var $age = $(".fieldset--age").find("input").val();
			var $ageCheck = true;
			var $genderCheck = true;
			
			if (!$age){
				$ageCheck = false;
				$(".fieldset--age").find(".tooltip--age").css("display","block");
				$(".fieldset--age").find(".tooltip--age").css("top","285px"); 
			}
			else if ($age < 18){
				$ageCheck = false;
				$(".fieldset--age").find(".tooltip--age").css("display","block");
				$(".fieldset--age").find(".tooltip--age").css("top","285px"); 
			}else{
				$(".fieldset--age").find(".tooltip--age").css("display","none");
			}
			
			if (!$gender){
				$(".fieldset--gender").find(".tooltip--gender").css("display","block");
				$(".fieldset--gender").find(".tooltip--gender").css("top","185px"); 
				$genderCheck = false;
			}else{
				$(".fieldset--gender").find(".tooltip--gender").css("display","none");
			}
			
			if($genderCheck === true && $ageCheck === true){
				$self.attr('href', $currentURL+'#customize/'+$gender+'/'+$age+'/'+$illness+'/individual/moderate');
				window.location.href = ''+$currentURL+'#customize/'+$gender+'/'+$age+'/'+$illness+'/individual/moderate';
				return false;
			}else if ( $(window).width() < 620){
				window.location.href = ''+$currentURL+'';
				return false;
			}
				
			//console.log('#start/'+$gender+'/'+$age+'/heart-attack');
            //return false;
        },
        onResize: function() {
        },
        onTearDown: function() {
        }
    },
    {
        selector: '.w_quote--rcc',
        IE8: true
    });
    var RCCQuoteSmallAndAbove = MediaHelper.extend({
        mediaQuery: MediaQueries.HEADER_DEFAULT,
        initialize: function(options) {
        },
        onSetUp: function() {
            this.$el.find('.equals').matchHeight();
        },
        onResize: function() {
            
        },
        onTearDown: function() {
            this.$el.find('.equals').matchHeight('remove');
        }
    },
    {
        IE8:true
    });
    var RCCQuoteXSmall = MediaHelper.extend({
        mediaQuery: MediaQueries.X_SMALL,
        initialize: function(options) {
        },
        onSetUp: function() {
            var localOpts = {
                pager: this.$el.find('.pagination')
            };
            this.$el.find('.slider').cycle($.extend(cycleOpts, localOpts));   
        },
        onResize: function() {
            
        },
        onTearDown: function() {
            this.$el.find('.slider').cycle('destroy');
        }
    });
    var RCCQuoteTabletLandscape = MediaHelper.extend({
        mediaQuery: MediaQueries.TABLET_LANDSCAPE,
        initialize: function(options) {
        },
        onSetUp: function() {
            var localOpts = {
                pager: this.$el.find('.pagination')
            };
            this.$el.find('.slider').cycle($.extend(cycleOpts, localOpts));
        },
        onResize: function() {
            
        },
        onTearDown: function() {
            this.$el.find('.slider').cycle('destroy');
        }
    });
    return RCCQuote;
});