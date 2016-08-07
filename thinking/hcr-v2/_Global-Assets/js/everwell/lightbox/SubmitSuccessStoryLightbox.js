/* globals define */

'use strict';

define(['underscore', 'lib/Util', 'lib/BaseView', 'lib/LightboxHelper', '../widgets/form/SubmitSuccessForm'],
function(_, Util, BaseView, LightboxHelper, SubmitSuccessForm) {

	var SubmitSuccessStoryLightbox = BaseView.extend({
		initialize: function() {
			_.bindAll(this, 'onClickClose');

			this.setElement(Util.loadTemplate('everwell-lightbox-success-story-tpl'));

			this.lightboxHelper = new LightboxHelper({
				el: this.el
			});

			this.form = new SubmitSuccessForm({
				el: this.$('.form-section')
			});

			this.$close = this.$('.close');
			this.$close.on('click', this.onClickClose);
			this.$close.on('touchstart', this.onClickClose);
		},
		reset: function (){
			this.form.reset();
		},

		show: function() {
			this.lightboxHelper.show();
			if(this.form.sizeFakeInputs) {
				this.form.sizeFakeInputs();				
			}
		},

		hide: function() {
			this.lightboxHelper.hide();
		},

		onClickClose: function(event) {
			event.preventDefault();
			this.hide();
		}
	});

	return SubmitSuccessStoryLightbox;

});