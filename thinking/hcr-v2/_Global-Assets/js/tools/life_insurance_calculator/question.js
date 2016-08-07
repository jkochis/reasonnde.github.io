define([
		'./rangeSlider',
		'./valueFilter',
		'lib/Util',
		/*,
		'tools/agent_locator/core/constants',
		'tools/agent_locator/core/eventBus',
		'tools/agent_locator/core/utils',
		'tools/agent_locator/detailController',
		*/
	],
	function( RangeSlider, ValueFilter, Util) {

		function QuestionController ($el) {

			this.el = $el;

			var el = $el,
				valueTextEl = $el.find(".questionnaire-value-text"),
				valuePostElements = $el.find(".question-value-post"),
				legalAsterisk = $el.find(".questionnaire-value sup"),
				legalButton = $el.find(".lic-question-legal-icon");

			var sliderEl = $el.find(".lic-range-slider"),
				sliderConfig = {
					min : el.data("min"),
					max : el.data("max"),
					step : el.data("step"),
					avg : el.data("avg"),
					difference : el.data("max") - el.data("min"),
					value : el.data("default")
				};

			var disclaimerCopy = el.data("disclaimer");

			var rangeSlider = new RangeSlider(sliderEl, sliderConfig);
			rangeSlider.onChange(changeHandler.bind(this));

			this.value = rangeSlider.value;

			var valueFilter = new ValueFilter(valuePostElements);
			valueFilter.setValue(sliderConfig.value);


			function changeHandler (value) {

				// set text
				valueTextEl.text( Util.currencyFormat(value, 0) );
				valueFilter.setValue(value);

				if (value == sliderConfig.avg) {
					legalAsterisk.addClass("active");
				} else {
					legalAsterisk.removeClass("active");
				}

				this.value = value;
			}

			changeHandler(rangeSlider.value);

			var disclaimerEl = $(".disclaimerContainer"),
				disclaimerCopyEl = $(".disclaimerContainer-copy");

			legalButton.on("click touchend", function () {

				disclaimerCopyEl.text(disclaimerCopy);
				disclaimerEl.trigger("show");

			});
		}

		QuestionController.prototype.getType = function() {
			return this.el.data("type");
		};

		QuestionController.prototype.getValue = function() {
			return this.value;
		};

		return QuestionController;
	});


