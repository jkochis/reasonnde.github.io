
define([
	"underscore",
	"lib/Env",
	"lib/Util",
	"lib/MediaQueries",
	"lib/BaseView",
	"lib/common_components/InfoboxPopup",
	"widgets/ErrorLightbox",
	"./FormHelper",
	"./ProvidersFormModel"
],
function(
	_,
	Env,
	Util,
	MediaQueries,
	BaseView,
	InfoboxPopup,
	ErrorLightbox,
	FormHelper,
	FormModel
) {

	var ProvidersForm = BaseView.extend({
		el: 'form#dental-providers',
		initialize: function(options) {
			
			_.bindAll(this,
				"onClickSubmit"
			);
			
			this.model = new FormModel();
			this.$input = this.$(".input-text input, .input-text textarea, select");
			this.$form = this.$("input[name='form']");
			this.$request = this.$("");
			
			/*if(this.$form){
				this.model.set(this.$form.attr("name"), this.$form.val());
			}
			
			var map = {};
			
			this.$input.each(function(){
				var value = $(this).attr('name');
				map[value] = "";
			});
			this.model.set(map);*/
			
			this.formHelper = new FormHelper({
				el: this.el,
				model: this.model
			});

			this.$formPanel = this.$(".form-panel");
			this.$completePanel = this.$(".complete-panel");
			this.$submit = this.$(".dental-submit");
			this.$formFields = this.$el;

			this.$("input[name=ada_code]").mask("*?****", {placeholder: ""});
			this.$("input[name=policy_number]").mask("*?*******", {placeholder: ""});

			this.model.on("invalid", this.onInvalidModel, this);
			this.$submit.on("click", this.onClickSubmit);
			this.$('.reset').on('click', this.reset);
			this.reset();	
			
			this.model.on("change", this.onModelChange, this);
			//console.dir(this);
		},
		onSelect: function (){
			/*var m = {};
			this.$el.find(".dropdown-box").each(function(){				
				var value = $(this).find("select").attr("name");
				m[value] = $(this).find("option[selected='selected']").text();
			});
			this.$el.find("textarea").each(function(){				
				var value = $(this).attr("name");
				m[value] = $(this).val();
			});
			this.model.set(m);*/
		},
		onModelChange: function() {
			if(!this.model.get('initiated')){
				this.model.set('initiated', true);
			}
		},
		reset: function() {
			this.formHelper.reset();
			this.$formPanel.css("display", "block");
			this.$completePanel.css("display", "none");
			$('table#provider-output').css('display', 'none');
			$('div.coverage_type').css('display', 'none');
		},

		removeErrors: function() {
			this.formHelper.removeErrors();
		},

		onInvalidModel: function(model, error, options) {
			this.formHelper.setDentalError(error.fields);


			if(!Env.IE8 && matchMedia(MediaQueries.HEADER_HAMBURGER).matches) {
				var errorLightbox = new ErrorLightbox({
					data: {
						title: "Error",
						message: error.message
					}
				});
				errorLightbox.show();
			}
			else {
				var isFixed = Util.isPositionFixed(this.$formFields[0]);
				var listBoundingRect = this.$formFields[0].getBoundingClientRect();
				var infoboxPopup = new InfoboxPopup({
					title: "Error",
					message: error.message,
					origin: {
						position: isFixed ? "fixed" : "absolute",
						top: (listBoundingRect.top + listBoundingRect.bottom) / 2.3 + (isFixed ? 0 : $(window).scrollTop()),
						left: listBoundingRect.right - 330 + (isFixed ? 0 : $(window).scrollLeft())
					},
					error: true
				});
				infoboxPopup.show();
			}
		},

		onClickSubmit: function(event) {
	event.preventDefault();
			this.onSelect();
			
			if(this.model.isValid()) {
				if (window.utag) {
					utag.link({
						_ga_category: 'site diagnostics',
						_ga_action: 'submit',
						_ga_label: 'dental ada'
						}); 
				}	

				$(".dental-submit").addClass("is_loading");
                var adaCodesArray = [];
				 var policyNumber = $('input[name="policy_number"]').val().toUpperCase();

                $('form#dental-providers').find('input[name="ada_code"]').each(function () {
                    if (this.value !== '') {
                        adaCodesArray.push(this.value.toUpperCase());
                    }
                });
                var adaCodes = '';
                var x = adaCodesArray.length - 1;
                for (var i = 0; i < adaCodesArray.length; i++) {

                    if (i !== 0) {
                        adaCodes += '%2C' + adaCodesArray[i];
                    }
                    if (i === 0) {
                        adaCodes += adaCodesArray[i];
                    }
                }
				var _this = this;
				var lead = { "policyNumber": policyNumber, "adaCodes": adaCodes};
                    $.ajax({
                        type: 'POST',
                        dataType: 'json',
						data: JSON.stringify(lead),
                        contentType: 'application/json; charset=utf-8',
                        url: Util.webserviceURL('/api/genericservice/DentalProviders?force_get=true'),
						tryCount : 0,
						retryLimit : 2,
                        success: function (response) {
                            $(".dental-submit").removeClass("is_loading");
                            if (!response.HasError) {
                                //Display "thank you" message
                                $('div.coverage_type').css('display', 'block');
                                $('div.coverage_type').html('Coverage Type: '+  response.Data.coverageType.description );
                                $('table#provider-output').css('display', 'block');
                                $('table#provider-output > tbody').html('');
                                for (var i = 0; i < response.Data.adaBenefits.length; i++) {
                                    $('table#provider-output > tbody').append('<tr><td>' + response.Data.adaBenefits[i].codes + '</td><td>' + response.Data.adaBenefits[i].description + '</td><td>' + response.Data.adaBenefits[i].permanentAmount + '</td><td>' + response.Data.adaBenefits[i].primaryAmount + '</td></tr>');
                                }			
								$('html, body').animate({ scrollTop: $('#provider-output').offset().top - 225}, 800);								
                            }
                            else {
								this.tryCount++;
								if (this.tryCount <= this.retryLimit && response.Status == 500) {
									//try again
									$.ajax(this);
									return;
								} 
								else {       
									$('div.coverage_type').css('display', 'none');
									$(".dental-submit").removeClass("is_loading");
									$('table#provider-output').css('display', 'block');
									$('table#provider-output > tbody').html('<tr><td colspan="4" style="color:red;">We\'re sorry. There was a problem with your request...</td></tr>');
									 if (window.utag) {
										utag.link({_ga_category: 'site diagnostics',_ga_action: 'dental ada error: api',_ga_label: 'status code: ' + response.Status }); 
									 }	
									 $('html, body').animate({ scrollTop: $('#provider-output').offset().top - 225}, 800);
								 } 
                            }
							
                        },
                        error: function (xhr, textStatus, errorThrown) {	
							this.tryCount++;
							if (this.tryCount <= this.retryLimit) {
								//try again
								$.ajax(this);
								return;
							} 
							else {  	
								$(".dental-submit").removeClass("is_loading");
								$('div.coverage_type').css('display', 'none');
								$('table#provider-output').css('display', 'block');
								$('table#provider-output > tbody').html('<tr><td colspan="4" style="color:red;">We\'re sorry. There was a problem with your request...</td></tr>');
								if (window.utag) {
									utag.link({_ga_category: 'site diagnostics',_ga_action: 'dental ada error: web server',_ga_label: 'status code: ' + xhr.status }); 
								}
								 $('html, body').animate({ scrollTop: $('#provider-output').offset().top - 225}, 800);
							}
                        }
                    });
			}
			else {
				$('div.coverage_type').css('display', 'none');
                 $("form#dental-providers > .is-error").css('display', 'block');
			}
		
		}

	});
	
	return ProvidersForm;

});



