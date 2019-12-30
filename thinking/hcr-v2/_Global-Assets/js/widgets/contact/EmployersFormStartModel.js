define([
	"underscore",
	"backbone",
	"lib/Util"
],
function(
	_,
	Backbone,
	Util
) {
	var EmployersFormStartModel = Backbone.Model.extend({
		defaults: {
			"employeecount": "",
			"business": "",
			"individual": false,
			"group": false,
			"findout": false
		},
		validate: function(attr, options) {
			var invalidFields = [];
			if(attr["employeecount"] == "" ) {
				invalidFields.push("employeecount");
			}
			
			if (!Util.isSpanish()) {
				if (attr["employeecount"] == "2"){
					return {
						message: 'For companies with fewer than three employees, please check out our individual and family coverage.',
						fields: invalidFields
					};
				}
			} else {
				if (attr["employeecount"] == "2"){
					return {
						message: 'Para las empresas con menos de tres empleados, por favor visite nuestra individual y cobertura familiar.',
						fields: invalidFields
					};
				}
			}
			if(!attr["business"].match(/[a-zA-Z]+/)) {
				invalidFields.push("business");
			}
			var interests = ["individual", "group", "findout"];
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
						message: "Please complete all required fields to continue.",
						fields: invalidFields
					};
				}
			} else {
				if(invalidFields.length > 0) {
					return {
						message: "Por favor, complete todos los campos necesarios para continuar.",
						fields: invalidFields
					};
				}
			}
		}
	});
	return EmployersFormStartModel;
});