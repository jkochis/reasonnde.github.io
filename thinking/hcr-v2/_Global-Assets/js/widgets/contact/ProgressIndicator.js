/**
 * Created by roel.kok on 7/12/14.
 */


define([
	"lib/BaseView"
],
function(
	BaseView
) {

	var ProgressIndicator = BaseView.extend({

		initialize: function(options) {
			this.model.on("change:index", this.onChangeCurrent, this);
			this.update();
		},

		update: function() {
			this.$(".is-current").removeClass("is-current");
			this.$("li").eq(this.model.get("index")).addClass("is-current");
		},

		onChangeCurrent: function(model, value, options) {
			this.update();
		}

	});

	return ProgressIndicator;

});