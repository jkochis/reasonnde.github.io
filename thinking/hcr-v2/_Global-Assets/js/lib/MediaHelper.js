/**
 * Created by roel.kok on 4/22/14.
 */

define([
	"underscore",
	"./BaseView"
],
function(
	_,
	BaseView
) {
	var MediaHelper = BaseView.extend({

		isActive: false,
		mediaQuery: null, // This needs to be set by the subclass (not needed when a child of another media helper). Also, move to static maybe? TODO Shorten comment because it's too long now. Just put a new line some where I don't care, but this is not readable


		constructor: function(options) {
			options || (options = {});
			this.parent = options.parent;
			this.childMediaHelpers = []
			BaseView.apply(this, arguments);
		},

		registerChildMediaHelper: function(child) {
			this.childMediaHelpers.push(child);
		},

		setUp: function() {
			this.isActive = true;
			for(var i = 0; i < this.childMediaHelpers.length; i++) {
				this.childMediaHelpers[i].setUp();
			}
			this.onSetUp();
		},

		tearDown: function() {
			this.isActive = false;
			for(var i = 0; i < this.childMediaHelpers.length; i++) {
				this.childMediaHelpers[i].tearDown();
			}
			this.onTearDown();
		},

		onSetUp: function() {},
		onTearDown: function() {}


	});

	return MediaHelper;
});