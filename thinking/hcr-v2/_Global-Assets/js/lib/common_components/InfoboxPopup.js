/**
 * Created by roel.kok on 6/19/14.
 */

define([
	"underscore",
	"lib/Env",
	"lib/BaseView"
],
function(
	_,
	Env,
	BaseView
) {

	var AUTOHIDE_TIMEOUT = 4000;

	var InfoboxPopup = BaseView.extend({

		className: "w_infobox-popup",

		initialize: function(options) {
			_.bindAll(this,
				"onClickBody",
				"onScrollWindow",
				"onResizeWindow",
				"onAutohideTimeout",
				"onHideCompleteTimeout"
			);

			this.$el.append("<div class='box'><div class='title'/><div class='message'/></div>");

			this.$box = this.$(".box");
			this.$title = this.$(".title");
			this.$message = this.$(".message");

			this.$title.html(options.title);
			this.$message.html(options.message);

			if(options.error) {
				this.$el.addClass("is-error");
			}

			if(options.origin) {
				this.setOrigin(options.origin);
			}
		},

		setOrigin: function(origin) {
			this.$el.css(origin);
		},

		show: function() {
			clearTimeout(this.hideCompleteTimeout);
			this.$el.appendTo(document.body);
			var height = this.$box.outerHeight();
			this.$box.css("margin-top", -height/2);

			setTimeout(_.bind(function() {
				$(document.body).on("click", this.onClickBody);
				$(window).on("scroll", this.onScrollWindow);
				$(window).on("resize", this.onResizeWindow);
			}, this), 0);

//			this.autohideTimeout = setTimeout(this.onAutohideTimeout, AUTOHIDE_TIMEOUT);
		},

		hide: function() {
			clearTimeout(this.autohideTimeout);
			this.$el.addClass("a-hide");
			$(document.body).off("click", this.onClickBody);
			$(window).off("resize", this.onResizeWindow);
			this.hideCompleteTimeout = setTimeout(this.onHideCompleteTimeout, !Env.IE8 && !Env.IE9 ? 150 : 0);
		},

		onClickBody: function(event) {
			if(event.target !== this.el && this.$(event.target).length < 1) {
				this.hide();
			}
		},

		onScrollWindow: function() {
			this.hide();
		},

		onResizeWindow: function() {
			this.hide();
		},

		onAutohideTimeout: function() {
			this.hide();
		},

		onHideCompleteTimeout: function() {
			this.$el.detach();
		}

	});

	return InfoboxPopup;
});