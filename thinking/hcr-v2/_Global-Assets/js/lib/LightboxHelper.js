/**
 * Created by roel.kok on 7/9/14.
 */
define([
	"underscore",
	"backbone",
	"lib/Env",
	"lib/BaseView"
],
function(
	_,
	Backbone,
	Env,
	BaseView
) {
	var LightboxHelper = BaseView.extend({
		initialize: function(options) {
			_.bindAll(this,
//				"onClickOverlay",
				"onCompleteHide"
			);
			this.model = new Backbone.Model({
				"isVisible": false
			});
//			this.$overlay = $("<div/>", {
//				"class": "w_lightbox-veil"
//			});
//			this.$overlay.on("click", this.onClickOverlay);
			this.model.on("change:isVisible", this.onChangeIsVisible, this);
		},
		show: function() {
			this.model.set("isVisible", true);
		},
		hide: function() {
			this.model.set("isVisible", false);
			$("body").css("overflow", "inherit");
		},
		hideAll: function() {
			LM.hideAll();
		},
		_show: function() {
			clearTimeout(this.hideTimeout);
			this.$el.addClass("a-pre-show");
//			this.$overlay.addClass("a-pre-show");
			$(document.body).append(this.el);
			document.body.offsetHeight;
			this.$el.removeClass("a-pre-show");
//			this.$overlay.removeClass("a-pre-show");
			
		//	console.log("LightboxHelper Show")
			//position absolute for touch devices.
			if(Env.IOS){
			    this.$el.css('position','absolute');
			    $('body').css('overflow','hidden');
			    $('html').css('overflow','hidden');
			}
		},
		_hide: function(callback) {
			this.hideCallback = callback;
			this.$el.addClass("a-hide");
//			this.$overlay.addClass("a-hide");
			this.hideTimeout = setTimeout(this.onCompleteHide, Env.IE8 || Env.IE9 ? 0 : 900);
			//position absolute for touch devices.
			if(Env.IOS){
			    this.$el.css('position','absolute');
			    $('body').css('overflow','inherit');
			    $('html').css('overflow','inherit');
			}
		},
		onCompleteHide: function() {
//			this.$overlay.detach();
			this.$el.detach();
			this.$el.removeClass("a-hide");
			this.$el.removeClass("a-hide");
			this.hideCallback(this);
		},
		onChangeIsVisible: function(model, value, options) {
			if(value) {
//				this._show();
				LM.addLightbox(this);
			}
			else {
//				this._hide();
				LM.popLightbox();
			}
		}//,
//		onClickOverlay: function(event) {
//			event.preventDefault();
//
//			this.model.set("isVisible", false);
//		}
	});
	var LightboxManager = function() {
		_.bindAll(this,
			"onClickVeil",
			"onCompleteHideLightbox",
			"onCompleteRemoveLightbox"
		);
		this.stack = [];
		this.$veil = $("<div/>", {
			"class": "w_lightbox-veil"
		});
		this.$veil.on("click", this.onClickVeil);
	}
	_.extend(LightboxManager.prototype, {
		stack: null,
		current: null,
		isVeilAttached: false,
		addLightbox: function(lightbox) {
			if(this.stack.length > 0) {
				var current = this.stack[this.stack.length - 1];
				this.stack.push(lightbox);
				this.hideLightbox(current);
			}
			else {
				this.stack.push(lightbox);
				this.showLightbox(lightbox, true);
			}
		},
		popLightbox: function() {
			var popped = this.stack.pop();
			popped._hide(this.onCompleteRemoveLightbox);
		},
		showLightbox: function(lightbox, wait) {
			this.$veil.removeClass("a-hide");
			if(!this.isVeilAttached) {
				this.isVeilAttached = true;
				this.$veil.addClass("a-pre-show");
				$(document.body).append(this.$veil);
				document.body.offsetHeight;
				this.$veil.removeClass("a-pre-show");
			}
			lightbox._show();
		},
		hideLightbox: function(lightbox) {
			lightbox._hide(this.onCompleteHideLightbox);
		},
		hideAll: function() {
			if(this.stack.length > 0) {
				this.stack = [this.stack[this.stack.length - 1]];
				this.stack[0].hide();
			}
		},
		onClickVeil: function(event) {
			event.preventDefault();
            if (window.utag) {
                utag.link({_ga_category: 'lead form',_ga_action: 'hide',_ga_label: utag.data.form_type});
            }    
			this.hideAll();
		},
		onCompleteHideLightbox: function(lightbox) {
			var current = this.stack[this.stack.length - 1];
			this.showLightbox(current);
		},
		onCompleteRemoveLightbox: function(lightbox) {
			if(this.stack.length < 1) {
				this.isVeilAttached = false;
				this.$veil.detach();
				this.$veil.removeClass("a-hide");
			}
			else {
				var current = this.stack[this.stack.length - 1];
				this.showLightbox(current);
			}
		}
	});
	var LM = new LightboxManager();
	return LightboxHelper;
});