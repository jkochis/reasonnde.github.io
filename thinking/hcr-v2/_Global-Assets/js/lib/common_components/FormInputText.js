define([
	"underscore",
	"lib/Env",
	"lib/BaseView",
	"./TextInputPlaceholder"
],
function(
	_,
	Env,
	BaseView,
	TextInputPlaceholder
) {
	var FormInputText = BaseView.extend({

		initialize : function() {
			_.bindAll(this,
				"onChangeInput"
			);

			this.$input = this.$("input");

			this.name = this.$input.attr("name");

			this.$input.on("change", this.onChangeInput);

			if(!Env.PLACEHOLDER && this.$input.attr("placeholder")) {
				this.placeholder = new TextInputPlaceholder(this.$el);
			}
		},

		clear: function() {
			this.$input.val("");
			this.$input.trigger("change");
		},

		getValue: function() {
			return this.$input.val();
		},

		setValue: function(value) {
			this.$input.val(value);
			this.$input.trigger("change");
		},

		setError: function(hasError) {
			if(hasError) {
				this.$el.addClass("has-error");
			}
			else {
				this.$el.removeClass("has-error");
			}
		},

		onChangeInput: function() {
			this.setError(false);
			this.trigger("change", this);
		}
	},
	{
		build: function() {
			$(".input-text").each(function(i, el) {
				var manual = $(el).data("manual");
				if(!manual || manual == "0" || manual == "false") {
					new FormInputText({
						el: el
					});
				}
			});
		}
	});



	return FormInputText;
});