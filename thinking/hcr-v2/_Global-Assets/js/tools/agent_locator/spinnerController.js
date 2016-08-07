define([
		'tools/agent_locator/core/eventBus'
	],
	function(eventBus) {

		var $container,
			$spinner,
			isSpinning = false,
			timedOutShowNextFrame,
			spinnerPositions = [
				'0 0',
				'-75px 0',
				'-150px 0',
				'-225px 0',
				'0 -75px',
				'-75px -75px',
				'-150px -75px',
				'-225px -75px'
			];

		function startSpinning() {

			isSpinning = true;

			$container.addClass('is-visible');
			showNextFrame();
		}

		function stopSpinning() {

			isSpinning = false;

			$container.removeClass('is-visible');
			clearTimeout(timedOutShowNextFrame);
		}

		function showNextFrame() {

			var nextFrame = spinnerPositions.shift();

			$spinner.css('backgroundPosition', nextFrame);

			spinnerPositions.push(nextFrame);

			if(isSpinning) {

				timedOutShowNextFrame = setTimeout(showNextFrame, 100);
			}
		}

		return {
			setup:function(){

				$container = $('.aal-loading');
				$spinner = $('.aal-loading-spinner');
			},

			startSpinning:startSpinning,
			stopSpinning:stopSpinning
		}
	}
);
