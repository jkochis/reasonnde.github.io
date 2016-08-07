define([
	"underscore",
	"lib/BaseView"
],
function(
	_,
	BaseView
) {


	var FormCheckbox = BaseView.extend({

		name: null,

		initialize : function() {
			_.bindAll(this,
				"onChangeInput"
			);

			this.$input = this.$("input[type=checkbox]");
			this.name = this.$input.attr("name");

			this.$input.on("change", this.onChangeInput);

			this.update();
		},

		clear: function() {
			this.$input.prop("checked", false);
			this.$input.trigger("change");
		},

		setValue: function(value) {
			this.$input.prop("checked", value);
			//disabled to solve error on agents form. Re-enable if errors appear on other checkboxes.
			this.$input.trigger("change");
		},

		getValue: function() {
			return this.$input.prop("checked");
		},

		setError: function(hasError) {
			if(hasError) {
				this.$el.addClass("has-error");
			}
			else {
				this.$el.removeClass("has-error");
			}
		},

		update: function() {
			if(this.$input.prop("checked")) {
				this.$el.addClass("is-checked");
			}
			else {
				this.$el.removeClass("is-checked");
			}
		},

		onChangeInput: function(event) {
			this.update();
			this.setError(false);
			this.trigger("change", this);
		}
	},
	{
		build: function() {
			$(".checkbox").each(function(i, el) {
				var manual = $(el).data("manual");
				if(!manual || manual == "0" || manual == "false") {
					new FormCheckbox({
						el: el
					});
				}
			});
		}
	});

	return FormCheckbox;
});
