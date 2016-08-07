/**
 * Created by roel.kok on 4/24/14.
 */

define([
	"backbone"
],
function(
	Backbone
) {
	var SelectCollection = Backbone.Collection.extend({

		selectedModel: null,

		initialize: function() {
			this.on("change:selected", this.onChangeSelectModel, this);
		},

		clearSelection: function() {
			if(this.selectedModel) {
				this.selectedModel.set("selected", false);
			}
		},

		onChangeSelectModel: function(model, selected, options) {
			if(selected) {
				var oldModel = this.selectedModel;
				this.selectedModel = model;
				if(oldModel) {
					oldModel.set("selected", false);
				}

				this.trigger("changeselectedmodel", this.selectedModel);
			}
			else if(model == this.selectedModel) {
				this.selectedModel = null;
				this.trigger("changeselectedmodel", this.selectedModel);
			}
		}

	});

	return SelectCollection;
});