/**
 * Created by roel.kok on 7/7/14.
 */

// Seperate widget for handling expanding/collapsing the sideabr
// Does replace or is in any way part of the class hieracrchy of the segmentation sidebars
// The segmentation sidebars and this widget *do* share the same DOM nodes

define([
	"underscore",
	"lib/MediaQueries",
	"lib/WidgetView",
	"lib/MediaHelper"
],
function(
	_,
	MediaQueries,
	WidgetView,
	MediaHelper
) {

	var TOGGLE_EVENT = "raq_sidebar_toggle";
	var STICKY_EVENT = "navbar_sticky_toggle"; // Might make more sense to put this at the NavBar
	var UPDATE_EVENT = "update";

	var Sidebar = WidgetView.extend({

		initialize: function(options) {
			this.registerMediaHelper(DefaultMediaHelper);
		}

	},
	{
		selector: ".w_sidebar-individuals, .w_sidebar-agents, .w_sidebar-employers, .w_sidebar-brokers",
		TOGGLE_EVENT: TOGGLE_EVENT,
		STICKY_EVENT: STICKY_EVENT,
		UPDATE_EVENT: UPDATE_EVENT
	});

	var DefaultMediaHelper = MediaHelper.extend({

		mediaQuery: MediaQueries.HEADER_DEFAULT,

		isEnabled: true,

		initialize: function(options) {
			_.bindAll(this,
				"onToggleEvent",
				"onStickyEvent"
			);
			var _this = this;
			var initActive = 0;
			$(window).load(function(){
				for (i = 0; i < 3; i++) { 
					setTimeout(function(){
						if(_this.$el.hasClass("active") && initActive < 1){
							if(matchMedia(MediaQueries.HEADER_DEFAULT).matches){
								if (window.utag) {
									utag.link({_ga_category: 'lead form',_ga_action: 'expand',_ga_label: utag.data.form_type});
									utag.link({_ga_category: 'lead form',_ga_action: 'view',_ga_label: utag.data.form_type});
								}
							}
							initActive++;
						}
					}, 300);
				}
            });
		},
		update: function() {
			if(this.isEnabled && !this.isNavbarSticky) {
				this.$el.addClass("active");
			}
			else {
				if(this.$(document.activeElement).length < 1) {
					this.$el.removeClass("active");
				}
			}
			this.$el.trigger(UPDATE_EVENT); // TODO Only trigger on actual change
		},

		onSetUp: function() {
			this.$el.on(TOGGLE_EVENT, this.onToggleEvent);
			this.$el.on(STICKY_EVENT, this.onStickyEvent);

		},

		onTearDown: function() {
			this.$el.off(TOGGLE_EVENT, this.onToggleEvent);
			this.$el.off(STICKY_EVENT, this.onStickyEvent);
		},

		onToggleEvent: function() {
			this.isEnabled = !this.isEnabled;
			this.update();
		},

		onStickyEvent: function(event, isSticky) {
			this.isNavbarSticky = isSticky;
			this.update();
		}

	},
	{
		IE8: true
	});

	return Sidebar;

});