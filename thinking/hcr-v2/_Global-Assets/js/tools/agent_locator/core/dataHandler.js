define([
		'tools/agent_locator/core/eventBus',
		'tools/agent_locator/spinnerController',
		'tools/agent_locator/core/constants',
		'tools/agent_locator/core/paginator',
		'tools/agent_locator/api/apiCaller'
], function (eventBus, spinner, constants, paginator, apiCaller) {
    var currentData = [],
        currentRadius = constants.DEFAULT_RADIUS,
        currentZip,
        hasEverwellFilter,
        hasSpanishFilter;
    // --------------------------------------------------------------------
    // !-- Setting data
    // --------------------------------------------------------------------
    function onDataListUpdated(e, newData) {
        setData(newData);
    }
    function addAgent(agentData) {
        for (var i = 0; i < currentData.length; i++) {
            if (currentData[i].id === agentData.id) {
                // it's already in the list, so leave it as is
                return
            }
        }
        currentData.push(agentData);
        setData(currentData);
    }
    function setData(newData, callback) {
        if (!callback) {
            callback = $.noop;
        }
        currentData = newData;
        if (currentData.length === 0 && currentRadius !== constants.EXTENDED_RADIUS) {
            currentRadius = constants.EXTENDED_RADIUS;
            apiCaller.zip(currentZip, currentRadius, function (data) {
                setData(data, callback);
            });
        } else {
            // make a copy of currentData and alter it step by step
            var filteredData = applyFilters(currentData.slice(0));
            var prioritizedData = prioritizeAgents(filteredData);
            var indexedData = reindexData(prioritizedData);
            paginator.setData(indexedData);
            callback(true);
        }
    }
    function prioritizeAgents(data) {
        var resortedList = [],
            prioritizedList = [],
            MAX_PRIORITY = 5,
            MATH_THIS = 'agent',
            agentData,
            dataLength = data.length,
            i;
        for (i = 0; i < dataLength; i++) {
            agentData = data[i];
            if (agentData.title.toLowerCase().match(MATH_THIS) && prioritizedList.length < MAX_PRIORITY) {
                prioritizedList.unshift(agentData);
            } else {
                resortedList.push(agentData);
            }
        }
        for (i = 0; i < prioritizedList.length; i++) {
            resortedList.unshift(prioritizedList[i]);
        }
        return resortedList.slice(0);
    }
    function reindexData(data) {
        var index;
        for (var i = 0; i < data.length; i++) {
            index = i + 1;
            data[i].number = index < 10 ? '0' + index : index;
        }
        return data;
    }
    // --------------------------------------------------------------------
    // !-- Filter handling
    // --------------------------------------------------------------------
    function applyFilters() {
        var unfilteredData = currentData;
        if (hasEverwellFilter || hasSpanishFilter) {
            var filteredData = $.grep(unfilteredData, function (agentData) {
                if (hasEverwellFilter && hasSpanishFilter && agentData.isEverwell && agentData.isSpanish) {
                    return true;
                } else if (hasEverwellFilter && !hasSpanishFilter && agentData.isEverwell) {
                    return true;
                } else if (!hasEverwellFilter && hasSpanishFilter && agentData.isSpanish) {
                    return true;
                }
                return false;
            });
            return filteredData;
        } else {
            return unfilteredData;
        }
    }
    function setEverwellFilter(everwellFilter) {
        if (everwellFilter !== hasEverwellFilter) {
            hasEverwellFilter = everwellFilter;
            setData(currentData);
        }
    }
    function setSpanishFilter(spanishFilter) {
        if (spanishFilter !== hasSpanishFilter) {
            hasSpanishFilter = spanishFilter;
            setData(currentData);
        }
    }
    function resetFilters() {
        if (hasSpanishFilter || hasEverwellFilter) {
            hasSpanishFilter = false;
            hasEverwellFilter = false;
            setData(currentData);
        }
    }
    // --------------------------------------------------------------------
    // !-- Fetching data
    // --------------------------------------------------------------------
    function getAgentById(agentId, callback, onError) {
        var data;
        for (var i = 0; i < currentData.length; i++) {
            data = currentData[i];
            if (data.id == agentId) {
                callback(data);
                return
            }
        }
        // if ID is not found look it up through the API
        apiCaller.agentId(agentId, callback, onError);
    }
    function setZip(newZip, callback, onError) {
        if (newZip !== currentZip) {
            currentRadius = constants.DEFAULT_RADIUS;
            apiCaller.zip(newZip, currentRadius, function (newData) {
                if (newData.indexOf('ZIP API error') == 0) {
                    paginator.setData([]);
                    $('.aal-list-noResults').addClass('is-visible');
                    callback(false);
                }
                else {
                    currentZip = newZip;
                    eventBus.bus.trigger(eventBus.events.DATA_ZIP_UPDATED, currentZip);
                    setData(newData, callback);
                }
            }, onError);
        } else {
            callback(false);
        }
    }
    // --------------------------------------------------------------------
    // !-- Public methods
    // --------------------------------------------------------------------
    return {
        getAgentById: getAgentById,
        setZip: setZip,
        resetFilters: resetFilters,
        setEverwellFilter: setEverwellFilter,
        setSpanishFilter: setSpanishFilter,
        addAgent: addAgent
    }
}
);