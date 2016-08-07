/**
 * Created by roel.kok on 6/21/14.
 */
define([
	"underscore",
	"backbone",
	"lib/Env",
	"lib/Util",
	"lib/BaseView",
	"lib/SelectCollection"
],
function(
	_,
	Backbone,
	Env,
	Util,
	BaseView,
	SelectCollection
) {
	var FormTimeDropdown = BaseView.extend({
		initialize: function(options) {
			_.bindAll(this,
				"onClick"
			);
			this.$select = this.$("select");
			this.$label = this.$(".dropdown-title p");
			this.name = this.$select.attr("name");
			this.placeholderText = this.$label.text();
			this.list = new FormTimeDropdownList({
				select: this.$select
			});
			if(Env.IOS || Env.ANDROID) {
				this.$select.css("display", "block");
			}
			else {
				this.$el.on("click", this.onClick)
			}
			this.list.optionCollection.on("changeselectedmodel", this.onChangeSelectedModel, this);
		},
		getValue: function() {
			var value = "";
			if(this.list.optionCollection.selectedModel) {
				value = this.list.optionCollection.selectedModel.get("value");
			}
			return value;
		},
		clear: function() {
		    this.list.clear();
    
    // ISSUE AFL-68 FIX
		    this.$label.text("Select a Time");
		    this.$el.removeClass("has-selection");
		    this.$select.val("");
    // IISUE AFL-68 END
		},
		getOptionCollection: function() {
			return this.list.optionCollection;
		},
		setError: function(hasError) {
			if(hasError) {
				this.$el.addClass("has-error");
			}
			else {
				this.$el.removeClass("has-error");
			}
		},
		onClick: function(event) {
			event.preventDefault();
			this.setError(false);
			var isFixed = Util.isPositionFixed(this.el);
			var rect = this.el.getBoundingClientRect();
			this.list.setPosition({
				position: isFixed ? "fixed" : "absolute",
				top: rect.bottom + (isFixed ? 0 : $(window).scrollTop()),
				left: rect.right - 320 + (isFixed ? 0 : $(window).scrollLeft())
			});
			setTimeout(_.bind(function() {
				this.list.toggle();
			}, this), 0);
		},
		onChangeSelectedModel: function(selectedModel) {
			if(selectedModel) {
				this.$label.text(selectedModel.get("label"));
				this.$el.addClass("has-selection");
				this.$select.val(parseInt(selectedModel.get("value")));
			}
			else {
				this.$label.text(this.placeholderText);
				this.$el.removeClass("has-selection");
				this.$select.val("");
			}
			this.setError(false);
			this.trigger("change", this);
		}
	});
	var LIST_TEMPLATE = "<div class='col'>" +
		"	<div class='col-label'>Morning</div>" +
		"	<div class='time-list'></div>" +
		"</div>" +
		"<div class='col'>" +
		"	<div class='col-label'>Afternoon</div>" +
		"	<div class='time-list'></div>" +
		"</div>" +
		"<div class='col'>" +
		"	<div class='col-label'>Evening</div>" +
		"	<div class='time-list'></div>" +
		"</div>";
	var MORNING_CUT_OFF = 43200;
	var AFTERNOON_CUT_OFF = 57600;
	var MIDNIGHT_CUT_OFF = 7200;
	var FormTimeDropdownList = BaseView.extend({
		className: "w_time-dropdown-list",
		options: null,
		initialize: function(options) {
			_.bindAll(this,
				"onChangeSelect",
				"onClickBody",
				"onResizeWindow"
			);
			this.$select = $(options.select);
			this.model = new Backbone.Model({
				"isVisible": false
			});
			this.$el.append(LIST_TEMPLATE);
			this.$morningList = this.$(".time-list").eq(0);
			this.$afternoonList = this.$(".time-list").eq(1);
			this.$eveningList = this.$(".time-list").eq(2);
			this.options = [];
			this.optionCollection = new SelectCollection();
			this.$select.find("option").each(_.bind(function(i, el) {
				var $el = $(el);
				var value = $el.attr("value");
				var epochValue = value;
					value = new Date(parseInt(value)).getHours();
					value = value * 60 * 60;
					//console.log(value);
				var model = new Backbone.Model({
					label: $el.text(),
					value: epochValue
				});
				var $option = $("<a/>", {
					"href": "#"
				});
				if(value < MORNING_CUT_OFF && value > MIDNIGHT_CUT_OFF) {
					this.$morningList.append($option);
				}
				else if(value < AFTERNOON_CUT_OFF && value > MIDNIGHT_CUT_OFF) {
					this.$afternoonList.append($option);
				}
				else {
					this.$eveningList.append($option);
				}
				this.options.push(new FormTimeDropdownOption({
					el: $option,
					model: model
				}));
				this.optionCollection.add(model);
			}, this));
			this.$select.on("change", this.onChangeSelect);
			this.model.on("change:isVisible", this.onChangeIsVisible, this);
		},
		clear: function() {
			this.$select.prop("selectedIndex", -1);
			if(this.optionCollection.selectedModel) {
				this.optionCollection.selectedModel.set("selected", false);
			}
		},
		setPosition: function(position) {
			this.$el.css(position);
		},
		toggle: function() {
			this.model.set("isVisible", !this.model.get("isVisible"));
		},
		_show: function() {
			$(document.body).append(this.$el);
			setTimeout(_.bind(function() {
				$(document.body).on("click", this.onClickBody);
			}, this), 0);
			$(window).on("resize", this.onResizeWindow);
		},
		_hide: function() {
			this.$el.detach();
			$(document.body).off("click", this.onClickBody);
			$(window).off("resize", this.onResizeWindow);
		},
		onChangeSelect: function() {
			var option = this.optionCollection.findWhere({
				"value": this.$select.val()
			});
			if(option) {
				option.set("selected", true);
			}
			else {
				this.optionCollection.selectedModel.set("selected", false);
			}
		},
		onClickBody: function(event) {
			this.model.set("isVisible", false);
		},
		onResizeWindow: function() {
			this.model.set("isVisible", false);
		},
		onChangeIsVisible: function(model, value, options) {
			if(value) {
				this._show();
			}
			else {
				this._hide();
			}
		}
	});
	var FormTimeDropdownOption = BaseView.extend({
		initialize: function(options) {
			_.bindAll(this,
				"onClick"
			);
			this.$el.text(this.model.get("label"));
			this.$el.on("click", this.onClick);
		},
		onClick: function(event) {
			event.preventDefault();
			this.model.set("selected", true);
		}
	});
	return FormTimeDropdown;
});