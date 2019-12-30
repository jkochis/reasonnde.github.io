define([
	"underscore",
	"backbone",
	"lib/Env",
	"lib/Util",
	"lib/SelectCollection",
	"lib/BaseView"
],
function(
	_,
	Backbone,
	Env,
	Util,
	SelectCollection,
	BaseView
) {
	var FormDropdown = BaseView.extend({

		initialize: function(options) {
			_.bindAll(this,
				"onClick"
			);

			options = _.extend({
				scrollThreshold: this.$el.data('scroll-threshold'),
				charLimit: this.$el.data('char-limit')
			}, options);



			this.$select = this.$("select");
			this.$label = this.$(".dropdown-title p");

			this.name = this.$select.attr("name");
			this.placeholderText = this.$label.text();
			this.scrollThreshold = options.scrollThreshold || '';
			this.charLimit = options.charLimit || '';

			this.list = new FormDropdownList({
				select: this.$select,
				scrollThreshold: options.scrollThreshold
			});

			if(Env.IOS || Env.ANDROID) {
				this.$select.css("display", "block");
			}
			else {
				this.$el.on("click", this.onClick);
			}
			this.list.model.on("change:isVisible", this.onChangeIsVisible, this);
			this.list.optionCollection.on("changeselectedmodel", this.onChangeSelectedModel, this);
		},

		getValue: function() {
			var value = "";
			if(this.list.optionCollection.selectedModel) {
				value = this.list.optionCollection.selectedModel.get("value");
			}

			return value;
		},

		setValue: function(value) {
			var model = this.list.optionCollection.findWhere({value: value});
			if(model) {
				model.set("selected", true);
			}
			else {
				this.list.optionCollection.clearSelection();
			}
		},

		getOptionCollection: function() {
			return this.list.optionCollection;
		},

		clear: function() {
			this.list.clear();
		},

		setError: function(hasError) {
			if(hasError) {
				this.$el.addClass("has-error");
			}
			else {
				this.$el.removeClass("has-error");
			}
		},

		onClick: function(event) {
			event.preventDefault();

			this.setError(false);

			var isFixed = Util.isPositionFixed(this.el);
			var rect = this.el.getBoundingClientRect();
			this.list.setDimensions({
				position: isFixed ? "fixed" : "absolute",
				left: rect.left + (isFixed ? 0 : $(window).scrollLeft()),
				width: rect.right - rect.left,
				top: rect.bottom + (isFixed ? 0 : $(window).scrollTop())
			});

			setTimeout(_.bind(function() {
				this.list.toggle();
				if(this.scrollThreshold) {
					this.list.setScrollDimensions({
						height: this.list.getOptionsHeight(this.scrollThreshold)
					})
				}
			}, this), 0)
		},

		onChangeIsVisible: function(model, value, options) {
			if(value) {
				this.$el.addClass("is-focus");
			}
			else {
				this.$el.removeClass("is-focus");
			}
		},

		onChangeSelectedModel: function(selectedModel) {
			if(selectedModel) {
				var str = selectedModel.get("label");
				if(this.charLimit && str.length > this.charLimit) {
					str = str.substr(0, this.charLimit) + '...';
				} 
				this.$label.text(str);
				this.$el.addClass("has-selection");
			}
			else {
				this.$label.text(this.placeholderText);
				this.$el.removeClass("has-selection");
			}

			this.setError(false);
			this.trigger("change", this);
		}

	}, {
		build: function() {
			$(".dropdown-box").each(function(i, el) {
				var manual = $(el).data("manual");
				if(!manual || manual == "0" || manual == "false") {
					new FormDropdown({
						el: el
					});
				}
			});
		}
	});

	var FormDropdownList = BaseView.extend({

		options: null,

		initialize: function(options) {
			_.bindAll(this,
				"onChangeSelect",
				"onClickDocument",
				"onResizeWindow"
			);

			this.$select = $(options.select);

			this.$el.addClass("w-dropdown-list");

			if(options.scrollThreshold) {
				this.$el.append('<div class="w-dropdown-list-wrapper"></div>');
				this.$wrapper = this.$el.find('.w-dropdown-list-wrapper');
			} else {
				this.$wrapper = this.$el;
			}

			this.model = new Backbone.Model({
				"isVisible": false
			});

			this.options = [];
			this.optionCollection = new SelectCollection();
			this.$select.find("option").each(_.bind(function(i, el) {
				var $el = $(el);
				var model = new Backbone.Model({
					label: $el.text(),
					value: $el.attr("value")
				});

				var $option = $("<a/>", {
					"href": "#"
				});
				this.$wrapper.append($option);
				this.options.push(new FormDropdownOption({
					el: $option,
					model: model
				}));
				this.optionCollection.add(model);
			}, this));

			this.$select.on("change", this.onChangeSelect);
			this.model.on("change:isVisible", this.onChangeIsVisible, this);
			this.optionCollection.on("changeselectedmodel", this.onChangeSelectedModel, this);
		},

		setDimensions: function(dimensions) {
			this.$el.css(dimensions);
		},

		setScrollDimensions: function(dimensions) {
			this.$wrapper.css(dimensions);
		},

		getOptionsHeight: function(size) {
			var total = 0,
				$option = this.$wrapper.find("a");
			for( var i=0; i<size; i++ ) {
				total += $option.eq(i).outerHeight()
			}
			return total;
		},

		clear: function() {
			this.$select.prop("selectedIndex", -1);
			if(this.optionCollection.selectedModel) {
				this.optionCollection.selectedModel.set("selected", false);
			}
		},

		toggle: function() {
			this.model.set("isVisible", !this.model.get("isVisible"));
		},

		show: function() {
			this.model.set("isVisible", true);
		},

		hide: function() {
			this.model.set("isVisible", false);
		},

		_show: function() {
			$(document.body).append(this.$el);
			$(window).on("resize", this.onResizeWindow);
			setTimeout(_.bind(function() {
				$('body').on("click", this.onClickDocument);
			}, this), 0);
		},

		_hide: function() {
			this.$el.detach();
			$(window).off("resize", this.onResizeWindow);
			$('body').off("click", this.onClickDocument);
		},

		onChangeSelect: function(event) {
			var option = this.optionCollection.findWhere({"value": this.$select.val()});
			if(option) {
				option.set("selected", true);
			}
			else {
				this.optionCollection.selectedModel.set("selected", false);
			}
		},

		onClickDocument: function(event) {
//		if(event.target != this.el && !this.$(event.target).length) {
			this.model.set("isVisible", false);
//		}
		},

		onResizeWindow: function() {
			this.model.set("isVisible", false);
		},

		onChangeIsVisible: function(model, value, options) {
			if(value) {
				this._show();
			}
			else {
				this._hide();
			}
		},

		onChangeSelectedModel: function(selectedModel) {
			if(selectedModel) {
//			this.model.set("isVisible", false);
				this.$select.val(selectedModel.get("value"));
			}
			else {
				this.$select.val("");
			}
		}

	});

	var FormDropdownOption = BaseView.extend({

		initialize: function(options) {
			_.bindAll(this,
				"onClick"
			)

			this.$el.text(this.model.get("label"));

			this.$el.on("click", this.onClick);
			this.model.on("change:selected", this.onChangeSelected, this);
		},

		onClick: function(event) {
			event.preventDefault();

			this.model.set("selected", true);
    //Added By Dustin Lyon 8/10/2014 
   //  var dropVal = this.model.attributes.value;
     // console.log(this.model);
    //  $("option[value='"+dropVal+"']").attr('selected', 'selected');

    //  for (var i = 0; i < this.model.collection.models.length; i++) {
    //    if (this.model.collection.models[i].attributes.selected == false)
    //    {
    //       $("option[value='"+this.model.collection.models[i].attributes.value+"']").removeAttr("selected");
    //    }
   //   }
      // End Added by DL
		},

		onChangeSelected: function(model, value, options) {
			if(value) {
				this.$el.addClass("is-selected");
				
				    //Added By Dustin Lyon 8/10/2014 
					 var dropVal = this.model.attributes.value;

					 // console.log(this.model);
					  $("option[value='"+dropVal+"']").attr('selected', 'selected');


					  // End Added by DL
				
				
			}
			else {
				this.$el.removeClass("is-selected");
					for (var i = 0; i < this.model.collection.models.length; i++) {
						if (this.model.collection.models[i].attributes.selected == false)
						{
						   $("option[value='"+this.model.collection.models[i].attributes.value+"']").removeAttr("selected");
						}
					}
			}
		}

	});

	FormDropdown.List = FormDropdownList;

	return FormDropdown;
});