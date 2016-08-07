/**
 * Created by roel.kok on 7/8/14.
 */

define([
	"underscore",
	"backbone",
	"lib/Env",
	"lib/BaseView",
	"./TextInputPlaceholder"
],
function(
	_,
	Backbone,
	Env,
	BaseView,
	TextInputPlaceholder
) {

	var FormTextArea = BaseView.extend({

		initialize: function(option) {
			_.bindAll(this,
				"onChangeTextArea"
			);

			this.$textarea = this.$("textarea");

			this.name = this.$textarea.attr("name");

			this.$textarea.on("change", this.onChangeTextArea);

			if(!Env.PLACEHOLDER && this.$textarea.attr("placeholder")) {
				this.placeholder = new TextInputPlaceholder(this.$el);
			}
		},

		clear: function() {
			this.$textarea.val("");
			this.$textarea.trigger("change");
		},

		getValue: function() {
			return this.$textarea.val();
		},

		setError: function(hasError) {
			if(hasError) {
				this.$el.addClass("has-error");
			}
			else {
				this.$el.removeClass("has-error");
			}
		},

		onChangeTextArea: function() {
			this.setError(false);
			this.trigger("change", this);
		}

	},
	{
		build: function() {
			$(".textarea").each(function(i, el) {
				var manual = $(el).data("manual");
				if(!manual || manual == "0" || manual == "false") {
					new FormTextArea({
						el: el
					});
				}
			});
		}
	});

	return FormTextArea;

});