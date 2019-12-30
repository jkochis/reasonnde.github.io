/**
 * Created by roel.kok on 7/15/14.
 */
define([
	"backbone",
	"lib/Util"
],
function(
	Backbone,
	Util
) {
	var IndividualsInterestsModel = Backbone.Model.extend({
		defaults: {
			offering_1: false,
			offering_2: false,
			offering_3: false,
			offering_4: false,
			offering_5: false
		},
		validate: function(attr, options) {
			var invalidFields = [];
			var interests = ["offering_1", "offering_2", "offering_3", "offering_4", "offering_5"];
			var noneChecked = true;
			_.each(interests, function(fieldName, index, list) {
				if(attr[fieldName]) {
					noneChecked = false;
					return false;
				}
			});
			if(noneChecked) {
				invalidFields = invalidFields.concat(interests);
			}
			if (!Util.isSpanish()) {
				if(invalidFields.length > 0) {
					return {
						message: "Please select at least one Aflac insurance product.",
						fields: invalidFields
					};
				}
			} else {
				if(invalidFields.length > 0) {
					return {
						message: "Por favor seleccione al menos un producto de Aflac.",
						fields: invalidFields
					};
				}
			}
		}
	});
	return IndividualsInterestsModel;
});