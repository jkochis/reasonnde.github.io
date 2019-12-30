/**
 * Created by roel.kok on 7/10/14.
 * modified on 1-27-15 by troy.mobley
 */

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

	var BrokersFormModel = Backbone.Model.extend({

		defaults: {
			"full_name": "",
			"company_name": "",
			//"address_line_1": "",
			"zipcode": "",
			"phone_number": "",
			"email_address": "" ,
			//"email_message": "",
			//"optin": ""
			
			// TM- 1-27-15  added new fields to array
			w_option_1: false,
			w_option_2: false,
			w_option_3: false 
		},

		validate: function(attr, options) {
			var invalidFields = [];

			_.each(["full_name", "company_name"/*, "address_line_1","email_message"*/], function (fieldName, index, list) {
				if(!attr[fieldName].match(/[a-zA-Z]+/)) {
					invalidFields.push(fieldName);
				}
			});
			
			// TM- 1-27-15 validate the new fields
			var w_options = ["w_option_1", "w_option_2", "w_option_3"];
			var noneChecked = true;
			_.each(w_options, function(fieldName, index, list) {
				if(attr[fieldName]) {
					noneChecked = false;
					return false;
				}
			});
			
			if(noneChecked) {
				invalidFields = invalidFields.concat(w_options);
			}
			// end
			

			if (!Util.validateZipCode(attr["zipcode"])) {
			    invalidFields.push("zipcode");
			}

			if (!Util.validatePhone(attr["phone_number"])) {
			    invalidFields.push("phone_number");
			}

			if (!Util.validateEmail(attr["email_address"])) {
			    invalidFields.push("email_address");
			}

			if(invalidFields.length > 0) {
				return {
					message: "Please complete all required fields and select at least one of the options below to continue.",
					fields: invalidFields
				}
			}
		}

	});

	return BrokersFormModel;

});
