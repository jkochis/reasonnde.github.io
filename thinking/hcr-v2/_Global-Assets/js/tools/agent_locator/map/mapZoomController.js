define([
		'tools/agent_locator/core/constants',
		'tools/agent_locator/core/eventBus'
	],
	function(constants, eventBus){

		var dragMaxStep = constants.MAX_ZOOM - constants.MIN_ZOOM,
			gutterHeight,
			mapUtils,
			dragStartOffset,
			zoomStartOffset,
			$window,
			$zoomIn,
			$zoomOut,
			$zoomHandle,
			$gutter;

		function onZoomInClick() {

			mapUtils.zoomIn();
		}

		function onZoomOutClick() {

			mapUtils.zoomOut();
		}

		function onZoomUpdated(e, zoomLevel) {
			
			var zoomPercentage = 1 - Math.max(0, Math.min(1, (zoomLevel - constants.MIN_ZOOM)/dragMaxStep));

			$zoomHandle.css('top', (zoomPercentage*100) + '%');
		}

		function onStartDragging(e) {

			zoomStartOffset = mapUtils.getZoom();
			dragStartOffset = e.pageY;
			$window.mousemove(onDragging);
			$zoomHandle.off('mousedown', onStartDragging);
			$window.mouseup(onStopDragging);
		}

		function onDragging(e) {

			var offsetY = dragStartOffset - e.pageY,
				gutterOffset = offsetY / gutterHeight,
				zoomOffset = Math.round(gutterOffset * dragMaxStep);

			mapUtils.setZoom(zoomStartOffset + zoomOffset);

		}

		function onStopDragging() {

			$window.off('mousemove',onDragging);
			$window.off('mouseup', onStopDragging);
			$zoomHandle.mousedown(onStartDragging);
		}

		return {

			setup:function(mapUtilsRef){

				mapUtils = mapUtilsRef;
				$window = $(window);

				$zoomIn = $('.aal-map-zoom-btn--in')
					.click(onZoomInClick);

				$zoomOut = $('.aal-map-zoom-btn--out')
					.click(onZoomOutClick);

				$zoomHandle = $('.aal-map-zoom-handle')
					.mousedown(onStartDragging);

				$gutter = $('.aal-map-zoom-gutter');

				gutterHeight = $gutter.height();

				eventBus.bus.on(eventBus.events.ZOOM_UPDATED, onZoomUpdated)
			}
		}
	}
);