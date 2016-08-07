define({

	getUrlParameter:function(param) {

		var pageURL = window.location.search.substring(1);
		var URLVariables = pageURL.split('&');

		for (var i = 0; i < URLVariables.length; i++)
		{
			var parameterName = URLVariables[i].split('=');
			if (parameterName[0] == param)
			{
				return parameterName[1];
			}
		}
	},

	sortByLatitude: function(a, b){

		if (a.latLng.lat() > b.latLng.lat()) {
			return -1;
		}

		if (a.latLng.lat() < b.latLng.lat()) {
			return 1;
		}

		return 0;
	},

	sortByDistance: function(a, b){

		var a = a.distanceValue,
			b = b.distanceValue;

		if (a > b) {
			return 1;
		}

		if (a < b) {
			return -1;
		}

		return 0;
	}

});