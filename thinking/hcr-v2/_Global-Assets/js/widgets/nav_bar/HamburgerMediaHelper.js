/**
 * Created by roel.kok on 4/28/14.
 */

define([
	"underscore",
	"backbone",
	"lib/SelectCollection",
	"lib/MediaHelper",
	"lib/MediaQueries",
	"./HamburgerContact"
],
function(
	_,
	Backbone,
	SelectCollection,
	MediaHelper,
	MediaQueries,
	HamburgerContact
) {
	// TODO Rename to XSMallMediaHelper (or whatever media query applies)
	var HamburgerMediaHelper = MediaHelper.extend({

		mediaQuery: MediaQueries.HEADER_HAMBURGER,

		initialize: function(options) {
			_.bindAll(this,
				"onClickMenuToggle",
				"onClickRequestQuote",
				"onChangeAccountSelect",
				"onClickClose"
			);

			this.model = new Backbone.Model({
				"isOpen": false
			});

			this.$placer = this.$(".placer");
			this.$menu = this.$(".menu");
			this.$menuToggle = this.$(".menu-toggle");
			this.$contactTrigger = this.$(".contact-trigger");
			this.$genericContactTrigger = this.$(".generic-contact-trigger");
			this.$mainMenu = this.$(".main-menu");
			this.$accountSelect = this.$(".account select");
			this.$close = this.$(".close");
			this.$veil = $("<div/>", {
				"class": "veil"
			});

			this.$accountSelect.prop("selectedIndex", -1);

			this.requestAQuote = new HamburgerContact({
				el: this.$(".contact-mobile")
			});
			this.registerChildMediaHelper(this.requestAQuote);

			this.registerChildMediaHelper(new HamburgerMediaHelper.Search({
				el: this.$(".search")
			}));

			var menuModels = {};
			this.menuModelCollection = new SelectCollection();
			this.$(".menu-items li").each(_.bind(function(i, el) {
				var $el = $(el);
				var model = menuModels[$el.data("menu")] = new Backbone.Model({
					"selected": false,
					"hasSubmenu": false
				});
				this.menuModelCollection.add(model);
				this.registerChildMediaHelper(new HamburgerMediaHelper.MenuButton({
					el: el,
					model: model
				}));
			}, this));
			this.$(".submenu").each(_.bind(function(i, el) {
				var $el = $(el);
				var model = menuModels[$el.data("menu")];
				if(model) {
					model.set("hasSubmenu", true);
					this.registerChildMediaHelper(new HamburgerMediaHelper.Submenu({
						el: el,
						model: model
					}));
				}
			}, this));
			this.$accountSelect.prepend('<option class="logadded" value="#">Select a Login</option>');
		},

		onSetUp: function() {
			this.processToggle();
			this.processMenuModelCollection();

			this.$menuToggle.on("click", this.onClickMenuToggle);
			this.$contactTrigger.on("click", this.onClickRequestQuote);
			this.$genericContactTrigger.on("click", this.onClickRequestQuote);
			this.$accountSelect.on("change", this.onChangeAccountSelect);
			this.$close.on("click", this.onClickClose);
			this.model.on("change:isOpen", this.onChangeIsOpenModel, this);
			this.menuModelCollection.on("changeselectedmodel", this.onChangeSelectedMenuModelCollection, this);
		},

		onTearDown: function() {
			this.$veil.detach();

			this.$menu.css("display", "");
			this.$mainMenu.css("display", "");

			this.$menuToggle.off("click", this.onClickMenuToggle);
			this.$contactTrigger.off("click", this.onClickRequestQuote);
			this.$genericContactTrigger.on("click", this.onClickRequestQuote);
			this.$accountSelect.off("change", this.onChangeAccountSelect);
			this.$close.off("click", this.onClickClose);
			this.model.off("change:isOpen", this.onChangeIsOpenModel, this);
			this.menuModelCollection.off("changeselectedmodel", this.onChangeSelectedMenuModelCollection, this);
			this.$el.removeClass("is-open");
			$("body").css("overflow", "");
		},

		processToggle: function() {
			if(this.model.get("isOpen")) {
				this.$menu.css("display", "block");
				this.$veil.appendTo($("#root"));
				//console.dir(this.$el);
				this.$el.addClass("is-open");
				$("body").css("overflow", "hidden");
				this.$placer.scrollTop(0);
			}
			else {
				this.$placer.scrollTop(0); // Do this here otherwise the navbar will potentially be kept scrolled out of view on iOS 5
				this.$menu.css("display", "none");
				this.$veil.detach();
				this.menuModelCollection.clearSelection();
				//console.dir(this.$el);
				this.$el.removeClass("is-open");
				$("body").css("overflow", "");	
			}
		},

		processMenuModelCollection: function() {
			var selectedModel = this.menuModelCollection.selectedModel;
			if(selectedModel) {
				if(selectedModel.get("hasSubmenu")) {
					this.$mainMenu.css("display", "none");
				}
				else {
					// No action needed. Browser will just follow link
				}
			}
			else {
				this.$mainMenu.css("display", "block");
			}
		},

		onClickMenuToggle: function(event) {
			event.preventDefault();

			this.requestAQuote.hide();
			this.model.set("isOpen", !this.model.get("isOpen"));
		},

		onClickRequestQuote: function(event) {
			event.preventDefault();

			this.model.set("isOpen", false);
			this.requestAQuote.toggle();
			if(this.requestAQuote.model.get("isOpen")) {
				this.$el.addClass("is-open");
			}
			else {
				this.$el.removeClass("is-open");
			}
		},

		onChangeAccountSelect: function(event) {
			if(this.$accountSelect.val() != "#"){
				window.location = this.$accountSelect.val();
			}
		},

		onClickClose: function(event) {
			event.preventDefault();

			this.model.set("isOpen", false);
			if(this.model.get("isOpen")) {
				this.$el.addClass("is-open");
			}
			else {
				this.$el.removeClass("is-open");
			}
		},

		onChangeIsOpenModel: function(model, isOpen, options) {
			this.processToggle();
		},

		onChangeSelectedMenuModelCollection: function(model) {
			this.processMenuModelCollection();
		}

	});

	HamburgerMediaHelper.MenuButton = MediaHelper.extend({

		initialize: function(options) {
			_.bindAll(this,
				"onClickA"
			);

			this.$a = this.$("a");
		},

		onSetUp: function() {
			this.$a.on("click", this.onClickA);
		},

		onTearDown: function() {
			this.$a.off("click", this.onClickA);
		},

		onClickA: function(event) {
			if(this.model.get("hasSubmenu")) {
				event.preventDefault();
				this.model.set("selected", true);
			}
		}

	});

	HamburgerMediaHelper.Submenu = MediaHelper.extend({

		initialize: function(options) {
			_.bindAll(this,
				"onClickBreadcrumb"
			);

			this.$breadcrumb = this.$(".breadcrumb");
		},

		onSetUp: function() {
			this.update();
			this.$breadcrumb.on("click", this.onClickBreadcrumb);
			this.model.on("change:selected", this.onChangeSelectedModel, this);
		},

		onTearDown: function() {
			this.$el.css("display", "");
			this.$breadcrumb.off("click", this.onClickBreadcrumb);
			this.model.off("change:selected", this.onChangeSelectedModel, this);
		},

		update: function() {
			if(this.model.get("selected")) {
				this.$el.css("display", "block");
			}
			else {
				this.$el.css("display", "none");
			}
		},

		onClickBreadcrumb: function(event) {
			event.preventDefault();

			this.model.set("selected", false);
		},

		onChangeSelectedModel: function(model, selected, options) {
			this.update();
		}

	});

	HamburgerMediaHelper.Search = MediaHelper.extend({

		initialize: function(options) {
			_.bindAll(this,
				"onChangeInput",
				"onClickClear"
			);

			this.$textInput = this.$("input[type=text]");
			this.$clear = this.$(".clear");
		},

		onSetUp: function() {
			this.$textInput.on("change input paste propertychange", this.onChangeInput);
			this.$clear.on("click", this.onClickClear);
		},

		onTearDown: function() {
			this.$textInput.off("change input paste propertychange", this.onChangeInput);
			this.$clear.off("click", this.onClickClear);
		},

		onChangeInput: function() {
			this.$el.removeClass("is-filled");
		},

		onClickClear: function(event) {
			event.preventDefault();

			this.$textInput.val("");
			this.$textInput[0].focus();
			this.$el.removeClass("is-filled");
		}

	});

	return HamburgerMediaHelper;
	
});