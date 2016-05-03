//trim polyfill
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
if (!String.prototype.trim) {
  (function() {
    // Make sure we trim BOM and NBSP
    var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
    String.prototype.trim = function() {
      return this.replace(rtrim, '');
    };
  })();
}
//array indexOf polyfill
// Production steps of ECMA-262, Edition 5, 15.4.4.14
// Reference: http://es5.github.io/#x15.4.4.14
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function(searchElement, fromIndex) {
    var k;
    // 1. Let O be the result of calling ToObject passing
    //    the this value as the argument.
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }
    var O = Object(this);
    // 2. Let lenValue be the result of calling the Get
    //    internal method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0;
    // 4. If len is 0, return -1.
    if (len === 0) {
      return -1;
    }
    // 5. If argument fromIndex was passed let n be
    //    ToInteger(fromIndex); else let n be 0.
    var n = +fromIndex || 0;
    if (Math.abs(n) === Infinity) {
      n = 0;
    }
    // 6. If n >= len, return -1.
    if (n >= len) {
      return -1;
    }
    // 7. If n >= 0, then Let k be n.
    // 8. Else, n<0, Let k be len - abs(n).
    //    If k is less than 0, then let k be 0.
    k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
    // 9. Repeat, while k < len
    while (k < len) {
      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the
      //    HasProperty internal method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      //    i.  Let elementK be the result of calling the Get
      //        internal method of O with the argument ToString(k).
      //   ii.  Let same be the result of applying the
      //        Strict Equality Comparison Algorithm to
      //        searchElement and elementK.
      //  iii.  If same is true, return k.
      if (k in O && O[k] === searchElement) {
        return k;
      }
      k++;
    }
    return -1;
  };
}
 (function ($) {
    $.fn.zipLookUp = function (options) {
        var response;
        var settings = $.extend({
            zipcode: "99999",
            error: function () {},
            complete: function () {},
            submit: function () {}
        }, options);
		var eventTiming = function (startTime, gaCategory, gaVar, gaLabel ){
			var totalTime = new Date().valueOf() - startTime.valueOf();
			if (window.utag) {
			utag.link({_ga_timingCategory: gaCategory,_ga_timingVar: gaVar,_ga_timingValue: totalTime, _ga_timingLabel: gaLabel}); 
			}
		}
		var ajaxStartTime = new Date();
		var ajaxStartTimeUTC = ajaxStartTime.toUTCString();
            return $.ajax({
                type: 'GET',
				contentType: "application/json; charset=utf-8",
                url:'/handlers/zip.ashx',
				tryCount : 0,
                retryLimit : 5,
                data: {
                    requrl:settings.zipcode
                },
                dataType: 'json',
                timeout: 5000,
                success: function (result) {
                    if (result.HasError) {
                        response = {
                            city: "Invalid Zipcode",
                            state: "Invalid Zipcode",
                            state_abbreviation: "NA"
                        };
						if (window.utag && result.Data.status.toLowerCase() !== "invalid_zipcode") {
							eventTiming(ajaxStartTime, "zipcode lookup", result.Status.toString(), ajaxStartTimeUTC );
							utag.link({_ga_category: 'site diagnostics',_ga_action: 'zipcode validation error: api',_ga_label: result.Data.status.toLowerCase()}); 
						}
						if (window.utag && result.Data.status.toLowerCase() === "invalid_zipcode"){
							eventTiming(ajaxStartTime, "zipcode lookup", "200", ajaxStartTimeUTC );
							utag.link({_ga_category: 'site diagnostics',_ga_action: 'zipcode validation error: api',_ga_label: result.Data.status.toLowerCase()});
						}	
                    } 
					else {
						eventTiming(ajaxStartTime, "zipcode lookup", result.Status.toString(), ajaxStartTimeUTC );
                        response = result.Data.city_states[0];
                    }
					
                    settings.submit(response);
					
					var path = window.location.pathname;
					if (window.utag) {
						utag.link({_ga_category: 'site diagnostics',_ga_action: 'data: zipcode lookup',_ga_label: path}); 
					}
                },
                error: function (xhr, textStatus, errorThrown) {
					
					this.tryCount++;
					if (this.tryCount <= this.retryLimit) {
						if (window.utag) {
						utag.link({_ga_category: 'site diagnostics',_ga_action: 'data: zipcode lookup',_ga_label: 'retry: '+ this.tryCount +' status code: ' + xhr.status.toString() }); 
						}
						//try again
						var _this = this; 
						setTimeout(function () { $.ajax(_this) }, 500);
						return;
					} 
					else {   
						response = {
							city: "Error",
							state: "Error",
							state_abbreviation: "ER"
						};                   
						settings.submit(response);
						settings.error();
						if (window.utag) {
						eventTiming(ajaxStartTime, "zipcode lookup", xhr.status.toString(), ajaxStartTimeUTC );	
						utag.link({_ga_category: 'site diagnostics',_ga_action: 'zipcode validation error: web server',_ga_label: 'status code: ' + xhr.status.toString() }); 
						}
					}
					
                },
                complete: settings.complete
            });
    };
}(jQuery));
/*equalize Height of all elements with a give selector - $(this).equalizeHeight({selector:".selector"});*/
(function ($) {
    $.fn.equalizeHeight = function (options) {
        var settings = $.extend({
            selector: ".somethingRandomThatWontExist"
        }, options);
            return (function(){
				var maxHeight = 0;
				$(""+settings.selector+"").each(function(){
					if ($(this).height() > maxHeight) { maxHeight = $(this).height(); }
				});
				$(""+settings.selector+"").height(maxHeight);
				})();
	}			
}(jQuery));
/*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
(function(factory){if(typeof define==="function"&&define.amd)define(["jquery"],factory);else if(typeof exports==="object")factory(require("jquery"));else factory(jQuery)})(function($){var pluses=/\+/g;function encode(s){return config.raw?s:encodeURIComponent(s)}function decode(s){return config.raw?s:decodeURIComponent(s)}function stringifyCookieValue(value){return encode(config.json?JSON.stringify(value):String(value))}function parseCookieValue(s){if(s.indexOf('"')===0)s=s.slice(1,-1).replace(/\\"/g,
'"').replace(/\\\\/g,"\\");try{s=decodeURIComponent(s.replace(pluses," "));return config.json?JSON.parse(s):s}catch(e){}}function read(s,converter){var value=config.raw?s:parseCookieValue(s);return $.isFunction(converter)?converter(value):value}var config=$.cookie=function(key,value,options){if(value!==undefined&&!$.isFunction(value)){options=$.extend({},config.defaults,options);if(typeof options.expires==="number"){var days=options.expires,t=options.expires=new Date;t.setTime(+t+days*864E5)}return document.cookie=
[encode(key),"=",stringifyCookieValue(value),options.expires?"; expires="+options.expires.toUTCString():"",options.path?"; path="+options.path:"",options.domain?"; domain="+options.domain:"",options.secure?"; secure":""].join("")}var result=key?undefined:{};var cookies=document.cookie?document.cookie.split("; "):[];for(var i=0,l=cookies.length;i<l;i++){var parts=cookies[i].split("=");var name=decode(parts.shift());var cookie=parts.join("=");if(key&&key===name){result=read(cookie,value);break}if(!key&&
(cookie=read(cookie))!==undefined)result[name]=cookie}return result};config.defaults={};$.removeCookie=function(key,options){if($.cookie(key)===undefined)return false;$.cookie(key,"",$.extend({},options,{expires:-1}));return!$.cookie(key)}});
/////////////////////////////////////////// 4 main segments cookie - used for tracking last main segment//////////////////////////////////////////////////////////	 
(function(){
	
	var seg = window.location.pathname.split( '/' );
	seg = seg[1];
	//console.log(seg);	
	if(seg === 'es'){
	seg = window.location.pathname.split( '/' );	
	seg = seg[2];
//console.log(seg);	
	}
	if (seg == 'individuals' || seg == 'brokers' || seg == 'business' || seg == 'sales-jobs'){
		$.cookie('MainNavItem', seg, { expires: 300, path: '/' });
	}
})();
///////////////////////////////////////////////////HCR segmentation/////////////////////////////////////////////////////////////
$( document ).ready(function() {
var seg = $.cookie('MainNavItem');
var url_seg = window.location.pathname.split( '/' );
//$("menu-items").html();
	url_seg = url_seg[1];
	if(url_seg === 'es'){
	url_seg = window.location.pathname.split( '/' );	
	url_seg = url_seg[2];	
	}
    /* default tab for new users */
        if (seg == 'brokers' && url_seg == 'health-care-reform'){
			var menu = $('#segment-brokers > .menu-items').detach();
			$('.main-menu > ul.menu-items').replaceWith(menu);
			$('.w_segmenu__top-tab > a').text('Brokers');
			$('div.segment').text('Brokers');
			var submenu = $('#segment-brokers > .dropdown-menu').detach();
			$('.menu > div.dropdown-menu').replaceWith(submenu);
			$('nav.logo-bar > div.contact-trigger').text('Offer Aflac');
			$('.menu > div.dropdown-menu > div.dropdown-menu-content').append('<div class="segment">For Brokers</div>');
        }else if (url_seg == 'health-care-reform'){
			var menu = $('#segment-employers > .menu-items').detach();
			$('.main-menu > ul.menu-items').replaceWith(menu);
			$('.w_segmenu__top-tab > a').text('Employers');
			$('div.segment').text('Employers');
			$('nav.logo-bar > div.contact-trigger').text('Offer Aflac');
			var submenu = $('#segment-employers > .dropdown-menu').detach();
			$('.menu > div.dropdown-menu').replaceWith(submenu);
			$('.menu > div.dropdown-menu > div.dropdown-menu-content').append('<div class="segment">For Employers</div>');
        }	
});
//////////////////////////////////////////////////////////MOBILE CLEAR SEGMENTATION////////////////////////
$( document ).ready(function() {
  //set onclick event on the segmentation top breadcrumb link (mobile only), to clear segmentation cookie
  $('.w_nav-bar .content .main-menu .breadcrumb').click(function() {
       $.removeCookie('SegmentationCookie', { path: '/' });
	   var url_seg = window.location.pathname.split( '/' );
	url_seg = url_seg[1];
	if(url_seg === 'es'){
		window.location.href = "/es/";
	}else{
		window.location.href = "/";
	}
       
       return false;
   });
});
$( document ).ready(function() {
  //temporary - set onclick event on the segmentation top nav, to clear segmentation cookie
  $('.w_segmenu__top-right li:first > a.textlink, .secondary-item-list li.language > a').click(function() {
       $.removeCookie('SegmentationCookie', { path: '/' });
   });
});
/////////////////////////////////////////////////////////basic USER AGENT browser detection///////////////////// 
var matched, browser;
jQuery.uaMatch = function( ua ) {
    ua = ua.toLowerCase();
    var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
        /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
        /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
        /(msie)[\s?]([\w.]+)/.exec( ua ) ||       
        /(trident)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
        ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
        [];
    return {
        browser: match[ 1 ] || "",
        version: match[ 2 ] || "0"
    };
};
matched = jQuery.uaMatch( navigator.userAgent );
//IE 11+ fix (Trident) 
matched.browser = matched.browser == 'trident' ? 'msie' : matched.browser;
browser = {};
if ( matched.browser ) {
    browser[ matched.browser ] = true;
    browser.version = matched.version;
}
// Chrome is Webkit, but Webkit is also Safari.
if ( browser.chrome ) {
    browser.webkit = true;
} else if ( browser.webkit ) {
    browser.safari = true;
}
jQuery.browser = browser;
// log removed - adds an extra dependency
//log(jQuery.browser)
//////////////////////////////////////////////////////////////MENU SELECTOR //////////////////////////////////////////////////
//check top menu items first
$('document').ready(function() {
var path = location.pathname;
path = path.replace("default.aspx", "");
var menuItems = [];		
var subMenuItems = [];
$("ul.menu-items > li > a").each(
		function(){
			var href = $(this).attr('href');
			href = href.replace("https://www.aflac.com", "");
			href = href.replace("https://aflac.com", "");
			href = href.replace("https://new.aflac.com", "");
			href = href.replace("https://www.new.aflac.com", "");
			href = href.replace("https://stage.aflac.com", "");
			href = href.replace("https://www.stage.aflac.com", "");
			href = href.replace("https://beta.aflac.com", "");
			href = href.replace("https://www.beta.aflac.com", "");
			href = href.replace("default.aspx", "");
			//console.log(href);
			menuItems.push(href);
			
		});
	//	console.dir(menuItems);
	$("div.dropdown-menu > div.dropdown-menu-content > div.submenus > nav.submenu > div.text-items > div.link-column > ul > li > a").each(
		function(){
			var href = $(this).attr('href');
			href = href.replace("https://www.aflac.com", "");
			href = href.replace("https://aflac.com", "");
			href = href.replace("https://new.aflac.com", "");
			href = href.replace("https://www.new.aflac.com", "");
			href = href.replace("https://stage.aflac.com", "");
			href = href.replace("https://www.stage.aflac.com", "");
			href = href.replace("https://beta.aflac.com", "");
			href = href.replace("https://www.beta.aflac.com", "");
			href = href.replace("default.aspx", "");
			//console.log(href);
			subMenuItems.push(href);
			
		});
		//console.dir(subMenuItems);	
for (var i = 0; i < menuItems.length; i++) {
	var $topselected = $("ul.menu-items > li > a[href*='"+location.pathname+"']");
	if($topselected.length>0 && path === menuItems[i]){
		
		$topselected.parent('li').addClass("is-selected");
	}
}
for (var i = 0; i < subMenuItems.length; i++) {
			//if not top menu - search level 2 links for the current page URL
		var $selectedChildItem = $(".dropdown-menu a[href*='"+location.pathname+"']");
		if( $selectedChildItem.length>0 && path === subMenuItems[i]){ 
					//if found - set is-selected on the top menu item with the same data-menu value
			var dataAttrValue= $selectedChildItem.first().parents('nav').attr('data-menu');
			$("ul.menu-items li[data-menu*='"+dataAttrValue+"']").addClass("is-selected");
		}
}
});
/////////////////////////////////////////////////////// AWR SlideShare script //////////////////////////////////////////////////////
/*Notes by Troy: This script was copied from workforces.aflac.com as is, I only commented out what I knew was not used. */
$(document).ready(function() { 
//Removes duplicate elements, like multiple overlays for three lightbox sets.
var seen = {};
$('div.overlay,.lightbox-frame').each(function() {
	var txt = $(this).text();
	if (seen[txt])
		$(this).remove();
	else
		seen[txt] = true;
});
var _analytics = "";
$('#close, .overlay').on('click touchstart',function(){
    closeLightbox();
});
function closeLightbox() {
    TweenMax.to($('.lightbox-frame'),0.4,{opacity:0,scale:0,top: '100%',ease:Expo.easeOut,onComplete: function(){
        $('.lightbox-frame').hide();
        $('.lightbox-frame').find('.imgholder').html('');
    }});
    TweenMax.to($('.overlay'),0.3,{opacity:0,delay:0.2,onComplete: function(){
        $('.overlay').hide();
    }});
}
function launchLightbox(_type,_id,_share,_download) {
    //_type of light box [video,image,slideshow]
    //_id = id of slideshow, url of image, id of video
    //_share = object of share details.
    var _lightbox = $('.lightbox-frame'),
        _overlay = $('.overlay');
		
	
/*
<li href="https://www.facebook.com/sharer/sharer.php?" class="service facebook service-1"><a href="#"><div class="icon"></div></a></li>
<li href="https://twitter.com/home?status=" class="service twitter service-2"><a href="#"><div class="icon"></div></a></li>
<li href="https://plus.google.com/share?url=" class="service googleplus service-3"><a href="#"><div class="icon"></div></a></li>
*/
    switch (_type) {
       /* case 'image':
            _lightbox.find('.imgholder').html('<img src="img/tools/large/charts.png" alt="">');
            _lightbox.find('.send').data('subject', _share.subject);
            _lightbox.find('.send').data('desc', _share.desc);
            _lightbox.find('.download').attr('href',_download);
            _lightbox.find('.download').show();
            break;
        case 'video':
            _lightbox.find('.imgholder').html('<iframe src="http://workforces.aflac.com/video.php?id='+_id+'" scrolling="no"></iframe>');
            _lightbox.find('.send').data('subject', _share.subject);
            _lightbox.find('.send').data('desc', _share.desc);
            _lightbox.addClass('video');			
            _lightbox.find('.download').hide();
            break; */
        case 'slideshow':
            _lightbox.find('.download-icon').show();
           // _lightbox.find('.send').data('subject', _share.subject);
           // _lightbox.find('.send').data('desc', _share.desc);
			_lightbox.find('.facebook').html('<a href="https://www.facebook.com/sharer/sharer.php?' + lbsource + '"><div class="icon"></div></a>');
			_lightbox.find('.twitter').html('<a href="https://twitter.com/home?status=' + lbsource + '"><div class="icon"></div></a>');
			_lightbox.find('.googleplus').html('<a href="https://plus.google.com/share?url=' + lbsource + '"><div class="icon"></div></a>');
            //_lightbox.find('.download-icon').attr('href',_download);
			_lightbox.find('.download-tool').html('<a href="' + download + '" target="_blank" id="download" class="download-icon">download</a>');
            //_lightbox.find('.imgholder').html('<iframe src="https://www.slideshare.net/slideshow/embed_code/'+_id+'?rel=0'+'" width="427" height="356" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px 1px 0; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe>');
			_lightbox.find('.imgholder').html('<iframe src="'+ lbsource +'" width="427" height="356" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px 1px 0; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe>');
            // _lightbox.find('.send').attr('onmousedown', _analytics);
			break;
        default:
            break;
    }
    TweenMax.fromTo(_lightbox,0.4,{opacity:0,scale:0,top: '100%'},{opacity:1,scale:1,top: '50%',ease:Expo.easeOut,onComplete:function(){
        _lightbox.removeAttr("style");
    _lightbox.show();
    }});
    TweenMax.fromTo(_overlay,0.3,{opacity:0},{opacity:0.67});
    _lightbox.show();
    _overlay.show();
}
/*
$('.icon-search').on('click',function(e){
    var _share = {};
    _share.desc = $(this).parent().parent().data('desc');
    _share.subject = $(this).parent().parent().data('subject');
    launchLightbox('image',$(this).parent().parent().data('imageURL'),_share, $(this).parent().parent().data('download'));
    e.preventDefault();
    return false;
})
*/
	$('.icon-search-chart, .slide-pop').on('click touchstart',function(e){
		//var windowWidth = $(window).width();
		//if (windowWidth <= 775) {
		if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
			lbsource = $(this).parent().parent().attr("data-download");
			$(this).prop('href',lbsource);
			$(this).attr('target','_blank');
			_analytics = $(this).find("div.label p").text() || '(Slide Presentation) ' + $(this).parent().find("h5").text();
			//console.log(_analytics);
			if (window.utag) {
				utag.link({_ga_category: 'infographic',_ga_action: 'click',_ga_label: _analytics});
			}
		} else {
			var _share = {};
			_analytics = $(this).find("div.label p").text() || '(Slide Presentation) ' + $(this).parent().find("h5").text();
			_gaUrl = "URL: " + window.location.href;
			//console.log(_analytics);
			if (window.utag) {
				utag.link({_ga_category: 'infographic',_ga_action: 'click',_ga_label: _analytics});
			}
			_share.desc = $(this).parent().parent().data('desc');
			_share.subject = $(this).parent().parent().data('subject');
			lbsource = $(this).parent().parent().attr("data-download");
			download = $(this).parent().parent().attr("data-download");
			launchLightbox('slideshow',$(this).parent().parent(),_share, $(this).parent().parent().data('download'));
			e.preventDefault();
			return false;
		}
	})
	$('.custom_pdf_lightbox').on('click touchstart',function(e){
		//var windowWidth = $(window).width();
		//if (windowWidth <= 775) {
		if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
			lbsource = $(this).attr("data-download");
			$(this).prop('href',lbsource);
			$(this).attr('target','_blank');
			_analytics = '(PDF Lightbox)' + $(this).data('desc');
			_gaUrl = " | URL: " + window.location.href;
			if (window.utag) {
				utag.link({_ga_category: 'pdf lightbox',_ga_action: 'click',_ga_label: _analytics + _gaUrl});
			}
		} else {
			var _share = {};
			_analytics = '(PDF Lightbox)' + $(this).data('desc');
			_gaUrl = " | URL: " + window.location.href;
			if (window.utag) {
				utag.link({_ga_category: 'pdf lightbox',_ga_action: 'click',_ga_label: _analytics + _gaUrl});
			}
			_share.desc = "";
			_share.subject = "";
			download = $(this).attr("data-download");
			lbsource = $(this).attr("data-download");
			launchLightbox('slideshow',$(this).parent().parent(),_share, $(this).parent().parent().data('download'));
			
			e.preventDefault();
			return false;
		}
	})
/*
//for touch devices
if(Modernizr.touch){
    $('.tools-box').on('click',function(e){
        var _share = {};
        _share.desc = $(this).data('desc');
        _share.subject = $(this).data('subject');
        launchLightbox('slideshow',$(this).data('id'),_share, $(this).data('download'));
        e.preventDefault();
        return false;
    })
}
 
$('.media-box').on('click',function(e){
    var _share = {};
    _share.desc = $(this).data('desc');
    _share.subject = $(this).data('subject');
    launchLightbox('video',$(this).data('video'),_share);
    e.preventDefault();
    return false;
})
$('.slide-box .btn').on('click',function(e){
    var _share = {};
    _analytics = $(this).data('analytics');
	//console.log(_analytics);
    _share.desc = $(this).data('desc');
    _share.subject = $(this).data('subject');
    launchLightbox('slideshow',$(this).data('id'),_share, $(this).data('download'));
    e.preventDefault();
    return false;
})
function setupSectionButtons(){
    $('.tools-nav a').on('click',function(e){
        currentSection = $(this).data('section');
        $('.tools-nav .active').removeClass('active');
        $('.media-holder').load('tools/'+$(this).data('section')+'.php',function(){
            
            $('.nav-'+currentSection).addClass('active');
            //resetup buttons after DOM Refresh
            $('.media-box').on('click',function(e){
                var _share = {};
                _share.desc = $(this).data('desc');
                _share.subject = $(this).data('subject');
                launchLightbox('video',$(this).data('video'),_share);
                e.preventDefault();
                return false;
            })
        });
        e.preventDefault();
        return false;
    })
} */
});
////////////////////////////////////////////////////////////////////// Accordion style FAQ section script /////////////////////////////////////////////////////////
$(document).ready(function() { 
(function($) {
  //cache var selectors  
  var allPanels = $('.accordion > dd').hide();
  var linkPanels2 =  $(".accordion > dt").find("a > .faqCol2"); 
  var linkPanels1 =  $(".accordion > dt").find("a > .faqCol1");  	
  var panelHover = $('.accordion > dt');
  
	$('.accordion > dt > a').click(function() {
      $this = $(this);
      $target =  $this.parent().next('.seperator').next();
	  //if seperator is missing
	  if ($target.length < 1){
		$target =  $this.parent().next();
	  } 
	 //check for active state
      if(!$target.hasClass('active')){	
		 linkPanels2.removeClass("blue");
		 linkPanels1.removeClass("activeQ");
         allPanels.removeClass('active').slideUp(0);
         $target.addClass('active').slideDown(0);
		 
		 $this.find(".faqCol1").addClass("activeQ");
		 $this.find(".faqCol2").addClass("blue");
      }else{
		 linkPanels2.removeClass("blue");
		 linkPanels1.removeClass("activeQ");
         allPanels.removeClass('active').slideUp(0);
	  }
	  
    return false;
  });
  
  //hover arrow state
	panelHover.mouseenter(function() {
			$(this).find("a > .faqCol1").addClass("hoverQ").removeClass("inactiveQ");
	  });	
	panelHover.mouseleave(function() {  
			$(this).find("a > .faqCol1").addClass("inactiveQ").removeClass("hoverQ");
	});
})(jQuery);
});
//tealium load error tracking
  
        $(window).load(function() {  
          if (!window.utag) {
           $('body').append('<iframe height="0" width="0" src="/widgets/tealium-tracking.aspx"></iframe>');
			 }
		});