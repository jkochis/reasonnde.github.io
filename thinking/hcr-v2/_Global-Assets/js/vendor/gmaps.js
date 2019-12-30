// convert Google Maps into an AMD module
define('gmaps', ['async!//maps.googleapis.com/maps/api/js?client=gme-aflacincorporated&v=3.18.8&libraries=geometry'],
	function(){

		// return the gmaps namespace for brevity
		return window.google.maps;
	});
	
