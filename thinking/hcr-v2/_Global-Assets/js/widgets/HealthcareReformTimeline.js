/**
 * Created by roel.kok on 4/25/14.
 */

define([
    "underscore",
    "lib/Env",
    "lib/WidgetView",
    "lib/MediaHelper",
    "lib/MediaQueries"
],
function(
    _,
    Env,
    WidgetView,
    MediaHelper,
    MediaQueries
) {

    var POINTER_START_EVENT = "MSPointerOver MSPointerDown pointerover pointerdown";
    var POINTER_END_EVENT = "MSPointerUp MSPointerOut pointerup pointerout pointerleave";

    // Please postfix your class names with 'Widget' or at least don't make it to generic like 'Video'
    var HealthcareReformTimeline = WidgetView.extend({

        // Backbone style constructor
        initialize: function(options) {

            this.registerMediaHelper(SmallMediaHelper);
        }

    },
    // Static properties (second argument to 'extend' method)
    {
        // The css selector to look up the widget DOM node
        selector: ".w_healthcare_reform_timeline"
    });


    var SmallMediaHelper = MediaHelper.extend({

        mediaQuery: MediaQueries.SMALL_AND_ABOVE,

        initialize: function(options) {
            this.setup();
            this.setupCarousels();
        },

        setup: function(){

            var that = this;
            var navbar = $('.w_nav-bar');
            this._scroller = this.$('.hrtl-content-scroller');
            this.active = '';
            this._popup = this.$('.hrtl-timeline-popup');
            this._popupSource = this.$('.hrtl-timeline-popup-source');
            this._rolloverDots = this.$('.hrtl-timeline-dot-rollover');
            this.selectedDot;

            this.ENV_TOUCH = Env.IOS || Env.ANDROID || Env.WP || Env.SURFACE;

            if(navbar.length) {
                navbarHeight = navbar.height();
            } else {
                navbarHeight = 0;
            }

            //mouseenter dot
            this.$('.hrtl-timeline-year-dot').on(POINTER_START_EVENT + " mouseenter", function(event){
                
                var dot = $(this);
                if(event.originalEvent.pointerType === 2 || event.originalEvent.pointerType === 3 || event.originalEvent.pointerType === "touch" || event.originalEvent.pointerType === "pen") {
                    that.$('.hrtl-timeline-year-dot').off('mouseenter mouseleave');
                    dot.trigger('click');
                } else {
                      //hides dots rollover
                    that._rolloverDots.hide();
                    $(this).find('.hrtl-timeline-dot-rollover').css('display','inline');    
                    that.showPopup(this);
                }
            })
            
            //mouseleave dot 
            this._popup.on(POINTER_START_EVENT + " mouseleave", function(event){

                if(event.originalEvent.pointerType === 2 || event.originalEvent.pointerType === 3 || event.originalEvent.pointerType === "touch" || event.originalEvent.pointerType === "pen") {
                    return;
                } 
                //close popup
                that._rolloverDots.hide();
                that.closePopup();
            });

            //Click on dot
            this.$('.hrtl-timeline-year-dot').on('click',function(){

                that.$('.hrtl-timeline-year-dot.active').removeClass('active');
                that._popupSource.hide();

                $(this).addClass('active');
                that.$el.addClass('expanded');
                TweenMax.to($('body, html'),
                    0.9,
                    {'scrollTop': $('.hrtl-timeline-years-bar').offset().top - (navbarHeight+10), ease: Expo.easeInOut}
                );

                $('.hrtl-expanded-content-container').removeClass('active');
                var _selectedID = that.$('.hrtl-'+$(this).data('id'));
                _selectedID.addClass('active');

                if( that.ENV_TOUCH) {
                    that.showPopup(this);
                }
                //animates timeline
                //TweenMax.to(that._scroller,0.5,{left:-_selectedID.position().left,ease:Quart.easeInOut});
            })

            //Click on View Source
            this.$('.hrtl-expanded-content-view-source').on("click",function(e){
                e.preventDefault();
                $(this).parent().find('.hrtl-timeline-popup-source').show();
                e.stopPropagation();
                that.$el.on("mouseleave", function(){
                    that._popupSource.hide();
                    that.$el.off("mouseleave");
                });

                that.closePopup();
            })

            //Click on Close View Source
            this.$('.hrtl-timeline-popup-cta').on("click",function(e){
                e.preventDefault();
                that._popupSource.hide();
            })

            //click anywhere to close popup
            this.$el.on( "click", function(e){
                
                if($('.hrtl-timeline-popup').has(e.target).length < 1 && $('.hrtl-timeline-year-dot').has(e.target).length < 1 && !$(e.target).hasClass('hrtl-timeline-year-dot') ) {
                    that._rolloverDots.hide();
                    that.closePopup();
                }

                if(that._popupSource.is(":visible") && that._popupSource.has(e.target).length < 1) {
                    that._popupSource.hide();
                }

                
            })

            this.$('.hrtl-expanded-close-container').on( this.ENV_TOUCH ? "touchstart" : "click",$.proxy(this.closeContainer, this));

            $(window)
                .on('resize.w_healthcare_reform_timeline', $.proxy(this.onResize, this))
                .trigger('resize.w_healthcare_reform_timeline');

            //checks if scroll into view and start intro animation
            $(window).on('scroll.w_healthcare_reform_timeline',$.proxy(this.isScrolledIntoView, this.$el)).trigger('scroll.w_healthcare_reform_timeline');

            if(this.ENV_TOUCH) {
                $(this.$('.hrtl-expanded-content-container')).swipe({
                    swipeLeft: function(event, direction, distance, duration, fingerCount, fingerData) {
                        that.onSwipe(event, direction, that);
                    },
                    swipeRight: function(event, direction, distance, duration, fingerCount, fingerData) {
                        that.onSwipe(event, direction, that);
                    },
                    threshold: 30
                });
            }

        },

        onSwipe : function(event, direction, context) {
            // alert('swipeeee');
            var that = context;
            var numSections = that.$('.hrtl-expanded-content-container').length;
            var newIndex = -1

            that.$('.hrtl-expanded-content-container').each(function(index){
                if($(this).hasClass('active')) {
                    switch(direction) {
                        case 'left':
                            if(index < numSections-1) {
                                newIndex = index+1;
                            }
                            break;
                        case 'right':
                            if(index > 0) {
                                newIndex = index-1;
                            }
                            break;
                    }
                }
            });

            if(newIndex >= 0) {
                $('.hrtl-expanded-content-container').removeClass('active');
                var _selectedID = that.$('.hrtl-expanded-content-container').eq(newIndex);
                _selectedID.addClass('active');
               
                var dot = that.$('.hrtl-timeline-year-dot').eq(newIndex);
                that.$('.hrtl-timeline-year-dot.active').removeClass('active');
                that._popupSource.hide();
                $(dot).addClass('active');
                that.showPopup(dot);
            } else {
                return;
            }
                        
        },


        closePopup: function() {
            var that = this;
            TweenMax.killTweensOf(that._popup);
            TweenMax.to(that._popup,0.3,{opacity:0,onComplete:function(){
                that._popup.hide();
            }});
            that._popup.off("click");
        },

        showPopup: function(target) {
            var that = this;
            var _selectedID = this.$('.hrtl-'+$(target).data('id')),
            _leftOffset = 100;

            this._popup.removeClass('first-bubble');
            this._popup.removeClass('last-bubble');

            if($(target).data('id') == '2010-0'){
                _leftOffset = 5;
                this._popup.addClass('first-bubble');
            }else if($(target).data('id') == '2015-0' || $(target).data('id') == '2016-0' || $(target).data('id') == '2018-0'){
                _leftOffset = 190;
                this._popup.addClass('last-bubble');
            }

            this.selectedDot = $(target);

            //sets popup position and content
            this._popup.find('.hrtl-timeline-popup-date').html(_selectedID.find('h3').html());
            this._popup.find('.hrtl-timeline-popup-copy').html(_selectedID.find('h2').html());
            this._popup.css('left',$(target).offset().left-_leftOffset-$('.hrtl-timeline').offset().left);
            this._popup.css('bottom',78);
            
            //animate in popup
            TweenMax.killTweensOf(this._popup);
            this._popup.show();
            TweenMax.to(this._popup,0.3,{opacity:1});

            this._popup.on("click",function(){
                that.selectedDot.trigger('click');
            })
        },
        

        onResize: function(){

            var _windowWidth = $(window).width();

            //force centralise content
            if ( _windowWidth < 1220) {
                $('.hrtl-timeline-container').css('margin-left',(_windowWidth-1280)/2);
                $('.hrtl-expanded-container').css('margin-left',(_windowWidth-1280)/2);
            }else{
                $('.hrtl-timeline-container').removeAttr( 'style' );
                $('.hrtl-expanded-container').removeAttr( 'style' );
            }
        },
        setupCarousels: function(){
            this.$('.hrtl-expanded-content').each(function(i){
                var _carouselItems = $(this).find('.hrtl-expanded-content-carousel-item');
                var _carouselTotal = _carouselItems.length;
                var _carouselCurrent = 0;
                var _buttons = $(this).find('.hrtl-expanded-prev-next-btns');
                var _parent = $(this);
                var _nextPrevCount = $(this).find('.hrtl-expanded-prev-next-count');

                //setup data variables on div
                _parent.data('total',_carouselTotal);
                _parent.data('current',_carouselCurrent);

                //hide next/prev buttons if there's only 1 carousel item
                if(_carouselTotal == 1){
                    _buttons.hide();
                }else{
                    _nextPrevCount.html( (_carouselCurrent+1) + '/' + _carouselTotal);
                }

                //setup next/prev buttons
                _buttons.find('.hrtl-expanded-next-btn').on('click', function(event) {
                    event.preventDefault();
                    //remove active
                    _parent.find('.hrtl-expanded-content-carousel-item.active').removeClass('active');
                    //add active
                    if(_carouselCurrent == _carouselTotal-1){
                        _carouselCurrent = 0;
                    }else{
                        _carouselCurrent += 1;
                    }
                    _parent.data('current',_carouselCurrent);
                    $(_carouselItems[_carouselCurrent]).addClass('active');

                    _nextPrevCount.html( (_carouselCurrent+1) + '/' + _carouselTotal);
                    $('.hrtl-timeline-popup-source').hide();

                });
                _buttons.find('.hrtl-expanded-prev-btn').on('click', function(event) {
                    event.preventDefault();
                    //remove active
                    _parent.find('.hrtl-expanded-content-carousel-item.active').removeClass('active');
                    //add active
                    if(_carouselCurrent == 0){
                        _carouselCurrent = _carouselTotal-1;
                    }else{
                        _carouselCurrent -= 1;
                    }
                    _parent.data('current',_carouselCurrent);
                    $(_carouselItems[_carouselCurrent]).addClass('active');

                    _nextPrevCount.html( (_carouselCurrent+1) + '/' + _carouselTotal);
                    $('.hrtl-timeline-popup-source').hide();

                });
            })
        },

        isScrolledIntoView:function()
        {
            var docViewTop = $(window).scrollTop();
            var docViewBottom = docViewTop + $(window).height();

            var elemTop = this.offset().top;
            var elemBottom = elemTop + this.height();

            if(((elemBottom <= docViewBottom) && (elemTop >= docViewTop))){
                //animates in
                TweenMax.fromTo($('.hrtl-timeline-header h2'),0.7,{opacity:0,top:30},{opacity:1,top:0,ease:Expo.easeOut});
                TweenMax.fromTo($('.hrtl-timeline-header .is-large'),0.7,{opacity:0,top:30},{opacity:1,top:0,ease:Expo.easeOut,delay:0.1});
                TweenMax.fromTo($('.hrtl-timeline'),1,{opacity:0,height:0},{opacity:1,height:132,ease:Expo.easeOut,delay:0.2});

                $('.hrtl-timeline-years-block').each(function(i){
                    TweenMax.fromTo($(this),0.7,{opacity:0},{opacity:1,ease:Expo.easeOut,delay:0.5+(i*0.08)});
                })
                TweenMax.fromTo($('.hrtl-timeline-active-bg'),0.7,{width:0},{width:480,ease:Back.easeOut,delay:1.2});
                
                //remove event listener
                $(window).off('scroll.w_healthcare_reform_timeline');
            }
        },
        closeContainer:function(){
            this.$('.hrtl-timeline-year-dot.active').removeClass('active');
            this.$('.hrtl-expanded-content-container').removeClass('active');
            this.$el.removeClass('expanded');
        },

        onTearDown: function() {

        }

    },
    {
        IE8: true
    });
    
    // Don't forget to export your class
    return HealthcareReformTimeline;
});

