'use strict';

/* globals define */

define(['underscore', 'backbone', 'lib/Util'], function(_, Backbone, Util) {
	var BrokersFormModel = Backbone.Model.extend({
		defaults: {
			'firstname': '',
			'lastname': '',
			'email': '',
			'email_confirm': '',
			'story': ''
		},

		validate: function(attr) {
			var invalidFields = [];

			_.each(['firstname', 'lastname', 'story'], function(fieldName) {
				if(!attr[fieldName].match(/[a-zA-Z]+/)) {
					invalidFields.push(fieldName);
				}
			});

			if(!Util.validateEmail(attr.email)) {
				invalidFields.push('email');
			}

			if(!Util.validateEmail(attr.email_confirm)) {
				invalidFields.push('email_confirm');
			}

			if(attr.email !== attr.email_confirm) {
				invalidFields.push('email');
				invalidFields.push('email_confirm');
			}

			if(invalidFields.length > 0) {
				return {
					message: 'Please complete all required fields to continue.',
					fields: invalidFields
				};
			}
		}
	});

	return BrokersFormModel;
});