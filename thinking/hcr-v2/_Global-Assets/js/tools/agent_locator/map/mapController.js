define([
		'tools/agent_locator/core/constants',
		'tools/agent_locator/core/utils',
		'tools/agent_locator/core/dataHandler',
		'tools/agent_locator/core/eventBus',
		"lib/Env",
		"lib/MediaQueries"
	],
	function(constants, utils, dataHandler, eventBus, Env, MediaQueries) {

		var isXSmall,
			currentZip,
			currentAgentLatLng,
			currentState,
			mapUtils;

		function onDataZipUpdated(e, zipCode) {

			currentZip = zipCode;
		}

		function onListUpdated(e, agentList) {

			mapUtils.clearMarkers();


			if(agentList.length > 0) {

				parseAgentList(agentList);
			}

			resetMapZoom();
		}

		function parseAgentList(agentList) {

			var agent;

			var sortedAgentList = agentList.slice(0).sort(utils.sortByLatitude);


			for(var i = 0; i < sortedAgentList.length; i++) {

				agent = sortedAgentList[i];
				if(agent.latLng) {

					mapUtils.addMarker(agent.id, agent.number, agent.latLng);
				}
			}
		}

		function onListHover() {

		}

		function onDetailUpdated(e, agentId) {

			dataHandler.getAgentById(agentId, function(agentData){

				currentAgentLatLng = agentData.latLng;
			});
		}

		function onViewRequested(e, newViewState) {

			currentState = newViewState;
			resetMapZoom();
		}

		function onResize() {

			var newIsXSmall = getIsXSmall();

			if(newIsXSmall !== isXSmall) {

				isXSmall = newIsXSmall;

				resetMapZoom();
			}
		}

		function getIsXSmall() {

			return matchMedia(MediaQueries.X_SMALL).matches;
		}

		function resetMapZoom() {

			mapUtils.resizeMap();

			if(currentState === constants.VIEW_STATE_DETAIL) {

				mapUtils.centerToAgent(currentAgentLatLng);

			} else if(currentState === constants.VIEW_STATE_LIST) {

				if(currentZip) {

					mapUtils.zoomToUsZip(currentZip);

				} else {

					mapUtils.zoomToUs();
				}
			}
		}

		return {

			setup:function(mapUtilsRef){
				mapUtils = mapUtilsRef;
				mapUtils.zoomToUs();

				eventBus.bus.on(eventBus.events.DATA_ZIP_UPDATED, onDataZipUpdated);
				eventBus.bus.on(eventBus.events.AGENT_LIST_UPDATED, onListUpdated);
				eventBus.bus.on(eventBus.events.AGENT_LIST_HOVER, onListHover);
				eventBus.bus.on(eventBus.events.VIEW_REQUESTED, onViewRequested);
				eventBus.bus.on(eventBus.events.DETAIL_UPDATED, onDetailUpdated);

				if(!Env.IE8) {
					isXSmall = getIsXSmall();
					$(window).resize(onResize);
				}

				window.utils = mapUtils;
			}
		}
	}
);