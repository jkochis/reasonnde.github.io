/**
 * Created by roel.kok on 4/21/14.
 */

define([
	"underscore",
	"backbone"
],
function(
	_,
	Backbone
) {
	// Ugly shim. Would rather fix this somehow with the Browserify config
	// But this is kinda nice too since we now use jquery from a cdn
//	Backbone.$ = $;

	var BaseView = Backbone.View.extend({});

	return BaseView;
});


