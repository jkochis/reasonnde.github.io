/**
 * Created by roel.kok on 5/15/14.
 */

define([
	"underscore",
	"lib/BaseView"
],
function(
	_,
	BaseView
) {
	// Alternative to FormInputText that might work better in some situations
	var FormInputTextAlt = BaseView.extend({

		initialize: function(options) {
			_.bindAll(this,
				"onFocusInput",
				"onBlurInput"
			);

			this.placeholderText = this.$el.data("placeholder");

			this.$input = this.$("input");
			this.$placeholder = $("<span/>", {
				"class": "placeholder"
			});
			this.$placeholder.text(this.placeholderText);
			this.$placeholder.prependTo(this.el);

			this.$input.on("focus", this.onFocusInput);
			this.$input.on("blur", this.onBlurInput);

			this.checkEmpty();
		},

		checkEmpty: function() {
			this.isEmpty = $.trim(this.$input.val()) == "";
			if(this.isEmpty) {
				this.$el.addClass("is-empty");
			}
		},

		onFocusInput: function() {
			this.$el.removeClass("is-empty");
		},

		onBlurInput: function() {
			this.checkEmpty();
		}


	},
	{
		build: function() {
			$(".input-text-alt").each(function(i, el) {
				new FormInputTextAlt({
					el: el
				});
			});
		}
	});

	return FormInputTextAlt;
});

