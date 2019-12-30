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

	var FabFormModel = Backbone.Model.extend({

		defaults: {
			//"email_lookup": "",
			/*"first_name": "",
			"middle_name": "",
			"last_name": "",
			"firm": "",
			"firm_address": "",
			"firm_address2": "",
			"country": "",
			"city": "",
			"state": "",
			"zipcode": "",
			"phone": "",
			"fax": "",
			"email": "",
			"contact_name": "",
			"contact_phone": "",
			"contact_email": "",
			"name_badge": "",
			"meal_request": "",*/
			"yesmeet": false,
			"nomeet": false,
			"yeseatlunch": false,
			"noeatlunch": false,
			//"additional_topics": ""
		},


		validate: function(attr, options) {

			var invalidFields = [];

			_.each(["first_name", "last_name", "firm", "firm_address", "city"], function (fieldName, index, list) {
				if(!attr[fieldName].match(/[a-zA-Z]+/)) {
					invalidFields.push(fieldName);
				}
			});
			
			_.each(["zipcode"], function (fieldName, index, list) {
				if(!attr[fieldName].match(/[a-zA-Z0-9\s-]+/)) {
					invalidFields.push(fieldName);
				}
			});
			
			_.each(["phone"], function (fieldName, index, list) {
				if(!attr[fieldName].match(/[0-9\s\./+-]+/)) {
					invalidFields.push(fieldName);
				}
			});
			
			//if (!Util.validateEmail(attr["email_lookup"])) {
			//    invalidFields.push("email_lookup");
			//}

			if (!Util.validateEmail(attr["email"])) {
			    invalidFields.push("email");
			}
			
            if(!attr["country"]){
				cselection = false;
                $("#country > option").each(function() {
                        if($(this).attr('selected') === 'selected'){
                        cselection = true;	
                        }
                });
                
                if(cselection === false){
                invalidFields.push("country");
                }
            }
			
            if(!attr["states"]){
				sselection = false;
                $("#country > option").each(function() {
                        if($("select#country option:selected").val() === 'United States'){
							$("#states > option").each(function() {
								if($(this).attr('selected') === 'selected'){
									sselection = true;	
								}
							});
							
							if(sselection === false){
								invalidFields.push("states");
							}
                        }
                });
            }
			
			var eating_lunch = ["yeseatlunch", "noeatlunch"];
			var noLunchChecked = true;
			_.each(eating_lunch, function(fieldName, index, list) {
				if(attr[fieldName]) {
					noLunchChecked = false;
					return false;
				}
			});
			if(noLunchChecked) {
				invalidFields = invalidFields.concat(eating_lunch);
			}
			
			var wed_meeting = ["yesmeet", "nomeet"];
			var noMeetingChecked = true;
			_.each(wed_meeting, function(fieldName, index, list) {
				if(attr[fieldName]) {
					noMeetingChecked = false;
					return false;
				}
			});
			if(noMeetingChecked) {
				invalidFields = invalidFields.concat(wed_meeting);
			}

			if(invalidFields.length > 0) {
				return {
					message: "Please complete all required fields and select at least one of the options below to continue.",
					fields: invalidFields
				}
			}
		}

	});

	return FabFormModel;

});