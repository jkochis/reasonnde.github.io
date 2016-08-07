/**
 * Created by roel.kok on 7/7/14.
 */

define([
	"underscore",
	"lib/Util",
	"lib/MediaQueries",
	"lib/WidgetView",
	"lib/MediaHelper",
	"./Sidebar",
	"./contact/EmployersStartStep",
	"./contact/EmployersLightbox"
],
function(
	_,
	Util,
	MediaQueries,
	WidgetView,
	MediaHelper,
	Sidebar,
	Form,
	EmployersLightbox
) {

	var SidebarEmployers = WidgetView.extend({

		initialize: function(options) {
			this.registerMediaHelper(DefaultMediaHelper);
		}

	},
	{
		selector: ".w_sidebar-employers"
	});

	var DefaultMediaHelper = MediaHelper.extend({

		mediaQuery: MediaQueries.HEADER_DEFAULT,

		initialize: function(options) {
			_.bindAll(this,
				"onClickManageAccountHeader",
				"onClickInterestFormHeader",
				"onClickContinueButton",
				"onUpdateRoot"
			);

			this.form = new Form({
				el: this.$el
			});

			this.$continueButton = this.$(".submit");
			this._manageAccount = this.$('.manage-account');
			this._manageAccountHeader = this.$('.ma-header');
			this._interestFormHeader = this.$('.in-header');
			this._interestForm = this.$('.interest-form');
		},

		onSetUp: function() {
			this._manageAccountHeader.on('click', this.onClickManageAccountHeader);
			this._interestFormHeader.on('click', this.onClickInterestFormHeader);
			this.$continueButton.on("click", this.onClickContinueButton);
			this.$el.on(Sidebar.UPDATE_EVENT, this.onUpdateRoot);
		},

		onTearDown: function() {
			this._manageAccountHeader.off("click", this.onClickManageAccountHeader);
			this._interestFormHeader.off('click', this.onClickInterestFormHeader);
			this.$continueButton.off("click", this.onClickContinueButton);
			this.$el.off(Sidebar.UPDATE_EVENT, this.onUpdateRoot);
		},

		onClickManageAccountHeader: function(event) {
			//event.preventDefault();
window.open('http://www.google.com');
			//this._manageAccount.toggleClass('expanded');
			//this._interestForm.toggleClass('expanded');
		},

		onClickInterestFormHeader: function(event) {
			event.preventDefault();

			this._manageAccount.toggleClass('expanded');
			this._interestForm.toggleClass('expanded');
		},

		onClickContinueButton: function(event) {
			event.preventDefault();

			if(this.form.model.isValid()) {
				var lightbox = new EmployersLightbox({
					startStepData: _.clone(this.form.model.attributes)
				});
				lightbox.show();
			}
		},

		onUpdateRoot: function() {
			if(!this.$el.hasClass("active")) {
				// Collapsed
				this.form.removeErrors();
			}
		}

	},
	{
		IE8: true
	});

	return SidebarEmployers;

});