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

	var ProvidersFormModel = Backbone.Model.extend({

		defaults: {
			"policy_number": "",
			"ada_codes": ""
		},

		validate: function(attr, options) {
			
			function validatePolicyNumber(inputValue) {
				// alphanumeric from 1 to 8 chars
				var r = new RegExp("^([a-zA-Z0-9]){1,8}$");
				result = r.test(inputValue);
				return result;
			}
			function validateAdaCode(inputValue) {
				// alphanumeric 5 chars
				var r = new RegExp("^([a-zA-Z0-9]){5}$");
				result = r.test(inputValue);
				return result;
			}

			var invalidFields = [];
			var isCodesValid = true;
			$('form#dental-providers').find('input[name="ada_code"]').each(function (index) {
                if (index == 0) {
                    isCodesValid = validateAdaCode(this.value);
                }
                else {
                    if (this.value !== '' && isCodesValid) {
                        isCodesValid = validateAdaCode(this.value);
                    }
                }
            });

			if(!validatePolicyNumber($('form#dental-providers').find('input[name="policy_number"]').val())){

					invalidFields.push("policy_number");
				
			}
			if (!isCodesValid) {

					invalidFields.push("ada_code");
				
			}

			if(invalidFields.length > 0) {
				return {
					message: "Please complete all required fields.",
					fields: invalidFields
				}
			}
			
			
			
			
		}

	});

	return ProvidersFormModel;

});