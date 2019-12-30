define([
        "lib/Env",
        "lib/WidgetView",
        "lib/MediaHelper",
        "lib/MediaQueries"
    ],
    function(
        Env,
        WidgetView,
        MediaHelper,
        MediaQueries
    ) {
        var ShareWidget = WidgetView.extend({
                events: {
                    'collapseServices': 'collapseServices'
                },
                initialize: function() {
                    this.setup();
                    this.registerMediaHelper(ShareWidgetSmallAndAbove);
                    this.registerMediaHelper(ShareWidgetXSmall);
                },
                setup: function() {
                    var url = this.$el.data('share-url') || window.location.href,
                        twitterDesc = encodeURIComponent($('meta[name="twitter:description"]').attr("content")),
                        twitterTitle = encodeURIComponent($('meta[name="twitter:title"]').attr("content")),
                        twitterSite = encodeURIComponent($('meta[name="twitter:site"]').attr("content"));
                    this.$el
                        .find('.facebook').attr({
                            'href': 'https://www.facebook.com/sharer/sharer.php?u=' + url
                        })
                        .end()
                        .find('.twitter').attr({
                            'href': 'https://twitter.com/home?status=' + twitterTitle + "%0A" +
                            twitterDesc + "%0A" + url + "%0A" + twitterSite
                        })
                        .end()
                        .find('.googleplus').attr({
                            'href': 'https://plus.google.com/share?url=' + url
                        })
                        .end()
                        .find('.service').on('click', function() {
                            window.open($(this).attr('href'), 'Share', 'width=620,height=320');
                            return false;
                        });
				/*	var bgColor = $("#pagebgwide div:last").children().last().css( "background-color");
					this.$el.parent().css( "background-color", bgColor);
					this.$el.parent().css( "height", "50px");
					this.$el.css( "bottom", "0");*/
                    this.$el.find('.service').each(function(i, el) {
                        $(this).addClass('service-'+(i+1))
                    });
                },
                collapseServices: function() {
                    this.$el.removeClass('visible')
                        .find('.w_share__services').removeClass('visible')
                },
                onTearDown: function() {
                }
            },
            {
                selector: '.w_share'
            });
        var ShareWidgetSmallAndAbove = MediaHelper.extend({
                mediaQuery: MediaQueries.SMALL_AND_ABOVE,
                initialize: function(options) {
                    _.bindAll(this, 'onResize', 'onScroll', 'expandServices', 'collapseServices', 'attach', 'detach', 'shouldAttach');
                    this.$shareBar = this.$el.closest('.w_share-bar');
                },
                onSetUp: function() {
                    this.teardownMode = false;
                    this.ENV_TOUCH = Env.IOS || Env.ANDROID || Env.WP || Env.SURFACE;
                    this.STANDALONE = this.$el.hasClass('standalone');
                    this.collapseServices();
                    if(this.ENV_TOUCH) {
                        this.$el.find('.w_share__trigger').on('click.share', this.expandServices);
                        this.$el.find('.w_share__close').on('click.share', this.collapseServices);
                       // $( document.body ).on( "click.share", this.collapseServices);
                    } else {
                        this.$el.find('.w_share__trigger').on('mouseenter.share', this.expandServices);
                        this.$el.find('.w_share__services').on('mouseleave.share', this.collapseServices);
                    }
                    $(window).on('resize.w_share', this.onResize).trigger('resize.w_share');
                    $(window).on('scroll.w_share', this.onScroll).trigger('scroll.w_share');
                },
                onScroll: function() {
                    if(this.teardownMode) return;
                  
                    if(this.STANDALONE) {
                        if(this.shouldAttach()) {
                            this.attach();
                        } else {
                            this.detach();
                        }
                    }
                    
                    
                    if(Env.IE8){
                    
                      this.detach();
                      if( ( $(window).scrollTop()-$(window).height() ) < ( $(document).height()-$(window).height() )){
                          this.$el.css({'top':$(window).height()-50,
                              'left':'50%',
                              'right':'inherit',
                              'bottom':'inherit'});
                              
                        this.positionTrigger();
                      }else{
                          this.$el.css({'top':'inherit',
                              'left':'50%',
                              'right':'inherit',
                              'bottom':'50px'});
                      }
                    }
                },
                onResize: function() {
                    if(this.teardownMode) return;
                    if(this.STANDALONE) {
                        this.positionTrigger();
                        this.$el.fadeIn('fast');
                        if (this.$el.data('clip-to')) {
                            var $clip = $(this.$el.data('clip-to'));
                            if (!$clip.length) return false;
                            if ($clip.offset().top < $(window).height()) {
                                this.$el.css({
                                    'top': $clip.offset().top,
                                    'margin-top': 0
                                })
                            }
                        }
                    }
                    if(Env.IE8){
                    
                      this.detach();
                      if( ( $(window).scrollTop()-$(window).height() ) < ( $(document).height()-$(window).height() )){
                          this.$el.css({'top':$(window).height()-50,
                              'left':'50%',
                              'right':'inherit',
                              'bottom':'inherit'});
                              
                        this.positionTrigger();
                      }else{
                          this.$el.css({'top':'inherit',
                              'left':'50%',
                              'right':'inherit',
                              'bottom':'50px'});
                      }
                    }
                },
                shouldAttach: function() {
                    var $window = $(window),
                        screenBase = $window.scrollTop() + $window.height(),
                        widgetBase = (this.$shareBar.offset().top + this.$shareBar.outerHeight());
                    return screenBase >= widgetBase;
                },
                attach: function() {
                    this.$el.addClass('attached');
                },
                detach: function() {
                    this.$el.removeClass('attached');
                },
                expandServices: function(ev) {
                    this.$el.find('.w_share__services').addClass('visible');
                    return false;
                },
                // Fixed position is relative to window, not parent container.
                // Therefore, add half of container width to left: 50%; so widget aligns with right edge.
                positionTrigger: function () {
                    var offsetFromCenter = this.$el.closest('#root').width() / 2 - this.$el.width();
                    // Move 1px right on IE8
                    if(Env.IE8) offsetFromCenter++;
                    this.$el.css({ 'margin-left': offsetFromCenter });
                },
                collapseServices: function(ev) {
                    this.$el.find('.w_share__services').removeClass('visible');
                    return false;
                },
                onTearDown: function() {
                    this.teardownMode = true;
                    $(window).off('resize.w_share');
                    $(window).off('scroll.w_share');
                    if(this.$el.data('clip-to')) {
                        this.$el.css({
                            top: 0,
                            'margin-top': 0
                        })
                    }
                    this.$el.css({
                        'margin-left': 'auto'
                    });
                    this.$el.find('.w_share__trigger').off('mouseenter.share');
                    this.$el.find('.w_share__services').off('mouseleave.share');
                }
            },
            {
                IE8: true
            });
        var ShareWidgetXSmall = MediaHelper.extend({
            mediaQuery: MediaQueries.X_SMALL,
            initialize: function(options) {
            },
            onSetUp: function() {
                this.ENV_TOUCH = Env.IOS || Env.ANDROID || Env.WP || Env.SURFACE;
                this.collapseServices();
                if(this.ENV_TOUCH) {
                    this.$el.find('.w_share__trigger').on('click.share', $.proxy(this.expandServices, this));
                    this.$el.find('.w_share__close').on('click.share', $.proxy(this.collapseServices, this));
                 /*   $( document.body ).on( "click.share", $.proxy( this.collapseServices, this) );*/
                } else {
                    if(!this.$el.hasClass('standalone')) {
                        this.$el.find('.w_share__trigger').on('mouseenter.share', $.proxy(this.expandServices, this));
                        this.$el.find('.w_share__services').on('mouseleave.share', $.proxy(this.collapseServices, this));
                    } else {
                        this.$el.find('.w_share__trigger').on('click.share', $.proxy(this.expandServices, this));
                        this.$el.find('.w_share__close').on('click.share', $.proxy(this.collapseServices, this));
                     /*   $( document.body ).on( "click.share", $.proxy( this.collapseServices, this) );*/
                    }
                }
            },
            expandServices: function(ev) {
                this.$el
                    .addClass('visible')
                    .find('.w_share__services').addClass('visible');
                return false;
            },
            collapseServices: function(ev) {
                this.$el
                    .removeClass('visible')
                    .find('.w_share__services').removeClass('visible');
                return false;
            },
            onTearDown: function() {
                this.$el.find('.w_share__trigger').off('click.share mouseenter.share');
                this.$el.find('.w_share__services').off('mouseleave.share');
                this.$el.find('.w_share__close').off('click.share');
            }
        });
        return ShareWidget;
    });