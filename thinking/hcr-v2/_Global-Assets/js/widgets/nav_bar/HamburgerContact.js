define([
	"underscore",
	"backbone",  
    "lib/Env",
    "lib/Segments",
	"lib/MediaHelper",

	"widgets/contact/FormFactory"
],
function(
	_,
	Backbone,
    Env,
    Segments,
	MediaHelper,
	FormFactory
) {

	var HamburgerContact = MediaHelper.extend({

		initialize: function(options) {
			_.bindAll(this,
				"onClickTabNavItem",
				"onClickContactFormLink",
				"onClickClose"
			);

			this.model = new Backbone.Model({
				isOpen: false,
				currentTab: -1
			});

			this.$tabNavItems = this.$(".main-tab-nav a");
			this.$tabs = this.$(".main-tabs > .tab");
			this.$contactFormLink = this.$(".contact-form-link");
			this.$close = this.$(".close");
			this.$veil = $("<div/>", {
				"class": "veil"
			});

			this.form = FormFactory.create({
				el: this.$(".contact-tab")
			});

		},

		onSetUp: function() {
			this.model.on("change:isOpen", this.onChangeIsOpen, this);
			this.model.on("change:currentTab", this.onChangeCurrentTab, this);
			this.$tabNavItems.on("click", this.onClickTabNavItem);
			this.$contactFormLink.on("click", this.onClickContactFormLink);
			this.$close.on("click", this.onClickClose);

			this.model.set({
				isOpen: false,
				currentTab: 0
			});
		},

		onTearDown: function() {
			this.model.set({
				isOpen: false,
				currentTab: -1
			});

			this.$el.css("display", "");
//			this.$tabNavItems.removeClass("is-active");
//			this.$tabs.css("display", "");
			$("body").css("overflow", "");
			this.model.off("change:isOpen", this.onChangeIsOpen, this);
			this.model.off("change:currentTab", this.onChangeCurrentTab, this);
			this.$tabNavItems.off("click", this.onClickTabNavItem);
			this.$contactFormLink.off("click", this.onClickContactFormLink);
			this.$close.off("click", this.onClickClose);
		},

		toggle: function() {
			this.model.set("isOpen", !this.model.get("isOpen"));
		},

		hide: function() {
			this.model.set("isOpen", false);
		},

		onChangeIsOpen: function(model, value, options) {
			if(value) {

                switch(Env.SEGMENT) {
				case Segments.BROKERS:
                        this.model.set("currentTab", 0);
                        break;
                    default:
                        this.model.set("currentTab", 1);
                 }  
				if (window.utag) {
					utag.link({_ga_category: 'lead form',_ga_action: 'view',_ga_label: utag.data.form_type});
				}
				this.form.reset();
				this.$el.css("display", "block");
				$("html").css("overflow", "hidden");
				$("body").css("overflow", "hidden");
				this.$veil.appendTo($("#root"));
			}
			else {
				this.$el.css("display", "none");
				$("html").css("overflow", "");
				$("body").css("overflow", "");
				this.$veil.detach();
			}
		},

		onClickTabNavItem: function(event) {
			event.preventDefault();

			var target = event.delegateTarget;
			var index = this.$tabNavItems.index(target);

			this.model.set("currentTab", index);
		},

		onChangeCurrentTab: function(model, value, options) {
			this.$tabNavItems.removeClass("is-active");
			this.$tabNavItems.eq(value).addClass("is-active");
			this.$tabs.css("display", "none");
			this.$tabs.eq(value).css("display", "block");
		},

		onClickContactFormLink: function(event) {
			event.preventDefault();

			// TODO Not use a hardcoded value (1)
			this.model.set("currentTab", 1);
		},

		onClickClose: function(event) {
			event.preventDefault();

			this.hide();
		}

	});

	return HamburgerContact;

});