define([
	],
	function() {

		function ValueFilter (elements) {

			this.elements = elements;
			this.value = 0;
		}

		ValueFilter.prototype.update = function() {
			var $item,
				self = this;

			this.elements.each(function (index, item) {
				$item = $(item);
				if ( compare($item.data("compareVal"), $item.data("compare"))) {
					$item.addClass("show");
				} else {
					$item.removeClass("show");
				}
			});

			function compare (value, comparisonOperator) {

				switch(comparisonOperator) {
					case "<=" :
						return self.value <= value;
					case ">=" :
						return self.value >= value;
					case "==" :
						return self.value == value;
					default:
						return false;
				}
			}
		};

		ValueFilter.prototype.setValue = function (value) {
			this.value = value;
			this.update();
		};

		return ValueFilter;
	}
);
