/**
 * Created by roel.kok on 4/23/14.
 */

define([
	"underscore",
	"./Env",
	"./BaseView"
],
function(
	_,
	Env,
	BaseView
) {
	var WidgetView = BaseView.extend({

		constructor: function(options) {
			this.construct.apply(this, arguments);
		},

		// Yeah nice name. I know.
		construct: function() {this.mediaHelpers = [];
			BaseView.apply(this, arguments);
			this.testMediaHelpers();
			// TODO Maybe not to this by default for all views?
			$(window).on("resize", _.bind(function() {
				this.testMediaHelpers();
			}, this));
		},

		registerMediaHelper: function(mediaHelper, options) {
			if(typeof mediaHelper == "object") {
				this.mediaHelpers.push(mediaHelper);
			}
			else if(typeof mediaHelper == "function") {
				options || (options = {});
				var opts = _.extend({
					parent: this,
					el: this.el
				}, options);
				this.mediaHelpers.push(new mediaHelper(opts));
			}
		},

		testMediaHelpers: function() {
			var setUpQueue = [];
			var tearDownQueue = [];
			for(var i = 0; i < this.mediaHelpers.length; i++) {
				var helper = this.mediaHelpers[i];
				if(matchMedia(helper.mediaQuery).matches) {
					if(!helper.isActive) {
						setUpQueue.push(helper);
					}
				}
				else {
					if(helper.isActive) {
						tearDownQueue.push(helper);
					}
				}
			}

			// Make sure tear down of irrelevant helpers happens before setting up new helpers
			// Tear down
			for(var i = 0; i < tearDownQueue.length; i++) {
				tearDownQueue[i].tearDown();
			}
			// Set up
			for(var i = 0; i < setUpQueue.length; i++) {
				setUpQueue[i].setUp();
			}
		}

	});


	$(document).ready(function() {
		// Modify WidgetView prototype for IE
		if(Env.IE8) {
			_.extend(WidgetView.prototype, {
				construct: function(options) {
					this.mediaHelpers = [];
					BaseView.apply(this, arguments);
					this.testMediaHelpers();
				},

				registerMediaHelper: function(mediaHelper, options) {
					if(typeof mediaHelper == "object") {
						if(mediaHelper.constructor.IE8) {
							this.mediaHelpers.push(mediaHelper);
						}
					}
					else if(typeof mediaHelper == "function") {
						if(mediaHelper.IE8) {
							options || (options = {});
							var opts = _.extend({
								parent: this,
								el: this.el
							}, options);
							this.mediaHelpers.push(new mediaHelper(opts));
						}
					}
				},

				// This will only happen once now since we don't respond to screen size changes in IE8
				testMediaHelpers: function() {
					var setUpQueue = [];
					var tearDownQueue = [];
					for(var i = 0; i < this.mediaHelpers.length; i++) {
						var helper = this.mediaHelpers[i];
						if(!helper.isActive) {
							// This will happen once
							setUpQueue.push(helper);
						}
						else {
							// And this will never happen
							tearDownQueue.push(helper);
						}
					}

					// Make sure tear down of irrelevant helpers happens before setting up new helpers
					// Tear down
					for(var i = 0; i < tearDownQueue.length; i++) {
						tearDownQueue[i].tearDown();
					}
					// Set up
					for(var i = 0; i < setUpQueue.length; i++) {
						setUpQueue[i].setUp();
					}
				}
			});
		}
	});

	return WidgetView;
});

