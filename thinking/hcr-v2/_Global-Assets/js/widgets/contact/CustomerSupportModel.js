/**
 * Created by roel.kok on 7/17/14.
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
	var CustomerSupportModel = Backbone.Model.extend({
		defaults: {
			"first_name": "",
			"last_name": "",
			"company_name": "",
			"account_number": "",
			"city": "",
			"state": "",
			"zipcode": "",
			"email_address": "",
			"phone_number": "",
			"phone_number_ext": "",
			"request_message": "",
			"WcoFormId": "447ecb65-edc9-4aae-b0e7-70cfe21c9360"
		},
		validate: function(attr, options) {
			var invalidFields = [];
			_.each(["first_name", "last_name", "company_name", "city"], function (fieldName, index, list) {
				if(!attr[fieldName].match(/[a-zA-Z]+/)) {
					invalidFields.push(fieldName);
				}
			});
			if(!Util.validateZipCode(attr["zipcode"])) {
				invalidFields.push("zipcode");
			}
			if (!Util.validateEmail(attr["email_address"])) {
			    invalidFields.push("email_address");
			}
			if (!Util.validatePhone(attr["phone_number"])) {
			    invalidFields.push("phone_number");
			}
			if(attr["state"] == "") {
				invalidFields.push("state");
			}
			if(invalidFields.length > 0) {
				return {
					message: "Please complete all required fields to continue.",
					fields: invalidFields
				};
			}
		}
	});
	return CustomerSupportModel;
});