define([
		'tools/agent_locator/core/constants',
		'tools/agent_locator/core/eventBus',
		'tools/agent_locator/core/dataHandler',
		'tools/agent_locator/api/apiCaller',
		'tools/agent_locator/spinnerController'
	],
	function(constants, eventBus, dataHandler, apiCaller, spinner) {

		var $agentLocatorLi,
			$detailMainEl,
			$detailImageContainer,
			$detailImg,
			$detailName,
			$detailCityTitle,
			$detailAddress,
			$detailSpanish,
			$detailEverwell,
			$detailWebsite,
			$detailEmail,
			$detailProducts;


		function onDetailUpdated(e, agentId) {

			dataHandler.getAgentById(agentId, setData);
		}

		function setData(agentData) {

			if(agentData.image !== false) {
				
				loadProfileImage(agentData.image);
			} else {

				$detailImageContainer.addClass('is-fallback');
			}

			$detailName.html(agentData.name);
			$detailCityTitle.html(agentData.city + ', ' + agentData.state + '<br>' + agentData.title);
			if(agentData.phone != false){
				$detailAddress.html(
					agentData.address + '<br>' +
					agentData.city + ', ' + agentData.state + ' ' + agentData.zip + '<br>' +
					'<a href="tel:' + agentData.phone + '">' + agentData.phone + '</a>'
				);
			}else{
				$detailAddress.html(
					agentData.address + '<br>' +
					agentData.city + ', ' + agentData.state + ' ' + agentData.zip
				);
			}

			if(agentData.isSpanish) {

				$detailSpanish.show();
			} else {

				$detailSpanish.hide();
			}

			if(agentData.isEverwell) {

				$detailEverwell.show();
			} else {

				$detailEverwell.hide();
			}

			if(agentData.websiteUrl) {

				$detailWebsite.show();
				$detailWebsite.attr('href', agentData.websiteUrl);
			} else {

				$detailWebsite.hide();
			}

			$detailEmail.attr('href', 'mailto:' + agentData.email);

			apiCaller.agentLicenses(agentData.id, composeLicenseMarkup, onLicensesError);

		}

		// if for whatever reason this call fails, we'll just hide the products list
		function onLicensesError() {

			$detailMainEl.addClass('has-noLicenses');
		}

		function composeLicenseMarkup(agentLicenses) {

			if(agentLicenses.length) {

				$detailMainEl.removeClass('has-noLicenses');

				var markup = '';

				for(var i = 0; i < agentLicenses.length; i++) {

					markup += '<li>' + agentLicenses[i] + '</li>'
				}

				$detailProducts.html(markup);

			} else {

				$detailMainEl.addClass('has-noLicenses');
			}


		}

		function loadProfileImage(url) {


			$detailImageContainer.removeClass('is-fallback');

			$detailImg.attr('src', '')
				.css('display','none');
			
			
			var img = new Image();
			img.onload = function() {

				$detailImg.attr('width', this.width)
					.attr('height', this.height)
					.css({
						display:'',
						marginLeft:-this.width/2,
						marginTop:-this.height/2
					})
					.attr('src', url);
			};

			img.src = url;
		}

		return {
			setup:function(){

				$detailMainEl = $('.aal-detail');
				$detailImageContainer = $('.aal-detail-image');
				$detailImg = $('.js-detailImg');
				$detailName = $('.js-detailName');
				$detailCityTitle = $('.js-detailCityTitle');
				$detailAddress = $('.js-detailAddress');
				$detailSpanish = $('.js-detailSpanish');
				$detailEverwell = $('.js-detailEverwell');
				$detailWebsite = $('.js-detailWebsite');
				$detailEmail = $('.js-detailEmail');
				$detailProducts = $('.js-detailProducts');

				$('.aal-back').click(function(){

					eventBus.bus.trigger(eventBus.events.VIEW_REQUESTED, constants.VIEW_STATE_LIST);
				});

				eventBus.bus.on(eventBus.events.DETAIL_UPDATED, onDetailUpdated);
			}
		}
	}
);