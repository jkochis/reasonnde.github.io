/**
 * Created by roel.kok on 5/12/14.
 */

define([
	"lib/Segments"
],
function(
	Segments
) {
	var Env = {
		IE8: navigator.appName == "Microsoft Internet Explorer" &&  !!navigator.userAgent.match(/MSIE 8\./) || navigator.appName == "Microsoft Internet Explorer" &&  !!navigator.userAgent.match(/MSIE 7\./),
		IE9: navigator.appName == "Microsoft Internet Explorer" &&  !!navigator.userAgent.match(/MSIE 9\./),
		IE9_PLUS: navigator.appName == "Microsoft Internet Explorer" && !navigator.userAgent.match(/MSIE 8\./)  && !navigator.userAgent.match(/MSIE 9\./),
		NOT_IE: navigator.appName == "Netscape",
		IOS: !!navigator.userAgent.match(/(iPad|iPhone|iPod)/g),
		ANDROID: !!navigator.userAgent.match(/Android/i),
		WP: !!navigator.userAgent.match(/IEMobile/i) || !!navigator.userAgent.match(/Windows Phone/i),
		SURFACE: !!navigator.userAgent.toLowerCase().match(/windows nt/i) && !!navigator.userAgent.toLowerCase().match(/touch/i),
		PLACEHOLDER: (function(){
			var i = document.createElement('input');
			return 'placeholder' in i;
		})(),
		// Not really an env property (more context)
		SEGMENT: (function() {
			var segment;
			var $el = $("html");
			if($el.hasClass("segment-individuals")) {
				segment = Segments.INDIVIDUALS
			}
			else if($el.hasClass("segment-sales-jobs")) {
				segment = Segments.AGENTS;
			}
			else if($el.hasClass("segment-brokers")) {
				segment = Segments.BROKERS;
			}
			else if($el.hasClass("segment-business")) {
				segment = Segments.EMPLOYERS;
			}

			return segment;
		})()
	}

//	$(document).ready(function() {
//		Env.IE8 = $("html").hasClass("lt-ie9");
//	});

	return Env;
});
