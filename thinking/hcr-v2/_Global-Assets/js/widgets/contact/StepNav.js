/**
 * Created by roel.kok on 6/26/14.
 */

define([
	"underscore",
	"lib/Env",
	"lib/Segments",
	"lib/BaseView"
],
function(
	_,
	Env,
	Segments,
	BaseView
) {

	var StepNavView = BaseView.extend({

		initialize: function(options) {
			_.bindAll(this,
				"onClickBack",
				"onClickNext",
				"onClickSubmit"
			);

			this.$back = this.$(".back");
			this.$next = this.$(".next");
			this.$submit = this.$(".submit");

			this.$back.on("click", this.onClickBack);
			this.$next.on("click", this.onClickNext);
			this.$submit.on("click", this.onClickSubmit);

			this.model.on("change:index", this.onChangeIndex, this);
		},

		onChangeIndex: function(model, value, options) {
			if(value < 1) {
				this.$back.css("display", "none");
			}
			else {
				this.$back.css("display", "");
			}

			if(value == this.model.get("steps").length - 1) {
				this.$next.css("display", "none");
				this.$submit.css("display", "block");
			}
			else {
				this.$next.css("display", "");
				this.$submit.css("display", "");
			}
		},

		onClickBack: function(event) {
			event.preventDefault();

			this.model.back();
		},

		onClickNext: function(event) {
			event.preventDefault();

			if(Env.SEGMENT !== "individuals")
			{
			this.model.next();
			}
		},

		onClickSubmit: function(event) {
			event.preventDefault();

			this.model.next();
		}

	});

	return StepNavView;

});