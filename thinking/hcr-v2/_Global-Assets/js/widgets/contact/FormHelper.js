/**
 * Created by roel.kok on 7/10/14.
 */

define([
	"backbone",
	"lib/BaseView",
	"lib/common_components/FormInputText",
	"lib/common_components/FormTextArea",
	"lib/common_components/FormCheckbox",
	"lib/common_components/FormDropdown"
],
function(
	Backbone,
	BaseView,
	FormInputText,
	FormTextArea,
	FormCheckbox,
	FormDropdown
) {

	var FormHelper = BaseView.extend({

		initialize: function(options) {
			this.inputs = [];
			this.$(".input-text").each(_.bind(function(i, el) {
				var inputText = new FormInputText({
					el: el
				});
				inputText.on("change", this.onChangeInput, this);
				inputText.trigger("change", inputText);
				this.inputs.push(inputText);
			}, this));
			this.$(".textarea").each(_.bind(function(i, el) {
				var textArea = new FormTextArea({
					el: el
				});
				textArea.on("change", this.onChangeInput, this);
				this.inputs.push(textArea);
			}, this));
			this.$(".checkbox").each(_.bind(function(i, el) {
				var checkbox = new FormCheckbox({
					el: el
				});
				checkbox.on("change", this.onChangeInput, this);
				this.inputs.push(checkbox);
			}, this));
			this.$(".dropdown-box").each(_.bind(function(i, el) {
				var dropdown = new FormDropdown({
					el: el
				});
				dropdown.on("change", this.onChangeInput, this);
				this.inputs.push(dropdown);
			}, this));
		},

		reset: function() {
			for(var i = 0; i < this.inputs.length; i++) {
				this.inputs[i].clear();
			}
		},

		removeErrors: function() {
			for(var i = 0; i < this.inputs.length; i++) {
				this.inputs[i].setError(false);
			}
		},

		setError: function(fields) {
			//console.dir(fields);
			for(var i = 0; i < this.inputs.length; i++) {
				var input = this.inputs[i];
				//console.dir(input);
				if(_.contains(fields, input.name)) {
					input.setError(true);
				}
				else {
					input.setError(false);
				}
			}
		},
		setDentalError: function(fields) {
			//console.dir(fields);
			var prevInput = '';
			for(var i = 0; i < this.inputs.length; i++) {
				var input = this.inputs[i];
				//console.dir(input);
				if(input.name !== prevInput){
					if(_.contains(fields, input.name)) {
						input.setError(true);
					}
					else {
						input.setError(false);
					}
				}
				prevInput = input.name;
			}
		},

		onChangeInput: function(inputView) {
			var name = inputView.name;
			if(this.model.has(name)) {
				this.model.set(name, inputView.getValue());
			}
		}

	});

	return FormHelper;

});