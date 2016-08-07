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
	var EmployersFormContactInformationModel = Backbone.Model.extend({
		defaults: {
			"firstname": "",
			"lastname": "",
			"phone": "",
			"ext": "",
			"zipcode": "",
			"email": "",
			"add": false,
			"news": false,
			"language" : ""
		},
		validate: function(attr, options) {
			var invalidFields = [];
			_.each(["firstname", "lastname"], function(fieldName, index, list) {
				if(!attr[fieldName].match(/[a-zA-Z]+/)) {
					invalidFields.push(fieldName);
				}
			});
			
			if(!Util.validatePhone(attr["phone"])) {
				invalidFields.push("phone");
			}
			if(!Util.validateZipCode(attr["zipcode"])) {
				invalidFields.push("zipcode");
			}
			
			if(!Util.validateExtension(attr["ext"])) {
				//invalidFields.push("ext"); this field is optional
			}
		
			if(!Util.validateEmail(attr["email"])) {
				invalidFields.push("email");
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
	return EmployersFormContactInformationModel;
});