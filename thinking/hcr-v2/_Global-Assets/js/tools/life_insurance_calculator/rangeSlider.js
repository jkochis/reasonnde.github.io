define([
		'hammer',
		'jquery-hammer'
	],
	function(Hammer) {

		function Slider (el, data) {

			var self = this;
			var $el = el,
				hitfieldEl = $el.find('.lic-range-hitfield'),
				rangeValueEl = $el.find('.lic-range-value')[0],
				rangeAverageEl = $el.find('.lic-range-average')[0];
			var trackInit = true;
		
			var min = data.min,
				max = data.max,
				step = data.step,
				ave = data.avg,
				difference = max - min,
				value = data.value;

			this.value = value;

			var percentage = (1 - (max - ave) / difference) * 100;
			rangeAverageEl.style.left = percentage  + '%';

			var initialValue = 0;

			//Hammer(hitfieldEl).on('touch', function(e) {
			hitfieldEl.hammer().on('touch click', function (e) {

				e.preventDefault();
				if(trackInit){
					var question = $(this).parent().parent().parent().find(".question-title-index").text().replace(".","");
					//console.log(question);
					if (window.utag) {
						utag.link({_ga_category: 'life insurance calculator',_ga_action: 'initiation',_ga_label: 'question : '+question});
					}
					trackInit = false;
				}
				//
				if (e.gesture) {
					initialValue = e.gesture.center.pageX - this.getBoundingClientRect().left;
				} else {
					initialValue = e.pageX - this.getBoundingClientRect().left;
				}
				updateDrag(0);
			});

			//Hammer(hitfieldEl).on('drag', function(e) {
			hitfieldEl.hammer().on('drag', function (e) {
				e.preventDefault();
				updateDrag(e.gesture.deltaX);
			});

			//Hammer(hitfieldEl).on('touchend', function(e) {
			hitfieldEl.hammer().on('touchend', function (e) {
				e.preventDefault();
			});
		//	$('.bt-action').on('click', function (event) {
		//		event.preventDefault();
				
		//		if (window.utag) {
				//utag.link({_ga_category: 'life insurance calculator',_ga_action: 'submit',_ga_label: 'get results button'});
		//		}
		//		window.location = "#/lic/results";
		//	});
			

			function updateDrag(delta) {

				var offset = initialValue + delta,
					percentage = Math.max(0, Math.min(1, offset / $el[0].offsetWidth)),
					newValue = min + step * Math.round((difference * percentage) / step);

				self.value = newValue;
				updateValue();
			}

			function updateValue() {

				var stepPercentage = 100 * (self.value - min) / difference;
				rangeValueEl.style.width = stepPercentage + '%';

				self.notifyChange(self.value);
			}

			Slider.prototype.updateValue = updateValue;

			updateValue();
		}

		Slider.prototype.setValue = function (value) {
			this.value = value;
			this.updateValue();
		};

		Slider.prototype.onChange = function (cb) {
			this.onChangeHandler = cb;
		};

		Slider.prototype.notifyChange = function (newValue) {
			this.value = newValue;
			if (this.onChangeHandler) {
				this.onChangeHandler(newValue);
			}
		};

		return Slider;
	}
);
