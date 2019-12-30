define([
	"underscore",
	"backbone",
	"lib/MediaQueries",
	"lib/WidgetView",
	"lib/MediaHelper",
	"lib/common_components/FormCheckbox",
	"lib/common_components/InfoboxPopup",
	"./Sidebar",
	"./contact/IndividualsInterestsStep",
	"./contact/IndividualsLightbox"
],
function(
	_,
	Backbone,
	MediaQueries,
	WidgetView,
	MediaHelper,
	FormCheckbox,
	InfoboxPopup,
	Sidebar,
	Form,
	IndividualsLightbox
) {
	var SidebarIndividuals = WidgetView.extend({
		initialize: function(options) {
			this.registerMediaHelper(DefaultMediaHelper);
		}
	},
	{
		selector: ".w_sidebar-individuals"
	});
	var DefaultMediaHelper = MediaHelper.extend({
		mediaQuery: MediaQueries.HEADER_DEFAULT,
		initialize: function(options) {
			_.bindAll(this,
				"onUpdateRoot",
                //"onScroll",
				"onClickManageAccountHeader",
				"onClickInterestFormHeader",
				"onClickContinueButton"
			);
			this.form = new Form({
				el: this.$(".interest-form")
			});
			this._manageAccount = this.$('.manage-account');
			this._manageAccountHeader = this.$('.ma-header');
			this._interestForm = this.$('.interest-form');
			this._interestFormHeader = this.$('.in-header');
			this._interests = this.$(".interests");
			// TODO Proper naming and selector
			this._continueButton = this.$(".interest-form .textbutton");
//			this.checkboxes = [];
//			this.$(".checkbox").each(_.bind(function(i, el) {
//				var checkbox = new FormCheckbox({
//					el: el
//				});
//				checkbox.on("change", this.onChangeCheckbox, this);
//				this.checkboxes.push(checkbox);
//			}, this));
			/*var initActive = 0;
			if(this.$el.hasClass("active") && initActive < 1){
				utag.link({_ga_category: 'lead form',_ga_action: 'view',_ga_label: utag.data.form_type});
				initActive++;
			}*/
		},
		onSetUp: function() {
			this.$el.on(Sidebar.UPDATE_EVENT, this.onUpdateRoot);
          //  this.$el.on(Sidebar.UPDATE_EVENT, this.onScroll);
			this._manageAccountHeader.on('click', this.onClickManageAccountHeader);
			this._interestFormHeader.on('click', this.onClickInterestFormHeader);
			this._continueButton.on("click", this.onClickContinueButton);
//			this.model.on("invalid", this.onInvalidModel, this);
		},
		onTearDown: function() {
			this.$el.off(Sidebar.UPDATE_EVENT, this.onUpdateRoot);
			this._manageAccountHeader.off("click", this.onClickManageAccountHeader);
			this._interestFormHeader.off('click', this.onClickInterestFormHeader);
			this._continueButton.off("click", this.onClickContinueButton);
//			this.model.off("invalid", this.onInvalidModel, this);
		},
//		onInvalidModel: function(model, error, options) {
//			console.log(error);
//
//			for(var i = 0; i < this.checkboxes.length; i++) {
//				var checkbox = this.checkboxes[i];
//				checkbox.setError(true);
//			}
//
//			var listBoundingRect = this._interests[0].getBoundingClientRect();
//			var infoboxPopup = new InfoboxPopup({
//				title: "Error",
//				message: error.message,
//				origin: {
//					top: (listBoundingRect.top + listBoundingRect.bottom) / 2 + $(window).scrollTop(),
//					left: listBoundingRect.left + $(window).scrollLeft()
//				},
//				error: true
//			});
//			infoboxPopup.show();
//		},
      /*  onScroll: function (){
            if(this.$el.hasClass("active")) {
					utag.link({_ga_category: 'lead form',_ga_action: 'view',_ga_label: utag.data.form_type});
			}
        },*/
		onUpdateRoot: function() {
			if(!this.$el.hasClass("active")) {
				// Collapsed
				this.form.removeErrors();
			}
		},
		onClickManageAccountHeader: function(event) {
    //event.preventDefault();
    //this._manageAccount.toggleClass('expanded');
    //this._interestForm.toggleClass('expanded');
		},
		onClickInterestFormHeader: function(event) {
			event.preventDefault();
			this._manageAccount.toggleClass('expanded');
			this._interestForm.toggleClass('expanded');
		},
//		onChangeCheckbox: function(checkboxView) {
//			// Clear all error states
//			for(var i = 0; i < this.checkboxes.length; i++) {
//				var checkbox = this.checkboxes[i];
//				checkbox.setError(false);
//			}
//
//			var name = checkboxView.name;
//			if(this.model.has(name)) {
//				this.model.set(name, checkboxView.getValue());
//			}
//		},
		onClickContinueButton: function(event) {
			event.preventDefault();
			if(this.form.model.isValid()) {
				var lightbox = new IndividualsLightbox({
					interestsData: _.clone(this.form.model.attributes)
				});
				lightbox.show();
			}
		}
	},
	{
		IE8: true
	});
	return SidebarIndividuals;
});