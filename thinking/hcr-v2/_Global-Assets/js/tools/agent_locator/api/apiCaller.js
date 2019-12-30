define([
		'tools/agent_locator/core/eventBus',
		'tools/agent_locator/core/constants',
		'tools/agent_locator/core/utils',
		'tools/agent_locator/api/fakeData'
], function (eventBus, constants, utils, fakeData) {
    // --------------------------------------------------------------------
    // !-- Zip code API handling
    // --------------------------------------------------------------------
    var mapUtils,
        currentZipCode,
        zipLatLng = null;
    function callZip(zipCode, radius, callback, onError) {
        currentZipCode = zipCode;
        if (!isFaked) {
            callApi('?ZipCode=' + zipCode + '&Radius=' + radius, function (requestResponse) {
                handleZipResponse(requestResponse.Data, requestResponse.HasError, callback)
            }, onError);
        } else {
            setTimeout(function () { handleZipResponse(fakeData.zip, false, callback) }, 1000);
        }
    }
    function handleZipResponse(zipResponse, hasError, callback) {
        if (hasError) {
            callback("ZIP API error " + zipResponse);
            if (window.utag) {
                utag.link({_ga_category: 'site diagnostics',_ga_action: 'agent locator error: api',_ga_label: 'status code: ' + zipResponse.status }); 
            }    
        }
        else {
            if (zipResponse.length > 0) {
                // get the latLng of the zipcode so we can calculate the distance
                mapUtils.addressGeoLookUp('United States ' + currentZipCode, function (result) {
                    if (result && result.geometry.location) {
                        zipLatLng = result.geometry.location;
                    } else {
                        zipLatLng = null;
                    }
                    callback(mapData(zipResponse));
                })
            } else {
                callback([]);
            }
        }
    }
    function mapData(rawAgentList) {
        var parsedAgentData,
            mappedList = [];
        // parse raw data to more usable data for agent locator tool
        for (var i = 0; i < rawAgentList.length; i++) {
            parsedAgentData = parseRawAgentData(rawAgentList[i]);
            mappedList.push(parsedAgentData);
        }
		if (window.utag) {
            utag.link({_ga_category: 'find an agent',_ga_action: 'number of agents returned',_ga_label: rawAgentList.length });
        }
        // sort the parsed data by distance from the zip
        var sortedByDistance = mappedList.sort(utils.sortByDistance);
        return sortedByDistance;
    }
    // --------------------------------------------------------------------
    // !-- Agent ID API handling
    // --------------------------------------------------------------------
    function callAgentId(agentId, callback, onError) {
        if (!isFaked) {
            callApi(agentId, function (rawAgentData) {
                parseAgentIdResponse(rawAgentData.Data, callback);
            }, onError);
        } else {
            parseAgentIdResponse(fakeData.agent, callback);
        }
    }
    function parseAgentIdResponse(rawAgentData, callback) {
        callback(parseRawAgentData(rawAgentData));
    }
    // --------------------------------------------------------------------
    // !-- Agent licenses API handling
    // --------------------------------------------------------------------
    function callAgentLicenses(agentId, callback, onError) {
        if (!isFaked) {
			$('ul.aal-detail-offered').empty();
			$('ul.aal-detail-offered').addClass('is_loading');
            callApi('/' + agentId + '/Licenses', function (licensesResponse) {
                parseLicensesResponse(licensesResponse, callback);
				$('ul.aal-detail-offered').removeClass('is_loading');
            }, onError);
        } else {
            parseLicensesResponse(fakeData.licenses, callback);
        }
    }
    function parseLicensesResponse(licensesResponse, callback) {
        var licenses = licensesResponse.Data.licenses,
            parsedLicenses = [];
        if (licenses) {
            var licenseId;
            var mappedLicenses = [];
            for (var i = 0; i < licenses.length; i++) {
                licenseId = licenses[i].product.toLowerCase();
				licenseId = licenseId.trim();
                if (constants.LICENSES_MAP[licenseId]) {
                    mappedLicenses.push.apply(mappedLicenses, constants.LICENSES_MAP[licenseId]);
                }
            }
            mappedLicenses.sort();
			//console.dir(mappedLicenses);
            $.each(mappedLicenses, function (i, license) {
                if ($.inArray(license, parsedLicenses) === -1) {
                    parsedLicenses.push(license);
                }
            });
			//console.dir(parsedLicenses);
        }
        callback(parsedLicenses);
    }
    // --------------------------------------------------------------------
    // !-- Generic API handling
    // --------------------------------------------------------------------
    function callApi(params, onSuccess, onError) {
        if (!onError) {
            onError = onApiError;
        }
        var url = constants.API_ENDPOINT + params;
        $.ajax({
            url: url,
            type: "GET",
            //beforeSend: function(xhr){
            //	xhr.setRequestHeader('X-AFL-ClientID', '707b49ff-edaf-459c-858c-f28e90633abb');
            //	xhr.setRequestHeader('Authorization', 'Basic YWZsYWNhcGl1c2VyOmFmbGFjYXBpcGFzc3dvcmQ=');
            //},
            success: onSuccess,
            error: onError
        });
    }
    function onApiError(requestResponse) {
        if (requestResponse.readyState === 0) {
            alert(constants.ERROR_COPY_API);
        }
	//	utag.link({_ga_category: 'site diagnostics',_ga_action: 'agent locator error: api',_ga_label: 'status code: ' + requestResponse.status }); 
    }
    // --------------------------------------------------------------------
    // !-- Agent API data parsing
    // --------------------------------------------------------------------
    function parseRawAgentData(rawAgentData) {
        var name = rawAgentData.publicFirstName + ' ' + rawAgentData.publicLastName,
            id = rawAgentData.id,
            city = rawAgentData.publicCity,
            state = rawAgentData.publicState,
            zipCode = rawAgentData.publicZip,
            title = rawAgentData.title,
            isSpanish = rawAgentData.speaksSpanish,
            isEverwell = rawAgentData.everwellProducer,
            address = rawAgentData.publicAddressLine1,
            phone = rawAgentData.publicPhone,
            email = rawAgentData.aflacEmailAddress,
            websiteUrl = rawAgentData.balihooUrl,
            distance = 0,
            latLng = mapUtils.createLatLng(rawAgentData.latitude, rawAgentData.longitude),
            image = rawAgentData.photoUrl;
		
		function formatPhoneNumber(s) {
		  var s2 = (""+s).replace(/\D/g, '');
		  var m = s2.match(/^(\d{3})(\d{3})(\d{4})$/);
		  return (!m) ? false : "" + m[1] + "." + m[2] + "." + m[3];
		}
		
		if(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(phone)	){
		phone = formatPhoneNumber(phone);
		}
		else{
		phone = false;
		//console.log("failed phone # check");
		}
		
        if (!rawAgentData.photoUrl || rawAgentData.photoUrl === '') {
            image = false;
        } else {
            image = false; //rawAgentData.photoUrl;
        }
        if (rawAgentData.publicAddressLine2 !== null) {
            address += ' ' + rawAgentData.publicAddressLine2;
        }
        if (rawAgentData.publicAddressLine3 !== null) {
            address += ' ' + rawAgentData.publicAddressLine3;
        }
        if (latLng !== false && zipLatLng !== null) {
            distance = mapUtils.getDistance(zipLatLng, latLng);
        }
        return {
            id: id,
            distanceValue: parseFloat(distance),
            distanceLabel: distance <= 1 ? distance + ' mile' : distance + ' miles',
            latLng: latLng,
            image: image,
            name: name,
            city: city,
            state: state,
            zip: zipCode,
            address: address,
            title: title,
            email: email,
            websiteUrl: websiteUrl,
            phone: phone,
            isSpanish: isSpanish,
            isEverwell: isEverwell
        };
    }
    // --------------------------------------------------------------------
    // !-- Fake data handling
    // --------------------------------------------------------------------
    var isFaked = false;
    function setIsFaked(newIsFaked) {
        isFaked = newIsFaked;
    }
    function getIsFaked() {
        return isFaked;
    }
    // --------------------------------------------------------------------
    // !-- Public properties
    // --------------------------------------------------------------------
    return {
        setup: function (mapUtilsRef) {
            mapUtils = mapUtilsRef;
        },
        zip: callZip,
        agentId: callAgentId,
        agentLicenses: callAgentLicenses,
        setIsFaked: setIsFaked,
        getIsFaked: getIsFaked
    }
}
);