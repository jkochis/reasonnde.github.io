

/**
 * Created by roel.kok on 7/12/14.
 */

define([
	"underscore",
	"lib/Env"
],
function(
	_,
	Env
) {

	var TextInputPlaceholder = function($textInput) {
		_.bindAll(this,
			"onClick",
			"onFocusInput",
			"onBlurInput"
		);
		this.$input = $textInput.find("input, textarea");
		/*this.$el = $("<" + this.$input[0].tagName + "/>", {
			"tabindex": -1,
			"unselectable": "on",
			"class": "faux-placeholder"
		});*/
		
		this.$el = $("<span>"+this.$input.attr("placeholder")+"</span>", {
			"tabindex": -1,
			"unselectable": "on",
			"class": "faux-placeholder"
		});
		//this.$el.val(this.$input.attr("placeholder"));
		this.updateStyles();
		setTimeout(_.bind(function() {
			this.updateStyles();
		}, this), 10);
		
		this.$el.insertBefore(this.$input);
	
		this.$el.on("mousedown", this.onClick);
		this.$input.on("focus", this.onFocusInput);
		this.$input.on("blur", this.onBlurInput);
		this.$input.blur();
	
	
	}

	
	_.extend(TextInputPlaceholder.prototype, {

		updateStyles: function() {
			this.$el.css(this.$input.css(["width", "height", "font", "padding-left", "text-align", "border-width", "box-sizing", "color"]));
			if(this.$input.val()) {
			 this.$el.css("display", "none");	
			}
		},

		onClick: function(event) {
			this.$input.trigger("focus");
		},

		onFocusInput: function() {
			this.$el.css("display", "none");
		},

		onBlurInput: function() {
			if(this.$input.val() == "") {
				this.$el.css("display", "block");
				this.$el.css("position", "absolute");
				this.$el.parent().css("position", "relative");
				this.$el.css("top", "13px");
			}
		}

	});
	

	return TextInputPlaceholder;


});
