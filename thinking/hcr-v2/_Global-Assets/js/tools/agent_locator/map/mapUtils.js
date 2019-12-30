define([
		'gmaps',
		'tools/agent_locator/core/constants',
		'tools/agent_locator/core/dataHandler',
		'tools/agent_locator/core/eventBus',
		'tools/agent_locator/map/markerController'
	],
	function(gmaps, constants, dataHandler, eventBus, markerController) {

		var MAP_OPTIONS = {
				backgroundColor: '#bed3f5',
				zoom: 1,
				minZoom:constants.MIN_ZOOM,
				maxZoom:constants.MAX_ZOOM,
				center: new gmaps.LatLng(0, 0),
				disableDefaultUI: true,
				disableDoubleClickZoom: false,
				scrollwheel: false,
				draggable: true,
				keyboardShortcuts: false
			},
			currentZoom,
			overlayUtil,
			markers = [],
			geocoder = new gmaps.Geocoder(),
			map;

		function zoomToBounds(bounds) {

			map.fitBounds(bounds);
		}

		function zoomToUsZip(zipCode) {


			if(markers.length === 0) {

				addressGeoLookUp('United States ' + zipCode, function (result) {

					var zipLatLng;

					if(result && result.geometry.location) {

						zipLatLng = result.geometry.location;
						map.setCenter(zipLatLng);
						map.setZoom(14);
					}


				});

			} else {

				var bounds = new gmaps.LatLngBounds(),
					markerLatLng;

				for(var i = 0; i <  markers.length; i++) {

					markerLatLng = markers[i].position;

					bounds.extend(markerLatLng);
				}

				map.fitBounds(bounds);

				if(currentZoom > 14) {

					map.setZoom(14);
				}

			}
		}

		/**
		 * Center to latLng with a 30px offset down
		 * to visually center the marker better
		 */
		function centerToAgent(agentLatLng) {

			if(currentZoom < 14) {

				map.setZoom(14);
			}

			map.setCenter(getLatLngMarkerOffset(agentLatLng));
		}

		function getLatLngMarkerOffset(latLng) {


			var MARKER_OFFSET = -30;

			// get a projection to convert latLngs to pixel values and vice versa
			var	projection = overlayUtil.getProjection();


			// get the pixel location of the latLng
			var	px = projection.fromLatLngToDivPixel(latLng);

			// calculate the offset
			var	newPoint = new gmaps.Point(px.x, px.y + MARKER_OFFSET),
				newLatLng = projection.fromDivPixelToLatLng(newPoint);

			return newLatLng;
		}

		function zoomToUs() {


			addressGeoLookUp('United States', function (result) {

				if (result.geometry && result.geometry.viewport)  {

					map.fitBounds(result.geometry.viewport);

				} else if (result.geometry && result.geometry.bounds) {

					map.fitBounds(result.geometry.bounds);
				}
			});
		}

		function addressGeoLookUp(address, callback) {

			geocoder.geocode({'address': address}, function (results, status) {

				if (
					status == gmaps.GeocoderStatus.OK &&
					status != gmaps.GeocoderStatus.ZERO_RESULTS &&
					(results && results[0] && results[0].geometry)
				) {

					callback(results[0]);

				} else if(status == gmaps.GeocoderStatus.OVER_QUERY_LIMIT) {

					setTimeout(function(){
						addressGeoLookUp(address, callback)
					}, 1500);

				} else {
					callback(false)
				}
			});
		}

		function clearMarkers() {

			var marker,
				i;

			for (i = 0; i < markers.length; i++) {
				marker = markers[i];

				gmaps.event.clearInstanceListeners(marker);
				marker.setMap(null);
			}

			markers = [];
		}

		function addMarker(agentId, agentNumber, latLng) {

			var marker =  new markerController.Marker(agentId, agentNumber, latLng, map);

			gmaps.event.addListener(marker, 'click', onMarkerClick);
			markers.push(marker);

			return marker;
		}


		function resizeMap() {

			gmaps.event.trigger(map, 'resize');
		}

		function getDistance(latLngA, latLngB) {
			return Math.round((gmaps.geometry.spherical.computeDistanceBetween(latLngA, latLngB) * 0.000621371192) * 10) / 10;
		}

		function createLatLng(lat, long) {

			return new gmaps.LatLng(lat, long);
		}

		function zoomIn() {

			setZoom(currentZoom + 1);
		}

		function zoomOut() {

			setZoom(currentZoom - 1);
		}

		function setZoom(newZoom) {

			map.setZoom(newZoom);
		}

		function getZoom() {

			return currentZoom;
		}

		function onZoomChanged() {

			currentZoom = map.getZoom();
			eventBus.bus.trigger(eventBus.events.ZOOM_UPDATED, currentZoom);
		}

		function onMarkerClick(e) {

			var clickBounds = createClickBounds(this.position),
				zoomBounds = new gmaps.LatLngBounds(),
				inBoundsCount = 0,
				markerLatLng;

			// check how many markers are in the bounds
			for(var i = 0; i <  markers.length; i++) {

				markerLatLng = markers[i].position;

				if(clickBounds.contains(markerLatLng)) {
					inBoundsCount++;

					zoomBounds.extend(markerLatLng);
				}
			}

			if(inBoundsCount > 1) {

				map.fitBounds(zoomBounds);

			} else {

				eventBus.bus.trigger(eventBus.events.DETAIL_UPDATED, this.agentId);
				eventBus.bus.trigger(eventBus.events.VIEW_REQUESTED, constants.VIEW_STATE_DETAIL);
			}
		}

		function createClickBounds(latLng) {

			var offsetTop = -35 - currentZoom,
				offsetBottom = 35 + currentZoom,
				offsetLeft = -25 - currentZoom,
				offsetRight = 25 + currentZoom;


			// get a projection to convert latLngs to pixel values and vice versa
			var	projection = overlayUtil.getProjection();

			// get the pixel location of the latLng
			var	latLngPx = projection.fromLatLngToDivPixel(latLng);

			// calculate the top, right, bottom and left edges of the bounds
			var	boundsTopPx = latLngPx.y + offsetTop,
				boundsBottomPx = latLngPx.y + offsetBottom,
				boundsLeftPx = latLngPx.x + offsetLeft,
				boundsRightPx = latLngPx.x + offsetRight;

			// create latLng values from the corners of the bounds
			var boundsSouthWestLatLng = projection.fromDivPixelToLatLng(new gmaps.Point(boundsLeftPx, boundsBottomPx)),
				boundsNorthEastLatLng = projection.fromDivPixelToLatLng(new gmaps.Point(boundsRightPx, boundsTopPx));

			// Create actual bounds object to check for containing markers
			var bounds = new gmaps.LatLngBounds(boundsSouthWestLatLng, boundsNorthEastLatLng);

			return bounds;
		}

		return {

			setup:function($map){

				map = new gmaps.Map($map[0], MAP_OPTIONS);
				markerController.setup();
				gmaps.event.addDomListener(window, 'resize', resizeMap);
				gmaps.event.addListener(map, 'zoom_changed', onZoomChanged);

				overlayUtil = new gmaps.OverlayView();
				overlayUtil.onAdd = function(){};
				overlayUtil.draw = function(){};
				overlayUtil.setMap(map);
			},

			addTestMarker:function(latLng){

				new gmaps.Marker({
					position: latLng,
					map: map
				});
			},

			zoomIn:zoomIn,
			zoomOut:zoomOut,
			setZoom:setZoom,
			getZoom:getZoom,

			getDistance:getDistance,

			resizeMap:resizeMap,
			addMarker:addMarker,
			clearMarkers:clearMarkers,

			centerToAgent:centerToAgent,

			zoomToBounds:zoomToBounds,
			zoomToUsZip:zoomToUsZip,
			zoomToUs:zoomToUs,

			createLatLng:createLatLng,
			addressGeoLookUp:addressGeoLookUp
		}
	}
);