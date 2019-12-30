/**
 * Created by roel.kok on 7/10/14.
 */

define([
	"backbone"
],
function(
	Backbone
) {

	var StepNavModel = Backbone.Model.extend({

		defaults: function() {
			return {
				steps: [],
				index: -1,
				complete: false
			};
		},

		next: function() {
			if(!this.get("complete")) {
				var index = this.get("index");
				var currentModel = this.get("steps")[index];
				if(currentModel && currentModel.isValid()) {
					if(index == this.get("steps").length - 1) {
						this.set("complete", true);
						var indexA = index + 1;
						if (window.utag) {
							utag.link({_ga_category: 'lead form',_ga_action: 'step '+indexA+':  submit click',_ga_label: utag.data.form_type});
						}
						
					//	console.log("submit "+indexA);
					}
					else {
						this.set("index", index + 1);
						var indexA = index + 1;
						if (window.utag) {
							utag.link({_ga_category: 'lead form',_ga_action: 'step '+indexA+':  next click',_ga_label: utag.data.form_type});
						}
						
				//	console.log("next "+indexA);	
					}
				}
			}
		},

		back: function() {
			var index = this.get("index");
			if(index > 0) {
				this.set("index", index - 1);
				var indexA = index + 1;
			//	console.log("back "+indexA); 
				if (window.utag) {
					utag.link({_ga_category: 'lead form',_ga_action: 'step '+indexA+':  back click',_ga_label: utag.data.form_type});
				}
			}
		},

		goto: function(index) {
			// TODO
		}

	});

	return StepNavModel;


});