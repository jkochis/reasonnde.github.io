define([
	"underscore",
	"lib/Env",
	"lib/Util",
	"lib/MediaQueries",
	"lib/common_components/InfoboxPopup",
	"widgets/ErrorLightbox",
	"./FormHelper",
	"./StepView",
	"./EmployersFormStartModel"
],
function(
	_,
	Env,
	Util,
	MediaQueries,
	InfoboxPopup,
	ErrorLightbox,
	FormHelper,
	StepView,
	FormModel
) {
	var EmployersStartStep = StepView.extend({
		
		errorFeedback: false,
		initialize: function(options) {
			this.model = new FormModel();
			this.formHelper = new FormHelper({
				el: this.el,
				model: this.model
			});
			this.checkboxes = [];
			var checkboxNames = ["individual", "group", "findout"];
			_.each(this.formHelper.inputs, _.bind(function(input, index, list) {
				if(_.contains(checkboxNames, input.name)) {
					this.checkboxes.push(input);
					input.on("change", this.onChangeCheckbox, this);
				}
			}, this));
			
			
			this.$formFields = this.$(".form-fields");
			this.$formFields.find("input[name='group']").parent().on("click", this, this.onHover);
			this.model.on("change", this.onModelChange, this);
			this.setErrorFeedback(true);
		},
		reset: function() {
			this.formHelper.reset();
		},
		removeErrors: function() {
			this.formHelper.removeErrors();
		},
		setErrorFeedback: function(enable) {
			if(this.errorFeedback != enable) {
				this.errorFeedback = enable;
				if(enable) {
					this.model.on("invalid", this.onInvalidModel, this);
				}
				else {
					this.model.off("invalid", this.onInvalidModel, this);
				}
			}
		},
		setData: function(data) {
			_.each(this.formHelper.inputs, _.bind(function(input, index, list) {
				if(_.has(data, input.name)) {
					input.setValue(data[input.name]);
				}
			}, this));
		},
		onHover: function() {
	//		console.log(this);
		//	utag.link({_ga_category: 'lead form',_ga_action: 'error',_ga_label: 'form validation error step 1'});
			//this.formHelper.setError(error.fields);
			var disabled = $("input[name='group']").is(':disabled');
			if(disabled){
				if (!Util.isSpanish()) {
					if(!Env.IE8 && matchMedia(MediaQueries.HEADER_HAMBURGER).matches) {
						var lightbox = new ErrorLightbox({
							data: {
							title: "Group Products",
							message: "Group products are only offered for 100 lives or more",
							}
						});
						lightbox.show();
					} else {
						var isFixed = Util.isPositionFixed(this);
						var listBoundingRect = this.getBoundingClientRect();
						var infoboxPopup = new InfoboxPopup({
							title: "Group Products",
							message: "Group products are only offered for 100 lives or more",
							origin: {
								position: "absolute",
								top: (listBoundingRect.top + listBoundingRect.bottom) / 2 + (isFixed ? 0 : $(window).scrollTop()),
								left: listBoundingRect.left + (isFixed ? 0 : $(window).scrollLeft())
							},
							error: false
						});
						infoboxPopup.show();
					}
				} else {
					if(!Env.IE8 && matchMedia(MediaQueries.HEADER_HAMBURGER).matches) {
						var lightbox = new ErrorLightbox({
							data: {
							title: "Productos de Grupo",
							message: "Productos de Grupo son solamente ofrecidos para companies con más de 100 empleados",
							}
						});
						lightbox.show();
					} else {
						var isFixed = Util.isPositionFixed(this);
						var listBoundingRect = this.getBoundingClientRect();
						var infoboxPopup = new InfoboxPopup({
							title: "Productos de Grupo",
							message: "Productos de Grupo son solamente ofrecidos para companies con más de 100 empleados",
							origin: {
								position: "absolute",
								top: (listBoundingRect.top + listBoundingRect.bottom) / 2 + (isFixed ? 0 : $(window).scrollTop()),
								left: listBoundingRect.left + (isFixed ? 0 : $(window).scrollLeft())
							},
							error: false
						});
						infoboxPopup.show();
					}
				}
			}
		},
		onInvalidModel: function(model, error, options) {
			if (window.utag) {
				utag.link({_ga_category: 'lead form',_ga_action: 'error',_ga_label: 'form validation error step 1'});
			}
			this.formHelper.setError(error.fields);
			if(!Env.IE8 && matchMedia(MediaQueries.HEADER_HAMBURGER).matches) {
				var lightbox = new ErrorLightbox({
					data: {
						title: "Error",
						message: error.message
					}
				});
				lightbox.show();
			}
			else {
				var isFixed = Util.isPositionFixed(this.$formFields[0]);
				var listBoundingRect = this.$formFields[0].getBoundingClientRect();
				var infoboxPopup = new InfoboxPopup({
					title: "Error",
					message: error.message,
					origin: {
						position: isFixed ? "fixed" : "absolute",
						top: (listBoundingRect.top + listBoundingRect.bottom) / 2 + (isFixed ? 0 : $(window).scrollTop()),
						left: listBoundingRect.left + (isFixed ? 0 : $(window).scrollLeft())
					},
					error: true
				});
				infoboxPopup.show();
			}
		},
		onChangeCheckbox: function(checkboxView) {
			
			// Clear all error states
			for(var i = 0; i < this.checkboxes.length; i++) {
				var checkbox = this.checkboxes[i];
				checkbox.setError(false);
			}
		},
		
		onModelChange: function(checkboxView) {
			if(!this.model.get('initiated')){
				this.model.set('initiated', true);
				if (window.utag) {
					utag.link({_ga_category: 'lead form',_ga_action: 'initiate',_ga_label: utag.data.form_type});
				}
			}
			if (this.model.get("employeecount") === "24" || this.model.get("employeecount") === "99" || this.model.get("employeecount") === "2") {
				//group
				this.$formFields.find("input[name='group']").prop("disabled", true);;
				this.$formFields.find("input[name='group']").parent().css('color','#D0D0D0');
				this.$formFields.find("span#bizgroup").css('visibility','inherit');
			}
			else{
				this.$formFields.find("input[name='group']").prop("disabled", false);
				this.$formFields.find("input[name='group']").parent().css('color','');
				this.$formFields.find("span#bizgroup").css('visibility','');
			}
			 if(this.model.get("employeecount") === "2") {
				$("div#individualsproductsonly").show();
			 }else{
				$("div#individualsproductsonly").hide();
			 }
			
		}
		
	});
	return EmployersStartStep;
});