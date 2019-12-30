define([
        "underscore",
        "lib/WidgetView",
        "lib/MediaHelper",
        "lib/MediaQueries"
    ],
    function(
        _,
        WidgetView,
        MediaHelper,
        MediaQueries
    ) {
        return ScrollWidget = WidgetView.extend({
                initialize: function (options) {
                    this._options = options || {};
                    this._options.rotations = this._options.rotations || 3;
                    this._currentRotation = 0;
                    this._animationFrame = 1;

                    _.bindAll(this, "scrollDown",  "hide", "_getScrollOffset", "_animate");

                    this.$window = $(window);

                    this._initListeners();
                    this._initDOM();

                    if(this.$el.data('animate')) {
                        this._animate();
                    }
                },

                // Scroll document to calculated offset and hide widget.
                scrollDown: function() {
                    $("body, html").animate({ scrollTop: this._getScrollOffset() });
                    this.hide();
                },

                // Hide widget and remove scroll handler from window.
                hide: function() {
                    if(!this.hidden) {
                        this.$el.fadeOut("fast");
                        this.$window.off("scroll", this.hide);
                        this.hidden = true;
                    }
                },

                _initListeners: function () {
                    this.$el.on("click", this.scrollDown);
                    this.$window.on("scroll", this.hide);
                },

                _initDOM: function() {
                    if(this.$window.scrollTop() > 50) {
                        this.hide();
                    } else {
                        this.$el.fadeIn("fast");
                    }
                },

                _animate: function() {
                    this._animationFrame = (((this._animationFrame % 3) + 3) % 3) + 1;

                    this.$el.addClass(this._animationClasses[this._animationFrame][0]);
                    this.$el.removeClass(this._animationClasses[this._animationFrame][1]);

                    if(this._animationFrame == 3) {
                        this._currentRotation++;

                        if(this._currentRotation >= this._options.rotations) {
                            return this.hide();
                        }
                    }

                    setTimeout(this._animate, 250);
                },

                // First value for each frame is class for current frame, second value is classes to be removed
                _animationClasses: {
                    1: ["frame-1", "frame-2 frame-3"],
                    2: ["frame-2", "frame-1 frame-3"],
                    3: ["frame-3", "frame-1 frame-2"]
                },

                // Go through available offset options and use first that returns truthy value.
                _getScrollOffset: function() {
                    return this._fixedOffset() || this._offsetToDestination() || this._defaultOffset();
                },

                // Fixed amount of pixels, specified in markup as data-distance.
                _fixedOffset: function() {
                    var fixedOffset = this.$el.data("distance");
                    return fixedOffset && this._compensatedOffset(fixedOffset);
                },

                // Offset of a destination node, specified by a selector in markup as data-destination.
                _offsetToDestination: function() {
                    var $destination = $(this.$el.data("destination"));
                    return $destination.length && this._compensatedOffset($destination.offset().top);
                },

                // Current height of window.
                _defaultOffset: function() {
                    return this._compensatedOffset($(window).height());
                },

                // Modifieds calculated offset so that scrolled position isn't covered by headers etc.
                _compensatedOffset: function(val) {
                    return val - $(".w_nav-bar").outerHeight();
                }
            },

            // Static properties
            {
                // The css selector to look up the widget DOM node
                selector: ".w_scroll-widget"
            });
    });