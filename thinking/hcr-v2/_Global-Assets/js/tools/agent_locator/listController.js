define([
		'tools/agent_locator/core/constants',
		'tools/agent_locator/core/eventBus',
		'tools/agent_locator/core/dataHandler',
		'tools/agent_locator/core/paginator'
	],
	function(constants, eventBus, dataHandler, paginator) {

		var $window,
			$list,
			$listPagination,
			$listPaginators,
			$listContainer,
			$listNoResults,
			$filter,
			$aalLi;

		function onListUpdated(e, agentList) {

			var listHtml = '';


			for(var i = 0; i < agentList.length; i++) {

				listHtml += createAgentLi(agentList[i]);
			}


			$listContainer.html(listHtml);
			$aalLi.off();
			$aalLi = $('.aal-li')
				.click(onLiClick)
				.hover(onLiMouseOver, onLiMouseOut);

			if(agentList.length <= 0) {
				$listNoResults.addClass('is-visible');
			} else {
				$listNoResults.removeClass('is-visible');
			}
		}

		function onLiClick() {

			var clickedId = $(this).attr('data-id');

			eventBus.bus.trigger(eventBus.events.DETAIL_UPDATED, clickedId);
			eventBus.bus.trigger(eventBus.events.VIEW_REQUESTED, constants.VIEW_STATE_DETAIL);
		}

		function onLiMouseOver() {

			var hoverId = $(this).attr('data-id');

			eventBus.bus.trigger(eventBus.events.AGENT_LIST_HOVER, hoverId);
		}

		function onLiMouseOut() {

			eventBus.bus.trigger(eventBus.events.AGENT_LIST_HOVER, false);
		}

		function onListHover(e, agentId) {

			$aalLi.each(function(index, el){

				var $el = $(el),
					dataId = parseInt($el.attr('data-id'));

				if(agentId === dataId) {

					$el.addClass('is-active');

				} else {

					$el.removeClass('is-active');
				}

			})

		}

		function createAgentLi(data) {


		if(data.phone != false){	return '<li class="aal-li" data-id="'+data.id+'">' +
					'<div class="aal-li-index">' +
						data.number +
					'</div>' +
					'<div class="aal-li-card">' +
						'<b>' + data.name + '</b>' +
						'<p>' + data.city + ', ' + data.state +'<br> ' + data.title +' </p>' +				
						'<a>'+data.phone+'</a>' +
					'</div>' +
					'<div class="aal-li-info">' +
						'<ul class="aal-li-icons">' +
							'<li class="aal-li-icons-icon aal-li-icons-icon--spanish' + (data.isSpanish ? ' is-visible' : '') + '"></li>' +
							'<li class="aal-li-icons-icon aal-li-icons-icon--everwell' + (data.isEverwell ? ' is-visible' : '') + '"></li>' +
						'</ul>' +
						'<div class="aal-li-distance">'+data.distanceLabel+'</div>' +
					'</div>' +
				'</li>';
			}
			else{
				return '<li class="aal-li" data-id="'+data.id+'">' +
					'<div class="aal-li-index">' +
						data.number +
					'</div>' +
					'<div class="aal-li-card">' +
						'<b>' + data.name + '</b>' +
						'<p>' + data.city + ', ' + data.state +'<br> ' + data.title +' </p>' +
					'</div>' +
					'<div class="aal-li-info">' +
						'<ul class="aal-li-icons">' +
							'<li class="aal-li-icons-icon aal-li-icons-icon--spanish' + (data.isSpanish ? ' is-visible' : '') + '"></li>' +
							'<li class="aal-li-icons-icon aal-li-icons-icon--everwell' + (data.isEverwell ? ' is-visible' : '') + '"></li>' +
						'</ul>' +
						'<div class="aal-li-distance">'+data.distanceLabel+'</div>' +
					'</div>' +
				'</li>';
			}
		}


		function onListPagination(e, currId, maxId) {


			backToTop();

			var markup = '';


			$listPaginators.off();
			$listPaginators = null;

			var indexes = [],
				i;


			if(maxId === 0) {

				// do nothing

			} else if(maxId < 7) {


				i = 0;

				while(i <= maxId) {

					indexes.push(i);
					i++;
				}

			// at the beginning
			} else if(currId  < 4) {

				indexes.push(0, 1, 2, 3, maxId);


			// at the end
			} else if(currId >= maxId - 3) {


				indexes.push(0, maxId - 3, maxId - 2, maxId - 1, maxId);

			// in the middle
			} else {

				indexes.push(0, currId - 1, currId, currId + 1, maxId);

			}

			var previousIndex = null,
				diff,
				targetIndex,
				index;

			for(i = 0; i < indexes.length; i++) {

				index = indexes[i];
				if(previousIndex !== null) {

					diff = index - previousIndex;

					if(diff > 2) {

						if(previousIndex === 0) {

							targetIndex = index - 2;

						} else {

							targetIndex = previousIndex + 2;

						}

						markup += createPaginationNumber(targetIndex, '...', false);
					}
				}

				markup += createPaginationNumber(index, index + 1, index === currId);

				previousIndex = index;
			}

			if(currId !== 0) {

				markup = createPaginationArrow(currId-1, false) + markup;
			}

			if(currId !== maxId) {

				markup += createPaginationArrow(currId+1, true);
			}

			$listPagination.html(markup);
			$listPaginators = $('.js-paginator').on('click touch', onPaginatorClick);
		}

		function onPaginatorClick(e) {

			e.preventDefault();
			var $this = $(this);
			paginator.goto($this.attr('data-index'));
		}

		function createPaginationArrow(index, isNext) {

			var markup = '<a class="aal-list-pagination-number js-paginator aal-list-pagination-number--';
			markup += isNext ? 'next' : 'previous';
			markup += '" data-index="'+index+'" href="#"></a>';

			return markup;
		}

		function createPaginationNumber(index, label, isActive) {

			var markup = '<a class="aal-list-pagination-number js-paginator';

			if(isActive) {
				markup +=  ' is-active';
			}

			markup += '" data-index="'+index+'" href="#">'+label+'</a>';

			return markup;
		}

		function backToTop() {

			$list.scrollTop(0);
			$window.scrollTop(0);
		}

		return {
			setup:function(){

				$aalLi = $({});

				$window = $(window);
				$filter = $('.aal-filter');
				$list = $('.aal-list');
				$listContainer = $('.aal-listContainer');
				$listNoResults = $('.aal-list-noResults');
				$listPagination = $('.aal-list-pagination');
				$listPaginators = $();

				eventBus.bus.on(eventBus.events.AGENT_LIST_UPDATED, onListUpdated);
				eventBus.bus.on(eventBus.events.AGENT_LIST_PAGINATION, onListPagination);
				eventBus.bus.on(eventBus.events.AGENT_LIST_HOVER, onListHover);
			}
		}
	}
);