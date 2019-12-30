define(['./utils/lazyBG'], function(LazyBG) {


		var element = $(".lic-results");

		function setup () {
			var lazybg = new LazyBG($(".policyDetail-video-container"));
		}

		return {
			setup: setup
		};
	}
);
