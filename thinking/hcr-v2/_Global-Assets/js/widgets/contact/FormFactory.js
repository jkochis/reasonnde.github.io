/**
 * Created by roel.kok on 7/11/14.
 */

define([
	"lib/Env",
	"lib/Segments",
	"./AgentsForm",
	"./BrokersForm",
	"./EmployersForm",
	"./IndividualsForm",
	"./GenericForm",
	"./ProvidersForm",
	"./FabForm"
],
function(
	Env,
	Segments,
	AgentsForm,
	BrokersForm,
	EmployersForm,
	IndividualsForm,
	GenericForm,
	ProvidersForm,
	FabForm
) {

	var FormFactory = {

		create: function(options) {
			var form;

			switch(Env.SEGMENT) {
				case Segments.AGENTS:
					form = new AgentsForm(options);
					break;
				case Segments.BROKERS:
					form = new BrokersForm(options);
					break;
				case Segments.EMPLOYERS:
					form = new EmployersForm(options);
					break;
				case Segments.INDIVIDUALS:
					form = new IndividualsForm(options);
					break;
			}

			return form;
		},
		createGenericForm: function(options) {
			var form;

					form = new GenericForm(options);

			return form;
		},
		createFabForm: function(options) {
			var form;

					form = new FabForm(options);

			return form;
		},
		createProvidersForm: function(options) {
			var form;

					form = new ProvidersForm(options);

			return form;
		}

	};
	FormFactory.createGenericForm();
	FormFactory.createFabForm();
	FormFactory.createProvidersForm();
	return FormFactory;
	

});