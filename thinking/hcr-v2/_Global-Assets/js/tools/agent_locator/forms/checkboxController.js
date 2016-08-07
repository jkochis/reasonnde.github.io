define([
		'tools/agent_locator/core/dataHandler'
	],
	function(dataHandler) {

		var IS_VISIBLE_CLASS = 'is-visible',
			FILTER_EXPENDED_CLASS = 'aal--filterExpended',
			IS_CHECKED_CLASS = 'is-checked',
			$aal,
			$spanishTooltip,
			$inputSpanish,
			$inputEverwell,
			$everwellTooltip;

		function showSpanishTooltip() {

			$spanishTooltip.addClass(IS_VISIBLE_CLASS);
		}

		function hideSpanishTooltip() {

			$spanishTooltip.removeClass(IS_VISIBLE_CLASS);
		}

		function showEverwellTooltip() {

			$everwellTooltip.addClass(IS_VISIBLE_CLASS);
		}

		function hideEverwellTooltip() {

			$everwellTooltip.removeClass(IS_VISIBLE_CLASS);
		}

		function onEverWellChange(e) {

			var isChecked = $inputEverwell.is(':checked');

			dataHandler.setEverwellFilter(isChecked);

			if(isChecked) {

				$inputEverwell.parent().addClass(IS_CHECKED_CLASS);

			} else {

				$inputEverwell.parent().removeClass(IS_CHECKED_CLASS);
			}
		}

		function onSpanishChange(e) {

			var isChecked = $inputSpanish.is(':checked');

			dataHandler.setSpanishFilter(isChecked);

			if(isChecked) {

				$inputSpanish.parent().addClass(IS_CHECKED_CLASS);

			} else {

				$inputSpanish.parent().removeClass(IS_CHECKED_CLASS);
			}
		}

		function onFilterToggleClick() {


			if($aal.hasClass(FILTER_EXPENDED_CLASS)) {

				$aal.removeClass( FILTER_EXPENDED_CLASS );
				$inputEverwell.prop('checked', false);
				$inputSpanish.prop('checked', false);
				dataHandler.resetFilters();

			} else {

				$aal.addClass( FILTER_EXPENDED_CLASS );
			}
		}


		return {
			setup:function(everwellIsPreChecked){

				$aal = $('.aal');

				$spanishTooltip = $('.aal-toolTip--notification.is-spanish');
				$everwellTooltip = $('.aal-toolTip--notification.is-everwell');

				$inputEverwell = $('.js-inputEverwell').change(onEverWellChange);
				$inputSpanish = $('.js-inputSpanish').change(onSpanishChange);

				$('.aal-filter-toggle').click(onFilterToggleClick);

				$('.aal-filter-option.is-spanish').hover(showSpanishTooltip, hideSpanishTooltip);
				$('.aal-filter-option.is-everwell').hover(showEverwellTooltip, hideEverwellTooltip);

				if(everwellIsPreChecked) {

					$aal.addClass( FILTER_EXPENDED_CLASS );

					$inputEverwell.prop('checked', true);
					dataHandler.setEverwellFilter(true);
				}
			}
		}
	}
);