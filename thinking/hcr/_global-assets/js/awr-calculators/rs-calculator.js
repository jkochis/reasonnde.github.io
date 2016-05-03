var rsCalculator = {
	isOpen: false,
	changingPercentage: false,
	options: {
		// Element that holds a calculator
		containerClass: "rs-calculator-container",
		// Element acting as the calculator
		calculatorClass: "rs-calculator",
		// Element that opens a calculator (should be paired with a rel attribute)
		calculatorOpenButton: "rs-calculator-button",
		// Element that closes a calculator
		calculatorCloseButton: "tool_hide",
		// A Tooltip inside a calculator
		tooltipClass: "rs-tooltip",
		// Element when clicked shows percentage indicator
		changePercentageClass: "change-percentage",
		// Input element that allows user to change percentage
		percentageIndicatorClass: "percentage-indicator",
		// Class applied to make an element blink
		blinkClass: "rs-blink",
		
		averageSalary: 45000
	},
		
	/*
	 * Start functionality for the calculators
	 */
	init: function() {
		rsCalculator.$el = $("." + rsCalculator.options.containerClass);
		rsCalculator.openButton = $("." + rsCalculator.options.calculatorOpenButton);
		rsCalculator.closeButton = $("." + rsCalculator.options.calculatorCloseButton/*, rsCalculator.$el*/);
		
		// Don't carry on if there are no calculators present
		if (rsCalculator.$el.length === 0) {
			return;
		}
		
		var calculatorName,
				$calculatorSelected;
				
		//console.log('line-69-',calculatorName);	
				
		// Is the "input" event supported?
		// IE8 doesn't support it so use keyup instead
		var inputEventSupported = "oninput" in window,
				inputEvent = (inputEventSupported === true) ? "input": "keyup";
		$changePercentage = $("." + rsCalculator.options.changePercentageClass);
		// Show the change percentage input when the percentage in q2 is clicked
		// (for Turnover costs calculator only)
		$changePercentage.on({
			click: function(e) {
				rsCalculator.changePercentage(e, $(this));
			},
			// On touch devices, change the input to allow for percentage,
			// and show the tooltip
			touchstart: function(e) {
				rsCalculator.changePercentage(e, $(this));
				$(this).siblings("." + rsCalculator.options.tooltipClass).show();
			},
			// Show the tooltip
			mouseover: function(e) {
				$(this).siblings("." + rsCalculator.options.tooltipClass).show();
			},
			// Hide the tooltip
			mouseout: function(e) {
				$(this).siblings("." + rsCalculator.options.tooltipClass).hide();
			}
		});
		// Update the percentage of employees in the turnover costs calculator when the field loses focuses or the user hits esc or return
		$(".readonly", rsCalculator.$el).on("blur keyup", function(e) {
			// Workaround for Firefox that prevents blur from triggering when
			// another element is given focus
			if (rsCalculator.changingPercentage === true) {
				return;
			}
			// Hide the tooltip when a percentage is added
			// (mainly for touch devices as the tooltip will still be open)
			$("." + rsCalculator.options.tooltipClass).hide();
			// Only update the percentage when return or esc keys are hit
			if (e.type === "keyup" && e.keyCode !== 13 && e.keyCode !== 27) {
				return;
			}
			// Strip all but numbers
			var val = parseFloat($(this).val().replace(/[^0-9]/g, ""));
			$changePercentage = $(e.target).siblings("label").find(".change-percentage");
			$changePercentage = $(e.target).parents("li").find(".change-percentage");
			// If the value isn't between 1 - 100, reset to default
			if (!(val > 0 && val <= 100)) {
				val = $changePercentage.data("rs-percentage");
			}
			$changePercentage.text(val + "%");
			$(".q2, .q3", rsCalculator.$el).show();
			$(this).val(val).hide();
			calculatorName = $(this).parents("." + 'w_lightbox__item').attr("calc");
			//console.log('line-142-',calculatorName);
			rsCalculator.update(calculatorName);
			$(e.target).siblings("." + rsCalculator.options.percentageIndicatorClass).addClass("hidden");
		});
		// Open the calculator when an element with a class of
		// "rs-calculator-button" is clicked
		rsCalculator.openButton.on("click", function(e) {
			e.preventDefault();
			calculatorName = $(this).attr("calc");
			rsCalculator.open($("#" + calculatorName));
			//console.log('open-',calculatorName);
			if (window.utag) {
				if (calculatorName === 'rs-calculator-fte') {
					utag.link({_ga_category: 'calculator',_ga_action: 'click',_ga_label: 'fte employee'});
				}
				if (calculatorName === 'rs-calculator-lp') {
					utag.link({_ga_category: 'calculator',_ga_action: 'click',_ga_label: 'lost production'});
				}
				if (calculatorName === 'rs-calculator-turn') {
					utag.link({_ga_category: 'calculator',_ga_action: 'click',_ga_label: 'turnover'});
				}
			}
		});
		
		//This shows the FTE calculator via a direct link
		$(document).ready( function() {
			//console.log('loaded');
			if (window.location.hash == "#fte-calc") {
				//alert('fte should fire');
				//e.preventDefault();
				calculatorName = 'rs-calculator-fte';
				rsCalculator.open($("#rs-calculator-fte"));
				//We must set a timeout otherwise utag.link has not loaded in my testing of this.
				setTimeout(function(){
					if (window.utag) {
					utag.link({_ga_category: 'calculator',_ga_action: 'open on pageload',_ga_label: 'fte employee',_ga_nonInteract: 1});
					}
				}, 2000);
				require(['/_Global-Assets/js/common.js'], function (common) {
					require.config({
					baseUrl: '/_Global-Assets/js/'
					});
					requirejs(['lib/common_components/LightboxModal', 'site'],
						function (LightboxModal, site) {
							(function() {
								fteLightbox = new LightboxModal({
									el: $("#fte-calculator")
								});
								$('.tool_hide.hide-modal').on("click", function() {
									fteLightbox.hide(); 
								});
							})();
						}
					);
				});
			}
		});
		
		//This shows the lost productivity calculator via a direct link
		$(document).ready( function() {
			//console.log('loaded');
			if (window.location.hash == "#lost-prod") {
				//alert('lost prod should fire');
				//e.preventDefault();
				calculatorName = 'rs-calculator-lp';
				rsCalculator.open($("#rs-calculator-lp"));
				
				//We must set a timeout otherwise utag.link has not loaded in my testing of this.
				setTimeout(function(){
					if (window.utag) {
					utag.link({_ga_category: 'calculator',_ga_action: 'open on pageload',_ga_label: 'lost production',_ga_nonInteract: 1});
					}
				}, 2000);
				
				require(['/_Global-Assets/js/common.js'], function (common) {
					require.config({
					baseUrl: '/_Global-Assets/js/'
					});
					requirejs(['lib/common_components/LightboxModal', 'site'],
						function (LightboxModal, site) {
							(function() {
								$site = $('#root');
								lpLightbox = new LightboxModal({
									el: $("#lost-productivity")
								});
								$('.tool_hide.hide-modal').on("click", function() {
									lpLightbox.hide(); 
								});
							})();
						}
					);
				});
			}
		});
		
		//This shows the turnover calculator via a direct link
		$(document).ready( function() {
			//console.log('loaded');
			if (window.location.hash == "#turnover") {
				//alert('turnover should fire');
				//e.preventDefault();
				calculatorName = 'rs-calculator-turn';
				rsCalculator.open($("#rs-calculator-turn"));
				
				//We must set a timeout otherwise utag.link has not loaded in my testing of this.
				setTimeout(function(){
					if (window.utag) {
					utag.link({_ga_category: 'calculator',_ga_action: 'open on pageload',_ga_label: 'turnover',_ga_nonInteract: 1});
					}
				}, 2000);
				
				require(['/_Global-Assets/js/common.js'], function (common) {
					require.config({
					baseUrl: '/_Global-Assets/js/'
					});
					requirejs(['lib/common_components/LightboxModal', 'site'],
						function (LightboxModal, site) {
							(function() {
								$site = $('#root');
								turnLightbox = new LightboxModal({
									el: $("#turnover-calculator")
								});
								$('.tool_hide.hide-modal').on("click", function() {
									turnLightbox.hide(); 
								});
							})();
						}
					);
				});
			}
		});
		
		
		
		
		// Close the calculator when the close button is clicked
		rsCalculator.closeButton.on("click", function(e) {
			e.preventDefault();
			calculatorName = $(this).parents("." + 'w_lightbox__item').attr("calc");
			rsCalculator.close($("#" + calculatorName));
			//console.log('close-',calculatorName);
		});
		// Close the calculator if the bg overlay is clicked
		$('.w_lightbox_overlay').on("click", function(e) {
			//if ($(e.target).hasClass(rsCalculator.options.containerClass)) {
				e.preventDefault();
				calculatorName = $('.rs-calculator-container.open').attr("id");
				rsCalculator.close($("#" + calculatorName));
				//console.log('close-bg-',calculatorName);
			//}
		});
		// Update the total when values are changed
		$("input:not(.q2perc, .q3perc)", rsCalculator.$el).on(inputEvent, function(e) {
			e.preventDefault();
			calculatorName = $('.rs-calculator-container.open').attr("id");
			//calculatorName = $(this).parents("." + 'w_lightbox__item').attr("calc");
			rsCalculator.update(calculatorName);
			//console.log('line-188-',calculatorName);
		});
	},
	/**
	* Used in the Turnover calculator. Changes the second question to an input
	* field so the user can change the percentage for the algorithm
	*/
	changePercentage: function(e, $el) {
		e.preventDefault();
		calculatorName = $('.rs-calculator-container.open').attr("id");
		//calculatorName = $el.parents("." + 'w_lightbox__item').attr("calc");
		//console.log('line-202-',calculatorName);
		$calculatorSelected = $("#" + calculatorName);
		rsCalculator.changingPercentage = true;
		setTimeout(function() {
			rsCalculator.changingPercentage = false;
		}, 100);
		relatedName = $el.prop("name");
		$related = $("#" + relatedName);
		//console.log('line-214(relatedName)-',relatedName);
		// Hide q2 and replace it with the percentage input
		$(".q2, .q3", $related).hide();
		$(".q2perc, .q3perc", $related).show().val("").focus();
		$("." + rsCalculator.options.percentageIndicatorClass, $related).removeClass("hidden");
	},
	/*
	 *
	 */
	blink: {
		timer: undefined,
		interval: undefined,
		// Blink 3 times
		animate: function($el) {
			for (i=0;i<3;i++) {
				$el.fadeTo('fast', .6).fadeTo('fast', 1);
			}
		},
		// Wait 1 second before blinking, and then every 5 seconds after that
		on: function($el) {
			var self = this;
			if (Modernizr.cssanimations === false) {
				// Fallback for no CSS animation support
				if (this.interval === undefined) {
					this.timer = setTimeout(function() {
						self.animate($el);
						self.interval = setInterval(function() {
								self.animate($el);
						}, 5000);
					}, 1000);
				}
			} else {
				// Modern Browsers
				$el.addClass(rsCalculator.options.blinkClass);
			}
		},
		// Stop blinking
		off: function($el) {
			$changePercentage = $el.find(".change-percentage");
			if (Modernizr.cssanimations === false) {
				// Fallback for no CSS animation support
				$changePercentage.css("opacity", 1);
				clearInterval(this.interval);
				clearTimeout(this.timer);
				this.timer = undefined;
				this.interval = undefined;
			} else {
				// Modern Browsers
				$changePercentage.removeClass(rsCalculator.options.blinkClass);
			}
		}
	},
	/*
	 * open a calculator
	 *
	 * $el: the calculator element to open
	 */
	 
	open: function($el) {
		// Don't go any further if an element wasn't specified
		if ($el === undefined || $el.data("isOpen") === true) {
		//console.log('293-undefined or open is true')
			return;
		}
		// Get the default percentage
		$changePercentage = $el.find(".change-percentage");
		var noOfChangePercentage = $changePercentage.length,
				i,
				$element,
				relatedName,
				$related,
				percentage,
				$q4 = $el.find(".q4");
		// Reset the form values
		$("input:not(.q4)", $el).val("");
		$el.find(".result .figure").text("0");
		$q4.val($q4.data("rs-default"));
		for (i = 0; i < noOfChangePercentage; i++) {
			$element = $($changePercentage[i]);
			percentage = parseInt($element.data("rs-percentage"));
			relatedName = $element.prop("name");
			$related = $("#" + relatedName);
			$(".readonly", $related).val(percentage);
			$($element).text(percentage + "%");
		}
		this.blink.on($changePercentage);
		$el.data("isOpen", true);
		// Open the calculator using CSS3 transforms, or basic CSS if not available
/*		if (Modernizr.csstransforms === true && Modernizr.csstransitions === true) {
*/
			$el.addClass("open");
	/*	} else {
			//css = {};
			if (Modernizr.opacity === true) {
				css["opacity"] = 1;
			}
			css["visibility"] = "visible";
			$el.css(css);
		}
*/
	},
	/*
	 * close the calulcator
	 *
	 * $el: the calculator element to close
	 */
	close: function($el) {
		// Don't go any further if an element wasn't specified
		if ($el === undefined) {
			return;
		}
		this.blink.off($el);
		if ($el.data("isOpen") === true) {
			$el.data("isOpen", false);
/*			if (Modernizr.csstransforms === true && Modernizr.csstransitions === true) { */
				$el.removeClass("open");
/*			} else {
				css = {};
			
				if (Modernizr.opacity === true) {
					css["opacity"] = 0;
				} 
				
				css["visibility"] = "hidden";
				$el.css(css);
			}
			*/
		}
	},
	// Algorithms for each calculator type
	calculate: {
		fte: function(q1, q3) {
			return Math.round((q3/120) + q1);
		},
		turn: function(q1, q2, $q2, $q3, $q2Perc, $q3Perc) {
			var perc2 = $q2Perc.val().replace(/[^0-9]/g, "") / 100,
					perc3 = $q3Perc.val().replace(/[^0-9]/g, "") / 100,
					defaultPerc2 = $q2Perc.parents("li").find(".change-percentage").data("rs-percentage");
					defaultPerc3 = $q3Perc.parents("li").find(".change-percentage").data("rs-percentage");
			// Fallback to the default percentage if it doesn't validate
			if (perc2 <= 0 && perc2 > 1) {
				perc2 = defaultPerc2 / 100;
			}
			if (perc3 <= 0 && perc3 > 1) {
				perc3 = defaultPerc3 / 100;
			}
			q2 = (q1 * perc2).toFixed(2);
			// Only show decimal places if necessary
			if (parseFloat(q2) % 1 === 0) {
				q2 = parseFloat(q2).toFixed(0);
			}
			$q2.val(q2);
			q3 = (q1 * perc3).toFixed(2);
			// Only show decimal places if necessary
			if (parseFloat(q3) % 1 === 0) {
				q3 = parseFloat(q3).toFixed(0);
			}
			$q3.val(q3);
			var averageSalary = rsCalculator.options.averageSalary;
			return Math.round(q2 * (averageSalary * perc3));
		},
		lp: function(q1, q2, $q2, $q3, $q2Perc, $q3Perc, q4) {
			var perc2 = $q2Perc.val().replace(/[^0-9]/g, "") / 100,
					perc3 = $q3Perc.val().replace(/[^0-9]/g, "") / 100,
					defaultPerc2 = $q2Perc.parents("li").find(".change-percentage").data("rs-percentage"),
					defaultPerc3 = $q3Perc.parents("li").find(".change-percentage").data("rs-percentage");
			// Fallback to the default percentage if it doesn't validate
			if (perc2 <= 0 && perc2 > 1) {
				perc2 = defaultPerc2 / 100;
			}
			if (perc3 <= 0 && perc3 > 1) {
				perc3 = defaultPerc3 / 100;
			}
			q2 = (q1 * perc2).toFixed(2);
			// Only show decimal places if necessary
			if (parseFloat(q2) % 1 === 0) {
				q2 = parseFloat(q2).toFixed(0);
			}
			$q2.val(q2);
			q3 = (q1 * perc3).toFixed(2);
			// Only show decimal places if necessary
			if (parseFloat(q3) % 1 === 0) {
				q3 = parseFloat(q3).toFixed(0);
			}
			$q3.val(q3);
			return Math.round(q1 * perc2 * q4 * perc3);
		}
	},
	/**
	 * Add commas to a number where necessary
	 */
	addCommas: function(nStr) {
		nStr += '';
		x = nStr.split('.');
		x1 = x[0];
		x2 = x.length > 1 ? '.' + x[1] : '';
		var rgx = /(\d+)(\d{3})/;
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + ',' + '$2');
		}
		return x1 + x2;
	},
	/*
	 * update the total
	 */
	 
	update: function(calculatorName) {
	//calculatorName = $('.rs-calculator-container.open').attr("id");
//console.log('491-', calculatorName);
		var $el = $("#" + calculatorName);
//console.log('493-', $el);
		var $q1 = $el.find(".q1"),
				$q2 = $el.find(".q2"),
				$q2Perc = $el.find(".q2perc"),
				$q3Perc = $el.find(".q3perc"),
				$q3 = $el.find(".q3"),
				$q4 = $el.find(".q4");
		//get the user submitted values and convert them to numbers
		var q1 = parseInt($q1.val()),
				q2 = parseInt($q2.val()),
				q3 = parseInt($q3.val()),
				q4 = parseInt($q4.val()),
				total = 0;
		if (isNaN(q1)) {
			q1 = 0;
		}
		if (isNaN(q2)) {
			q2 = 0;
		}
		if (isNaN(q3)) {
			q3 = 0;
		}
		if (isNaN(q4)) {
			q4 = 0;
		}
		var $result = $el.find(".result .figure");
		// Calculate the total
		//calculatorName = $('.rs-calculator-container.open').attr("id");
		//console.log('527-', calculatorName);
		switch(calculatorName) {
			case "rs-calculator-fte":
				total = rsCalculator.calculate.fte(q1, q3);
				break;
			case "rs-calculator-turn":
				total = rsCalculator.calculate.turn(q1, q2, $q2, $q3, $q2Perc, $q3Perc);
				break;
			case "rs-calculator-lp":
				total = rsCalculator.calculate.lp(q1, q2, $q2, $q3, $q2Perc, $q3Perc, q4);
				break;
		}
		// All questions must be answered on the FTE calculator
		if (($q3.val() === "" && calculatorName === "rs-calculator-fte")) {
			total = 0;
		}
		//change the total to "0" to show calculation is in progress
		$result.text("0");
		//if there is a total, show it after a small delay
		setTimeout(function() {
			if (total !== 0 && $q1.val() !== "" && $q2.val() !== "" && $q3.val() !== "") {
				$result.text(rsCalculator.addCommas(total));
			}
		}, 250);
	}
};