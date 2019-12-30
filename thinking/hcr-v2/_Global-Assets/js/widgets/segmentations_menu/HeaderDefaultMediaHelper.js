/**
 * Created by roel.kok on 5/28/14.
 */

define([
	"underscore",
	"lib/Env",
	"lib/MediaHelper",
	"lib/MediaQueries",
	"lib/common_components/FormDropdown"
],
function(
	_,
	Env,
	MediaHelper,
	MediaQueries,
	FormDropdown
) {
	// This Media Helper is mainly (only) about the login dropdown
	var HeaderDefaultMediaHelper = MediaHelper.extend({

		mediaQuery: MediaQueries.HEADER_DEFAULT,

		initialize: function(options) {
			_.bindAll(this,
				"onClickLogin"
			);

			this.$login = this.$(".w_segmenu__top-right .login");
			this.$loginSelect = this.$(".w_segmenu__top-right .login select");

			this.$loginSelect.prop("selectedIndex", -1);

			this.loginDropdownList = new FormDropdown.List({
				select: this.$loginSelect[0]
			});
			this.loginDropdownList.optionCollection.on("change:selected", this.onChangeSelectedModel, this);
		},

		onSetUp: function() {
			if(Env.IOS || Env.ANDROID) {
				this.$loginSelect.css("display", "block");
			}
			else {
				this.$login.on("click", this.onClickLogin);
			}
		},

		onTearDown: function() {
			this.loginDropdownList.hide();

			if(Env.IOS || Env.ANDROID) {
				this.$loginSelect.css("display", "none");
			}
			else {
				this.$login.off("click", this.onClickLogin);
			}
		},

		onClickLogin: function(event) {
			event.preventDefault();

			var rect = this.$login[0].getBoundingClientRect();
			this.loginDropdownList.setDimensions({
				top: rect.bottom + $(window).scrollTop() + 11,
				right: $(window).width() - rect.right + $(window).scrollLeft() - 20
			});
			this.loginDropdownList.toggle();
		},

		onChangeSelectedModel: function(model, value, options) {
			if(value) {
				// Redirect
				window.location = model.get("value");
			}
		}

	},
	{
		IE8: true
	});

	return HeaderDefaultMediaHelper;
});
	

