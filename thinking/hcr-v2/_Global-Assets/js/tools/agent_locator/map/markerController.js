define([
		'tools/agent_locator/core/eventBus'
	],
	function(eventBus){

		function Marker(agentId, number, point, map) {

			var markerHtml = '<div class="aal-marker-shadow"></div><div class="aal-marker-hitField"><div class="aal-marker-label">'+number+'</div></div>',
				isActive = false,
				markerEl = document.createElement('div'),
				$markerHitFieldEl,
				$markerEl;


			eventBus.bus.on(eventBus.events.AGENT_LIST_HOVER, onListHover);
			eventBus.bus.on(eventBus.events.DETAIL_UPDATED, onDetailUpdated);

			function onListHover(e, agentId) {

				checkActive(agentId);
			}

			function onDetailUpdated(e, agentId) {

				checkActive(agentId);
			}

			function checkActive(activeId){

				if(activeId === agentId) {

					activate();

				} else {

					deactivate();
				}
			}

			markerEl.className = 'aal-marker';
			markerEl.innerHTML = markerHtml;

			$markerEl = $(markerEl);
			$markerHitFieldEl = $markerEl.find('.aal-marker-hitField')
				.on('click', onMarkerClick)
				.hover(onMarkerHover, onMarkerOut);

			function onMarkerHover() {

				eventBus.bus.trigger(eventBus.events.AGENT_LIST_HOVER, agentId);
			}

			function onMarkerOut() {

				eventBus.bus.trigger(eventBus.events.AGENT_LIST_HOVER, false);
			}


			var self = this;
			// Now initialize all properties.
			self.position = point;
			self._point = point;
			self._map = map;
			self._div = null;
			self._$markerEl = $(markerEl);
			self.agentId = agentId;

			self.setMap(map);


			self.dispose = function() {

				eventBus.bus.off(eventBus.events.AGENT_LIST_HOVER, onListHover);
				eventBus.bus.off(eventBus.events.DETAIL_UPDATED, onDetailUpdated);
				$markerHitFieldEl.off('click', onMarkerClick);
			};

			function onMarkerClick() {

				google.maps.event.trigger(self, 'click');
			}

			function activate() {

				if(!isActive) {

					isActive = true;
					self._$markerEl.addClass('is-active');
				}
			}

			function deactivate() {

				if(isActive) {

					isActive = false;
					self._$markerEl.removeClass('is-active');
				}
			}
		}

		return {
			setup:function(){

				this.Marker = Marker;

				Marker.prototype = new google.maps.OverlayView();

				Marker.prototype.draw = function() {

					var overlayProjection = this.getProjection();
					var pixelPoint = overlayProjection.fromLatLngToDivPixel(this._point);
					var div = this._div;

					div.style.left = (pixelPoint.x) + 'px';
					div.style.top = (pixelPoint.y) + 'px';
				};


				/**
				 * onAdd is called when the map's panes are ready and the overlay has been
				 * added to the map.
				 */
				Marker.prototype.onAdd = function() {

					var self = this;
					this._div = this._$markerEl[0];


					// Add the element to the "overlayLayer" pane.
					var panes = this.getPanes();
					panes.overlayMouseTarget.appendChild(this._div);

				};

				// The onRemove() method will be called automatically from the API if
				// we ever set the overlay's map property to 'null'.
				Marker.prototype.onRemove = function() {
					this._div.parentNode.removeChild(this._div);
					this._div = null;
				};
			}
		};
	}
);