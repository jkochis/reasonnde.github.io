
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

	var GenericFormModel = Backbone.Model.extend({

		defaults: {},

		validate: function(attr, options) {
			var invalidFields = [];

			_.each(["first_name","last_name","city"], function (fieldName, index, list) {
								//console.log(fieldName);
				if(typeof attr[fieldName] === 'string'){
					if(!attr[fieldName].match(/[a-zA-Z]+/)) {
						invalidFields.push(fieldName);
					}
				}
			});
			//console.dir(attr)

		/*	if (!Util.validatePhone(attr["evening_phone"])) {
			    invalidFields.push("evening_phone");
			}
		*/	
			if(typeof attr["state"] === 'string'){
				if(!attr["state"]){
					invalidFields.push("state");
				}
			}
			if(typeof attr["title"] === 'string'){
				if(!attr["title"]){
					invalidFields.push("title");
				}
			}
			if(typeof attr["request_type"] === 'string'){
				if(!attr["request_type"]){
					invalidFields.push("request_type");
				}
			}
			if(typeof attr["address_line_1"] === 'string'){			
				if(!attr["address_line_1"]){
					invalidFields.push("address_line_1");
				}
			}
			if(typeof attr["request_message"] === 'string'){
				if(!attr["request_message"]){
					invalidFields.push("request_message");
				}
			}
			if(typeof attr["approval_to_use_story"] === 'string'){
				if(!attr["approval_to_use_story"]){
					invalidFields.push("approval_to_use_story");
				}
			}
			if(typeof attr["zipcode"] === 'string'){
				if (!Util.validateZipCode(attr["zipcode"])) {
					invalidFields.push("zipcode");
				}
			}
			if(typeof attr["date_of_birth"] === 'string'){
				if (!Util.validateDOB(attr["date_of_birth"])) {
					invalidFields.push("date_of_birth");
				}
			}
			if(typeof attr["day_phone"] === 'string'){
				if (!Util.validatePhone(attr["day_phone"])) {
					invalidFields.push("day_phone");
				}
			}
			if(typeof attr["phone_us"] === 'string'){
				if (!Util.validatePhone(attr["phone_us"])) {
					invalidFields.push("phone_us");
				}
			}
			if(typeof attr["phone_number"] === 'string'){
				if (!Util.validatePhone(attr["phone_number"])) {
					invalidFields.push("phone_number");
				}
			}
			if(typeof attr["email_address"] === 'string'){			
				if (!Util.validateEmail(attr["email_address"])) {
					invalidFields.push("email_address");
				}
			}
			if(typeof attr["confirm_email_address"] === 'string'){
				if (!Util.validateEmail(attr["confirm_email_address"])) {
					invalidFields.push("confirm_email_address");
				}
			}
			if(typeof attr["confirm_email_address"] === 'string' && typeof attr["email_address"] === 'string' ){
				if (attr["email_address"] !== attr["confirm_email_address"]) {
					invalidFields.push("email_address");
					invalidFields.push("confirm_email_address");
				}
			}
			if(invalidFields.length > 0) {
				return {
					message: "Please complete all required fields and select at least one of the options below to continue.",
					fields: invalidFields
				}
			}
		}

	});

	return GenericFormModel;

});
