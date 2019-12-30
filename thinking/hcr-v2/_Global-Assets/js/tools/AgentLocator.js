define([
		'lib/WidgetView',
		'tools/agent_locator/core/constants',
		'tools/agent_locator/core/eventBus',
		'tools/agent_locator/core/dataHandler',
		'tools/agent_locator/core/utils',
		'tools/agent_locator/api/apiCaller',
		'tools/agent_locator/spinnerController',
		'tools/agent_locator/forms/checkboxController',
		'tools/agent_locator/forms/zipCodeController',
		'tools/agent_locator/listController',
		'tools/agent_locator/detailController',
		'tools/agent_locator/map/mapController',
		'tools/agent_locator/map/mapZoomController'
	],
	function(
			WidgetView,
			constants,
			eventBus,
			dataHandler,
			utils,
			apiCaller,
			spinnerController,
			checkboxController,
			zipCodeController,
			listController,
			detailController,
			mapController,
			mapZoomController
		) {

		var everwellIsPreChecked,
			agentParameter,
			$locator,
			mapUtils,
			currentState;

		function onViewRequested(e, requestedState) {

			var CLASS_HOME = 'is-home',
				CLASS_LIST = 'is-list',
				CLASS_DETAIL = 'is-detail',
				addedClass,
				removedClasses;

			if(currentState !== requestedState) {

				currentState = requestedState;

				switch(currentState) {

					case constants.VIEW_STATE_HOME:

						addedClass = CLASS_HOME;
						removedClasses = CLASS_LIST + ' ' + CLASS_DETAIL;

						break;
					case constants.VIEW_STATE_LIST:

						addedClass = CLASS_LIST;
						removedClasses = CLASS_HOME + ' ' + CLASS_DETAIL;

						break;
					case constants.VIEW_STATE_DETAIL:

						addedClass = CLASS_DETAIL;
						removedClasses = CLASS_LIST + ' ' + CLASS_HOME;

						break;

				}

				$locator.addClass(addedClass)
					.removeClass(removedClasses);
			}
		}

		function parseUrl() {

			var everwellParam = utils.getUrlParameter('everwell'),
				dataParam = utils.getUrlParameter('data');

			everwellIsPreChecked = everwellParam === 'only';
			agentParameter = utils.getUrlParameter('agent');

			if(dataParam === 'fake') {

				apiCaller.setIsFaked(true);
			}
		}

		var AgentLocator = WidgetView.extend({

				initialize: function () {

					// load gmaps async to reduce unwanted API requests
					// when initialized we setup the other modules to make sure
					// code is only executed when ready
					require(['tools/agent_locator/map/mapUtils'], function(mapUtilsRef) {

						parseUrl();

						// order is important
						mapUtils = mapUtilsRef;
						eventBus.setup();
						spinnerController.setup();
						mapUtils.setup($('.aal-map-container'));
						eventBus.bus.on(eventBus.events.VIEW_REQUESTED, onViewRequested);

						checkboxController.setup(everwellIsPreChecked);
						zipCodeController.setup();
						detailController.setup();
						mapController.setup(mapUtils);
						mapZoomController.setup(mapUtils);
						apiCaller.setup(mapUtils);
						listController.setup();

						if(agentParameter) {

							spinnerController.startSpinning();
							dataHandler.getAgentById(agentParameter,function(agentData){

								if(agentData && agentData.zip) {

									dataHandler.setZip(agentData.zip, function() {

										// make sure the requested agent is in the list
										dataHandler.addAgent(agentData);


										eventBus.bus.trigger(eventBus.events.DETAIL_UPDATED, agentData.id);
										eventBus.bus.trigger(eventBus.events.VIEW_REQUESTED, constants.VIEW_STATE_DETAIL);
										spinnerController.stopSpinning();
									}, spinnerController.stopSpinning);
								}
							}, spinnerController.stopSpinning);
						}
					});
				}
			},
			{
				build: function() {

					$locator = $('.aal');

					if($locator.length) {
						new AgentLocator();
					}
				}
			});

		return AgentLocator;
	});


