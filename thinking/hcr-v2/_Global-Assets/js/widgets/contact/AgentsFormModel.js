/**
 * Created by roel.kok on 7/10/14.
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

    var AgentsFormModel = Backbone.Model.extend({

		defaults: {
			"firstname": "",
			"lastname": "",
			"addressline1": "",
			"addressline2": "",
			"zipcode": "",
			"phone": "",
			"email": "",
			"referer": "",
			"agentnumber": "",
			"spanish": false,
			"over18": false,
			"notover18": false,
			"subscriberIdList": "*=15584|NY=16082" 
		},

		validate: function(attr, options) {
			var invalidFields = [];
			var selection = false;
			_.each(["firstname", "lastname", "addressline1"], function(fieldName, index, list) {
				if(!attr[fieldName].match(/[a-zA-Z]+/)) {
					invalidFields.push(fieldName);
				}
			});
			
			if(!Util.validateZipCode(attr["zipcode"])) {
				invalidFields.push("zipcode");
			}

			if(!Util.validatePhone(attr["phone"])) {
				invalidFields.push("phone");
			}

			if(!Util.validateEmail(attr["email"])) {
				invalidFields.push("email");
			}

			if(!attr["over18"]) {
				invalidFields.push("over18");
				if(!attr["notover18"]) {
					invalidFields.push("notover18");
				}
			}
	
            if(!attr["referer"]){
                $("#referer > option").each(function() {
                        if($(this).attr('selected') === 'selected'){
                        selection = true;	
                        }
                });
                
                if(selection === false){
                invalidFields.push("referer");
                }
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

	return AgentsFormModel;

});