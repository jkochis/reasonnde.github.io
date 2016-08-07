/**
 * Created by roel.kok on 4/28/14.
 */
define([
	"underscore",
	"backbone",
	"lib/Env",
	"lib/SelectCollection",
	"lib/MediaQueries",
	"lib/MediaHelper",
	"widgets/contact/LightboxFactory",
	"../contact/IndividualsLightbox",
	"../Sidebar"
],
function(
	_,
	Backbone,
	Env,
	SelectCollection,
	MediaQueries,
	MediaHelper,
	ContactLightboxFactory,
	RequestAQuoteLightbox,
	Sidebar
) {
	var POINTER_START_EVENT = "MSPointerOver MSPointerDown pointerover pointerdown";
	var POINTER_END_EVENT = "MSPointerUp MSPointerOut pointerup pointerout pointerleave";
	var ENV_TOUCH = Env.ANDROID || Env.IOS;
	// TODO rename to SmallAndAboveMediaHelper (or whatever media query applies)
	var DefaultMediaHelper = MediaHelper.extend({
		mediaQuery: MediaQueries.HEADER_DEFAULT,
		isSticky: false,
		preventMouseLeave: false,
		initialize: function(options) {
			// this.cle = document.createElement( "div" );
			// $( this.cle ).css( { 
			// 	"position": "fixed",
			// 	"top": 0,
			// 	"left": 0,
			// 	"z-index": 10000000
			// } );
			// $( "body" ).append( this.cle );
			_.bindAll(this,
				"onMouseLeave",
				"onMouseLeaveMenuItems",
				"onMouseEnterDropdownMenu",
				"onScrollWindow",
				"onResizeWindow",
				"onClickDocument",
				"onPointerStart",
				"onPointerEnd",
				"onClickContactTrigger",
				"onRequestShowSubmenu",
				"onRequestHideSubmenu",
				"onCompleteFancyHideSubmenu",
				"onCompleteResizeDropdown"
			);
			this.$placer = this.$(".placer");
			this.$menuItems = this.$(".menu-items");
			this.$dropdownMenu = this.$(".dropdown-menu");
			this.$dropdownMenuContent = this.$(".dropdown-menu-content");
			this.$submenus = this.$(".submenus");
			this.$menuVeil = $("<div/>", {
				"class": "menu-veil"
			});
			this.$contactTrigger = this.$('.contact-trigger');
			this.$genericContactTrigger = this.$(".generic-contact-trigger");
			var $raqSidebar = $(Sidebar.selector);
			if($raqSidebar.length > 0) {
				this.$raqSidebar = $raqSidebar;
			}
			var menuModels = {};
			this.menuModelCollection = new SelectCollection();
			this.$(".menu-items li").each(_.bind(function(i, el) {
				var $el = $(el);
				var model = menuModels[$el.data("menu")] = new Backbone.Model({
					"selected": false,
					"hasSubmenu": false
				});
				this.menuModelCollection.add(model);
				this.registerChildMediaHelper(new DefaultMediaHelper.MenuButton({
					el: el,
					model: model
				}));
				
			}, this));
			this.submenus = [];
			this.$(".submenu").each(_.bind(function(i, el) {
				var $el = $(el);
				var submenuName = $(el).data("menu");
				if(menuModels[submenuName]) {
					menuModels[submenuName].set("hasSubmenu", true);
					var submenu = new DefaultMediaHelper.Submenu({
						el: el,
						model: menuModels[submenuName]
					});
					this.submenus.push(submenu);
					this.registerChildMediaHelper(submenu);
				}
			}, this));
			// Search
			this.searchModel = new Backbone.Model({
				"isOpen": false
			});
			this.registerChildMediaHelper(new DefaultMediaHelper.Search({
				el: this.$(".search"),
				model: this.searchModel
			}));
		},
		onSetUp: function() {
			this.testScroll();
			
			this.$el.on(POINTER_START_EVENT, this.onPointerStart);
			this.$el.on(POINTER_END_EVENT, this.onPointerEnd);
			if(!ENV_TOUCH) {
				this.$el.on("mouseleave", this.onMouseLeave);
				this.$menuItems.on("mouseleave", this.onMouseLeaveMenuItems);
				this.$dropdownMenu.on("mouseenter", this.onMouseEnterDropdownMenu);
			}
			this.menuModelCollection.on("changeselectedmodel", this.onChangeSelectedMenuModelCollection, this);
			this.searchModel.on("change:isOpen", this.onChangeIsOpenSearchModel, this);
			for(var i = 0; i < this.submenus.length; i++) {
				this.submenus[i].on("requestshow", this.onRequestShowSubmenu, this);
				this.submenus[i].on("requesthide", this.onRequestHideSubmenu, this);
			}
			$(window).on("scroll", this.onScrollWindow);
			$(window).on("resize", this.onResizeWindow);
			$(document).on(Env.IOS ? "touchstart" : "click", this.onClickDocument);
			//Request Quote
			this.$contactTrigger.on('click', this.onClickContactTrigger);
			this.$genericContactTrigger.on('click', this.onClickContactTrigger);
		},
		onTearDown: function() {
			this.menuModelCollection.clearSelection();
			this.isSticky = false;
			this.$el.removeClass("is-sticky");
			this.$placer.css("left", ""); // This is IE8 specific
			this.$menuItems.removeClass("is-active");
			this.$dropdownMenuContent.css("height", "");
			this.$el.off(POINTER_START_EVENT, this.onPointerStart);
			this.$el.off(POINTER_END_EVENT, this.onPointerEnd);
			if(!ENV_TOUCH) {
				this.$el.off("mouseleave", this.onMouseLeave);
				this.$menuItems.off("mouseleave", this.onMouseLeaveMenuItems);
				this.$dropdownMenu.off("mouseenter", this.onMouseEnterDropdownMenu);
			}
			this.menuModelCollection.off("changeselectedmodel", this.onChangeSelectedMenuModelCollection, this);
			this.searchModel.off("change:isOpen", this.onChangeIsOpenSearchModel, this);
			for(var i = 0; i < this.submenus.length; i++) {
				this.submenus[i].off("requestshow", this.onRequestShowSubmenu, this);
				this.submenus[i].off("requesthide", this.onRequestHideSubmenu, this);
			}
			$(window).off("scroll", this.onScrollWindow);
			$(window).off("resize", this.onResizeWindow);
			$(document).off(Env.IOS ? "touchstart" : "click", this.onClickDocument);
			//Request Quote
			this.$contactTrigger.off('click', this.onClickContactTrigger);
			this.$genericContactTrigger.off('click', this.onClickContactTrigger);
		},
		testScroll: function() {
			// TODO This might impact scrolling performance
			var offset = this.$el.offset().top;
			var scrollTop = $(document).scrollTop();
			if( scrollTop > offset) {
				if(!this.isSticky) {
					this.isSticky = true;
					this.$el.addClass("is-sticky");
					if(this.$raqSidebar) {
						this.$raqSidebar.trigger(Sidebar.STICKY_EVENT, this.isSticky);
					}
				}
				if(Env.IE8) {
					this.$placer.css("left", -$(window).scrollLeft())
				}
			}
			else {
				if(this.isSticky) {
					this.isSticky = false;
					this.$el.removeClass("is-sticky");
					if(this.$raqSidebar) {
						this.$raqSidebar.trigger(Sidebar.STICKY_EVENT, this.isSticky);
					}
					if(Env.IE8) {
						this.$placer.css("left", "");
					}
				}
			}
		},
		onPointerStart: function(event) {
			if(event.originalEvent.pointerType === 2 || event.originalEvent.pointerType === 3 || event.originalEvent.pointerType === "touch" || event.originalEvent.pointerType === "pen") {
				this.preventMouseLeave = true;
			}
		},
		onMouseLeave: function() {
			if(!this.preventMouseLeave && !ENV_TOUCH) {
				clearTimeout(this.clearSelectionTimeout);
				this.clearSelectionTimeout = setTimeout(_.bind(function() {
					this.menuModelCollection.clearSelection();
				}, this), 0);
			}
		},
		onMouseLeaveMenuItems: function() {
			if(!this.preventMouseLeave && !ENV_TOUCH) {
				clearTimeout(this.clearSelectionTimeout);
				this.clearSelectionTimeout = setTimeout(_.bind(function() {
					this.menuModelCollection.clearSelection();
				}, this), 0);
			}
		},
		onPointerEnd: function(event) {
			setTimeout(_.bind(function() {
				this.preventMouseLeave = false;
			}, this), 0);
		},
		onMouseEnterDropdownMenu: function() {
			clearTimeout(this.clearSelectionTimeout);
		},
		onScrollWindow: function() {
			this.testScroll();
		},
		onResizeWindow: function() {
			this.testScroll(); // Scroll can get updated after resize
		},
		onClickDocument: function(event) {
			if(!$.contains(this.el, event.target)) {
				this.menuModelCollection.clearSelection();
			}
		},
		onChangeSelectedMenuModelCollection: function(model) {
			if(model) {
				this.$menuItems.addClass("is-active");
//			if(model.get("hasSubmenu")) {
//				this.$dropdownMenu.css("height", "auto");
//			}
//			else {
//				this.$dropdownMenu.css("height", 0);
//			}
			}
			else {
				this.$menuItems.removeClass("is-active");
//			this.$dropdownMenu.css("height", 0);
			}
		},
		onChangeIsOpenSearchModel: function(model, isOpen, options) {
			if(isOpen) {
				this.$menuVeil.insertAfter(this.$menuItems);
			}
			else {
				this.$menuVeil.detach();
			}
		},
		onClickContactTrigger: function() {
			if(this.$raqSidebar && !this.isSticky) {
				this.$raqSidebar.trigger(Sidebar.TOGGLE_EVENT);
                  if(this.$raqSidebar.hasClass("active") ){
					if (window.utag) {  
						utag.link({_ga_category: 'lead form',_ga_action: 'expand',_ga_label: utag.data.form_type});
						utag.link({_ga_category: 'lead form',_ga_action: 'view',_ga_label: utag.data.form_type});
					}
                      
                  }else{ 
					if (window.utag) {
						utag.link({_ga_category: 'lead form',_ga_action: 'hide',_ga_label: utag.data.form_type});
					}
                  }
			}
			else {
			
				//HCR segmentation
			var seg = $.cookie('MainNavItem');
			var url_seg = window.location.pathname.split( '/' );
			url_seg = url_seg[1];
				/* default tab for new users */
					if (seg == 'brokers' && url_seg == 'health-care-reform'){
						Env.SEGMENT = seg;
					}else if (url_seg == 'health-care-reform'){
						Env.SEGMENT = 'business';
					}	
			
				//$.cookie('MainNavItem', 'Item', { expires: 300, path: '/' });
//				var seg = window.location.pathname.split( '/' );
	//			seg = seg[1];
				//seg = seg[0];
		//		console.log(seg);
			  // 
				var lightbox = ContactLightboxFactory.create();
			//	console.log(ContactLightboxFactory);
				lightbox.show();
			}
		},
		// Fancy stuff
		currentSubmenu: null,
		queuedSubmenu: null,
		resizeDropdown: function() {
			var targetHeight = 0;
			if(this.currentSubmenu) {
				this.currentSubmenu.prepareFancyShow();
				targetHeight = this.$submenus.height() + 60;
			}
			this.resizeDropdownTween = TweenMax.to(this.$dropdownMenuContent, .5, {
				height: targetHeight,
				ease: Expo.easeInOut,
				onComplete: this.onCompleteResizeDropdown
			});
		},
		onRequestShowSubmenu: function(submenu) {
			if(this.currentSubmenu) {
				if(this.currentSubmenu == submenu) {
					if(this.resizeDropdownTween) {
						this.resizeDropdownTween.kill();
						this.resizeDropdown();
					}
					else {
						this.currentSubmenu.fancyShow();
					}
				}
				else {
					if(this.resizeDropdownTween) {
						this.resizeDropdownTween.kill();
						this.currentSubmenu.hide();
						this.currentSubmenu = submenu;
						this.resizeDropdown();
					}
					else {
						this.queuedSubmenu = submenu;
					}
				}
			}
			else {
				this.currentSubmenu = submenu;
				// We could be resizing to 0. Kill that tween in that case
				if(this.resizeDropdownTween) {
					this.resizeDropdownTween.kill();
				}
				this.resizeDropdown();
			}
		},
		onRequestHideSubmenu: function(submenu) {
			// We only have to do something if the submenu was already used
			if(submenu == this.currentSubmenu) {
				// We were resizing for this submenu
				if(this.resizeDropdownTween) {
					this.resizeDropdownTween.kill();
					this.currentSubmenu.hide(); // Undo prepare for show
					this.currentSubmenu = null;
					this.resizeDropdown();
				}
				// Submenu was showing or idle
				else {
					submenu.fancyHide(this.onCompleteFancyHideSubmenu);
				}
			}
			else if(submenu == this.queuedSubmenu) {
				this.queuedSubmenu = null;
			}
		},
		onCompleteFancyHideSubmenu: function() {
			if(this.queuedSubmenu) {
				this.currentSubmenu = this.queuedSubmenu;
				this.queuedSubmenu = null;
			}
			else {
				this.currentSubmenu = null;
			}
			this.resizeDropdown();
		},
		onCompleteResizeDropdown: function() {
			this.resizeDropdownTween = null;
			if(this.currentSubmenu) {
				this.currentSubmenu.fancyShow(function() {});
			}
		}
	},
	{
		IE8: true
	});
	DefaultMediaHelper.MenuButton = MediaHelper.extend({
		preventMouseEnter: false,
		initialize: function(options) {
			_.bindAll(this,
				"onPointerOver",
				"onMouseEnterA",
				"onClickA",
				"onPointerEnd"
			);
			this.$a = this.$("a");
			if(this.$el.hasClass('has-submenu')) {
				this.$aSubMenu = this.$('a');
			}
			this.submenuName = this.$el.data("submenu");
		},
		onSetUp: function() {
			this.$a.on(POINTER_START_EVENT, this.onPointerOver);
			if(!ENV_TOUCH) this.$a.on("mouseenter", this.onMouseEnterA);
			if(this.$aSubMenu) this.$aSubMenu.on("click", this.onClickA);
			this.$a.on(POINTER_END_EVENT, this.onPointerEnd);
			this.model.on("change:selected", this.onChangeSelectedModel, this);
		},
		onTearDown: function() {
			this.$a.off(POINTER_START_EVENT, this.onPointerOver);
			if(!ENV_TOUCH) this.$a.off("mouseenter", this.onMouseEnterA);
			if(this.$aSubMenu) this.$aSubMenu.off("click", this.onClickA);
			this.$a.off(POINTER_END_EVENT, this.onPointerEnd);
			this.model.off("change:selected", this.onChangeSelectedModel, this);
		},
		onPointerOver: function(event) {
			if(event.originalEvent.pointerType === 2 || event.originalEvent.pointerType === 3 || event.originalEvent.pointerType === "touch" || event.originalEvent.pointerType === "pen") {
				this.preventMouseEnter = true;
			}
		},
		onMouseEnterA: function(event) {			
			if(!this.preventMouseEnter && !this.model.get("selected") && !ENV_TOUCH) {
				this.model.set("selected", true);
			}
		},
		onClickA: function(event) {
			if(!this.model.get("selected")) {
				event.preventDefault();
				this.model.set("selected", true);
			}
			
		},
		onPointerEnd: function() {
			if(this.preventMouseEnter && this.model.get("selected")) {
				this.preventMouseEnter = false;
			}
		},
		onChangeSelectedModel: function(model, selected, options) {
			if(selected) {
				this.$el.addClass("is-active");
			}
			else {
				this.$el.removeClass("is-active");
			}
		}
	},
	{
		IE8: true
	});
	DefaultMediaHelper.Submenu = MediaHelper.extend({
		initialize: function(options) {
		},
		onSetUp: function() {
			this.model.on("change:selected", this.onChangeSelectedModel, this);
		},
		onTearDown: function() {
			this.$el.css({
				"display": "",
				"opacity": ""
			});
			this.model.off("change:selected", this.onChangeSelectedModel, this);
		},
		show: function() {
			this.$el.css("display", "inline-block");
		},
		prepareFancyShow: function() {
			this.$el.css({
				"display": "inline-block",
				"opacity": 0
			});
		},
		fancyShow: function(callback) {
			this.stopFancy();
			this.tween = TweenMax.to(this.$el, .15, {
				opacity: 1,
				ease: Quad.easeOut,
				onComplete: callback
			});
		},
		hide: function() {
			this.$el.css("display", "none");
		},
		fancyHide: function(callback) {
			this.stopFancy();
			this.tween = TweenMax.to(this.$el, .15, {
				opacity: 0,
				ease: Quad.easeIn,
				onComplete: _.bind(function() {
					this.$el.css("display", "none");
					callback();
				}, this)
			});
		},
		stopFancy: function() {
			if(this.tween) {
				this.tween.kill();
				this.tween = null;
			}
		},
		onChangeSelectedModel: function(model, selected, options) {
			if(selected) {
//			this.show();
				this.trigger("requestshow", this);
			}
			else {
//			this.hide();
				this.trigger("requesthide", this);
			}
		}
	},
	{
		IE8: true
	});
	DefaultMediaHelper.Search = MediaHelper.extend({
		hasFocusedElement: 0,
		initialize: function(options) {
			_.bindAll(this,
				"onClickClear",
				"onChangeInput",
				"onFocusFormElements",
				"onBlurFormElements",
				"onClickActivator"
			);
			this.$textInput = this.$("input[type=text]");
			this.$clear = this.$(".clear");
			this.$formElements = this.$("input, button");
			this.$activator = $("<div/>", {
				"class": "activator"
			});
		},
		onSetUp: function() {
			this.processIsOpen();
			this.$clear.on("click", this.onClickClear);
			this.$textInput.on("change input paste propertychange", this.onChangeInput);
			this.$formElements.on("focus", this.onFocusFormElements);
			this.$formElements.on("blur", this.onBlurFormElements);
			this.$activator.on("click", this.onClickActivator);
			this.model.on("change:isOpen", this.onChangeIsOpenModel, this);
		},
		onTearDown: function() {
			this.$el.css("width", "");
			this.$activator.detach();
			this.$clear.off("click", this.onClickClear);
			this.$textInput.off("change input paste propertychange", this.onChangeInput);
			this.$formElements.off("focus", this.onFocusFormElements);
			this.$formElements.off("blur", this.onBlurFormElements);
			this.$activator.off("click", this.onClickActivator);
			this.model.off("change:isOpen", this.onChangeIsOpenModel, this);
		},
		processIsOpen: function() {
			if(this.model.get("isOpen")) {
				this.$el.addClass("is-focused");
				this.$activator.detach();
			}
			else {
				this.$el.removeClass("is-focused");
				this.$el.css("width", "");
				this.$activator.appendTo(this.$el);
			}
		},
		onFocusFormElements: function(event) {
			this.hasFocusedElement = true;
			this.model.set("isOpen", true);
		},
		onBlurFormElements: function(event) {
			this.hasFocusedElement = false;
			setTimeout(_.bind(function() {
				if(!this.hasFocusedElement) {
					this.model.set("isOpen", false);
				}
			}, this), 0);
		},
		onClickActivator: function(event) {
			event.preventDefault();
			this.$textInput[0].focus();
		},
		onChangeInput: function() {
			this.$el.removeClass("is-filled");
		},
		onClickClear: function(event) {
			event.preventDefault();
			this.$textInput.val("");
			this.$textInput[0].focus();
			this.$el.removeClass("is-filled");
		},
		onChangeIsOpenModel: function(model, isOpen, options) {
			this.processIsOpen();
		}
	},
	{
		IE8: true
	});
	return DefaultMediaHelper;
});