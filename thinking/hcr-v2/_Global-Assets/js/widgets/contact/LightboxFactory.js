/**
 * Created by roel.kok on 7/9/14.
 */

define([
	"lib/Env",
	"lib/Segments",
	"./AgentsLightbox",
	"./BrokersLightbox",
	"./EmployersLightbox",
	"./IndividualsLightbox"
],
function(
	Env,
	Segments,
	AgentsLightbox,
	BrokersLightbox,
	EmployersLightbox,
	IndividualsLightBox
) {

	var LightboxFactory = {

		create: function(options) {
			var lightbox;

			switch(Env.SEGMENT) {
				case Segments.INDIVIDUALS:
					lightbox = new IndividualsLightBox(options);
					break;
				case Segments.AGENTS:
					lightbox = new AgentsLightbox(options);
					break;
				case Segments.BROKERS:
					lightbox = new BrokersLightbox(options);
					break;
				case Segments.EMPLOYERS:
					lightbox = new EmployersLightbox(options);
					break;
			}

			return lightbox;
		}

	};

	return LightboxFactory;

});