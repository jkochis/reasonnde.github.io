define(function() {

	var $eventBus;

	return {

		setup:function(){

			$eventBus = $({});
			this.bus = $eventBus;
		},

		events:{

			// data events
			DATA_ZIP_UPDATED:'DATA_ZIP_UPDATED',

			AGENT_LIST_UPDATED:'AGENT_LIST_UPDATED',
			AGENT_LIST_PAGINATION:'AGENT_LIST_PAGINATION',
			AGENT_LIST_HOVER:'AGENT_LIST_HOVER',

			// view events
			VIEW_REQUESTED:'VIEW_REQUESTED',

			// detail events
			DETAIL_UPDATED:'DETAIL_UPDATED',

			// map events
			ZOOM_UPDATED:'ZOOM_UPDATED'
		},

		bus:false // is set during setup
	};
});