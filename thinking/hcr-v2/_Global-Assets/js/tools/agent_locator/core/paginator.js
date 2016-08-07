define([

		'tools/agent_locator/core/eventBus'

	], function(eventBus) {

	var data = [],
		currentIndex = 0,
		PAGE_COUNT = 10;


	function setData(newData) {

		data = newData.slice(0);

		paginate(0);
	}

	function goto(pageId) {

		paginate(pageId * PAGE_COUNT);
	}


	function paginate(begin) {

		if(begin < 0) {

			begin = 0;

		} else if(begin >= data.length) {

			begin = currentIndex;
		}

		var end = begin + PAGE_COUNT,
			paginatedData;


		paginatedData = data.slice(begin, end);


		var currentPage = Math.ceil(begin/PAGE_COUNT),
			maxPage = Math.ceil(data.length/PAGE_COUNT)-1;


		eventBus.bus.trigger(eventBus.events.AGENT_LIST_UPDATED, [paginatedData]);
		eventBus.bus.trigger(eventBus.events.AGENT_LIST_PAGINATION, [currentPage, maxPage]);

		currentIndex = begin;
	}

	return {

		setData:setData,

		goto:goto
	}

});