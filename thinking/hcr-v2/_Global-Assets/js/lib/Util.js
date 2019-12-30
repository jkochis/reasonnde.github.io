/**
 * Created by roel.kok on 6/12/14.
 */
define([
	"lib/Env"
],
function(
	Env
) {
    var Util = {
        isPositionFixed: function(el) {
            var $lineage = $(el).add($(el).parents());
            var isFixed = false;
            $lineage.each(function(){
                if ($(this).css("position") === "fixed") {
                    isFixed = true;
                    return false;
                }
            });
            return isFixed;
        },
        triggerIE8Redraw: Env.IE8 ? function(el) {
            document.body.className = document.body.className; // Works in console but not here?!
        } : function() {},
        // Validation
        validatePhone: function(value) {
            return !!value.match(/^[2-9]\d{2}-\d{3}-\d{4}$/)
        },
		validateDOB: function(value) {
            return !!value.match(/^\d{2}\/\d{2}\/\d{4}$/)
        },
        validateZipCode: function(value) {
            return !!value.match(/^[0-9]{5}$/);
        },
        validateExtension: function(value) {
            return !!value.match(/^[0-9]{10}$/);
        },
        validateEmail: function(value) {
            return !!value.match(/^(?=\s*\S).*^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/);
        },
		
        validateBusinessEmail: function(options) {
            var webservice = this.webserviceURL("/api/genericservice/EmailValidation");
			var emailObj = {};   
			var settings = $.extend({
				email: {},
				error: function () {},
				complete: function () {},
				submit: function () {}
			}, options);
				emailObj.email = settings.email;
                //validate email using API
			$(".submit").addClass('is_loading');
			
            return   $.ajax({
				dataType: 'json',
				type: 'POST',
				contentType: 'application/json; charset=utf-8',
				url: webservice,
				//url: '/api/genericservice/EmailValidation',
				data: JSON.stringify(emailObj),
				success: function (response) {
					if (!response.HasError && response.Data.validity=="verified" || !response.HasError && response.Data.validity=="unknown") {
					   // returnValue = true;
					   settings.submit(true);
					}
					else {
						//email validation request error
						// returnValue = false;
						settings.submit(false);
					}
					if(response.HasError && window.utag){
						utag.link({_ga_category: 'site diagnostics',_ga_action: 'email validation error: api',_ga_label: 'status code: ' + response.Status }); 
					}
					$(".submit").removeClass('is_loading');
				},
				error: function (xhr, textStatus, errorThrown) {
					//email validation request error 
				    // returnValue = true;
					
					if (window.utag) {
						utag.link({_ga_category: 'site diagnostics',_ga_action: 'email validation error: web server',_ga_label: 'status code: ' + xhr.status }); 
					} 
					settings.error();
					settings.submit(true);
					$(".submit").removeClass('is_loading');
				},
				complete: settings.complete
			});
        },
        loadTemplate: function(id) {
            return $(Env.IE8 ? $("#" + id)[0].text : $("#" + id).text());
        },
		isSpanish: function (){
			var pathArray = window.location.pathname.split( '/' );
			if(pathArray[1] === "es"){
				var spanish = true;
			}else{
				var spanish = false;
			}
			return spanish;
		},
		eventTiming: function (startTime, gaCategory, gaVar, gaLabel ){
			var totalTime = new Date().valueOf() - startTime.valueOf();
			if (window.utag) {
			utag.link({_ga_timingCategory: gaCategory,_ga_timingVar: gaVar,_ga_timingValue: totalTime, _ga_timingLabel: gaLabel}); 
			}
		},
		webserviceURL: function(url) {
           var protocol = window.location.protocol;
		   var hostname = window.location.hostname;
		   var secure = "https://";
		   if (hostname){
			   secure = secure + hostname + url;
			   return secure;
		   } 
		   else{
			   secure = "https://www.aflac.com"+url;
			   return secure;
		   }
        },
		toNumber: function(val){
			// numberic values should come first because of -0
			if (typeof val === 'number') return val;
			// we want all falsy values (besides -0) to return zero to avoid
			// headaches
			if (!val) return 0;
			if (typeof val === 'string') return parseFloat(val);
			// arrays are edge cases. `Number([4]) === 4`
			if (isArray(val)) return NaN;
			return Number(val);
		},
		currencyFormat: function(val, nDecimalDigits, decimalSeparator, thousandsSeparator) {
			val = Util.toNumber(val);
			nDecimalDigits = nDecimalDigits == null ? 2 : nDecimalDigits;
			decimalSeparator = decimalSeparator == null ? '.' : decimalSeparator;
			thousandsSeparator = thousandsSeparator == null ? ',' : thousandsSeparator;

			//can't use enforce precision since it returns a number and we are
			//doing a RegExp over the string
			var fixed = val.toFixed(nDecimalDigits),
				//separate begin [$1], middle [$2] and decimal digits [$4]
				parts = new RegExp('^(-?\\d{1,3})((?:\\d{3})+)(\\.(\\d{'+ nDecimalDigits +'}))?$').exec( fixed );

			if(parts){ //val >= 1000 || val <= -1000
				return parts[1] + parts[2].replace(/\d{3}/g, thousandsSeparator + '$&') + (parts[4] ? decimalSeparator + parts[4] : '');
			}else{
				return fixed.replace('.', decimalSeparator);
			}
		}
		
    }
    return Util;
});