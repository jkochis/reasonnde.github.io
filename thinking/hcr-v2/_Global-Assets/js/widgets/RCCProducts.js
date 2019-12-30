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
    var RCCProducts = WidgetView.extend({
        initialize: function() {
            this.registerMediaHelper(RCCProductsSmallAndAbove);
            this.registerMediaHelper(RCCProductsXSmall);
            this.registerMediaHelper(RCCProductsTabletLandscape);
        }
    },
    {
        selector: '.w_products--rcc'
    });
    var RCCProductsSmallAndAbove = MediaHelper.extend({
        mediaQuery: MediaQueries.SMALL_AND_ABOVE,
        initialize: function(options) {
        },
        onSetUp: function() {
            this.$el.find('.availability').matchHeight();
            this.$el.find('.col-content').matchHeight();
        },
        onTearDown: function() {
            this.$el.find('.availability').matchHeight('remove');
            this.$el.find('.col-content').matchHeight('remove');
        }
    },{
    	IE8: true
    });
    var RCCProductsXSmall = MediaHelper.extend({
        mediaQuery: MediaQueries.X_SMALL,
        initialize: function(options) {
        },
        onSetUp: function() {
            this.$el.find('.policy-image').each(function() {
                var img = $(this).find('img');
                $(this).css({
                    'background-image': 'url(' + img.attr('src') + ')'
                });
            });
            this.$el.find('.policy').each(function() {
                $(this).find('.eq-mobile').matchHeight();
            });
        },
        onTearDown: function() {
            this.$el.find('.policy').each(function() {
                $(this).find('.eq-mobile').matchHeight('remove');
            });
        }
    });
    var RCCProductsTabletLandscape = MediaHelper.extend({
        mediaQuery: MediaQueries.TABLET_LANDSCAPE,
        initialize: function(options) {
        },
        onSetUp: function() {
            this.$el.find('.policy-image').each(function() {
                var img = $(this).find('img');
                $(this).css({
                    'background-image': 'url(' + img.attr('src') + ')'
                });
            });
        }
    });
    return RCCProducts;
});