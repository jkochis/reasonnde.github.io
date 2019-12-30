
define([
	"underscore",
	"lib/Env",
	"lib/Util",
	"lib/MediaQueries",
	"lib/BaseView",
	"lib/common_components/InfoboxPopup",
	"widgets/ErrorLightbox",
	"./FormHelper",
	"./FabFormModel"
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
	var FabForm = BaseView.extend({

		el: 'form.registration',
		
		initialize: function(options) {
		
			_.bindAll(this,
				"onClickSubmit"
			);
			
			this.model = new FormModel();
			this.$form = this.$("form.registration");
			this.$input = this.$(".input-text input, .input-text textarea, select");
			this.$request = this.$("");
			
			if(this.$form){
				this.model.set(this.$form.attr("name"), this.$form.val());
			}
			
			var map = {};
			
			this.$input.each(function(){
				var value = $(this).attr('name');
				map[value] = "";
			});
			this.model.set(map);
			
			this.formHelper = new FormHelper({
				el: this.el,
				model: this.model
			});

			this.$formPanel = this.$(".form-panel");
			this.$completePanel = this.$(".complete-panel");
			this.$submit = this.$el;
			this.$formFields = this.$el;

			//this.$("input[name=phone]").mask("999-999-9999", {placeholder: " "});
			//this.$("input[name=evening_phone]").mask("999-999-9999", {placeholder: " "});
			//this.$("input[name=phone_us]").mask("999-999-9999", {placeholder: " "});
			//this.$("input[name=phone_number]").mask("999-999-9999", {placeholder: " "});
			//this.$("input[name=zipcode]").mask("99999", {placeholder: ""});
			//this.$("input[name=date_of_birth]").mask("99/99/9999", {placeholder: " "});

			this.model.on("invalid", this.onInvalidModel, this);
			this.$submit.on("submit", this.onClickSubmit);
			
            $(document).ready(function(){
                //utag_data.contact_form = $(".side_container").find("h3").text().toLowerCase();
                if($("form.fab").length > 0){
					//if (window.utag) {
						//utag.link({_ga_category: 'contact aflac section',_ga_action: 'form view',_ga_label: utag.data.contact_form});
					//}
                }
            });
			
			this.reset();			
			this.model.on("change", this.onModelChange, this);
			console.log(this.model);
			//console.dir(this);
			
		    _.each(this.formHelper.inputs, _.bind(function(input, index, list) {
                if(input.name == "yesmeet") {
                    this.yesMeet = input;
                    this.yesMeet.on("change", this.onChangeYesMeet, this);
                }
                else if(input.name == "nomeet") {
                    this.noMeet = input;
                    this.noMeet.on("change", this.onChangeNoMeet, this);
                }
            }, this));
			
			_.each(this.formHelper.inputs, _.bind(function(input, index, list) {
                if(input.name == "yeseatlunch") {
                    this.yesEatLunch = input;
                    this.yesEatLunch.on("change", this.onChangeYesEatLunch, this);
                }
                else if(input.name == "noeatlunch") {
                    this.noEatLunch = input;
                    this.noEatLunch.on("change", this.onChangeNoEatLunch, this);
                }
            }, this));

		},
		
		//Not yet complete, this would add the asterisk to State if United States is selected. Also used the first line in onModelChange to call it.
		
		/* onChangeCountry: function() {
		console.log('check, no match');
		$('select#country').on('input', function() {
		console.log('fired');
		});
			if($("select#country option:selected").val() === 'United States') {
					console.log('check, US');
				if($('select#states option:selected').length <= '0') {
						console.log('check, US, val = "" ');
					$('.dropdown-container.states .dropdown-title').html('<p>Select a State *</p>');
				} else {
				var selectedState = $("select#states option:selected").val();
				$('.dropdown-container.states .dropdown-title').html('<p>' + selectedState + '</p>');
				}
			}
		}, */
		
        onModelChange: function() {
			//this.onChangeCountry();
			
			if(!this.model.get('initiated')){
				this.model.set('initiated', true);
				if (window.utag) {
					//utag.link({_ga_category: 'lead form',_ga_action: 'initiate',_ga_label: utag.data.form_type});
				}
			}
		},
		
		onChangeYesMeet: function(checkbox) {
            if(checkbox.getValue()) {
                this.noMeet.setValue(false);
            }
        },
        onChangeNoMeet: function(checkbox) {
            if(checkbox.getValue()) {
                this.yesMeet.setValue(false);
            }
        },
		
		onChangeYesEatLunch: function(checkbox) {
            if(checkbox.getValue()) {
                this.noEatLunch.setValue(false);
            }
        },
        onChangeNoEatLunch: function(checkbox) {
            if(checkbox.getValue()) {
                this.yesEatLunch.setValue(false);
            }
        },
		
		reset: function() {
			this.formHelper.reset();
			this.$formPanel.css("display", "block");
			this.$completePanel.css("display", "none");
		},
		removeErrors: function() {
			this.formHelper.removeErrors();
		},
		onInvalidModel: function(model, error, options) {
			this.formHelper.setError(error.fields);
			if (window.utag) {
				//utag.link({_ga_category: 'lead form',_ga_action: 'error',_ga_label: 'form validation error'});
			}
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
						top: (listBoundingRect.top + listBoundingRect.bottom) / 2 + (isFixed ? 0 : $(window).scrollTop()),
						left: listBoundingRect.left + (isFixed ? 0 : $(window).scrollLeft())
					},
					error: true
				});
				infoboxPopup.show();
			}
		},
		onClickSubmit: function(event) {
			event.preventDefault();
			if(this.model.isValid()) {
				$(".submit").addClass('is_loading');
				var data = this.$form.serialize().split('+').join(' ');

			if (window.utag) {	
				//utag.link({_ga_category: 'lead form',_ga_action: 'step 1:  continue',_ga_label: utag.data.form_type});
			}
		function QueryStringToJSON() {
		
                    var pairs = data.split('&');
                    var result = {};
					
                   $.each(pairs, function (i, pair) {
                        var paired = pair.split('=');
                        result[paired[0]] = decodeURIComponent(paired[1] || '');
                    });
					
                    return JSON.parse(JSON.stringify(result));
                }
				
                var results = QueryStringToJSON();
                //console.log(results);	
                var _this = this;
				
					function decode(a) {
					// ROT13 : a Caesar cipher 
					// letter -> letter' such that code(letter') = (code(letter) + 13) modulo 26
					return a.replace(/[a-zA-Z]/g, function(c){
					  return String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
					})
				  }; 
				
				
				var _this = this;
				/*var emailSender = $(".w_sidebar-brokers").find("input[name='email_address']").val(); 
					if($('.contact-mobile-brokers').css('display') == 'block')
					{
						emailSender = $(".contact-mobile-brokers").find("input[name='email_address']").val();
					}
					if ($(".w_contact-lightbox-brokers"))
					{
						emailSender = $(".w_contact-lightbox-brokers").find("input[name='email_address']").val();
					}*/
			//TM	var emailSubject = 'FAB Form Registration'
			//TM	var emailBody = '';
                //var toAddress = decode('oebxreyrnqf@nsynp.pbz');
				var sp = false;
			//	console.dir(email)
				
				
				
				
				
				
               $(this).zipLookUp({
                    //find city and state
                    zipcode: results.zipcode,
                    //add to form data and submit - callback to ajax success
                    submit: function (response) {
                        results = $.extend({}, results, response);
                        //demo results / submission
                     console.log(results);

					   /* for (var key in results) {
						  if (results.hasOwnProperty(key)) {
						  //  alert(key + " -> " + p[key]);

							if(key == "WcoFormId"){} 
							else if (key == "print"){
								emailSubject = 'New FAB Form Registration';
								sp = true;
							} 
							else{
								 emailBody = emailBody  + key +" : "+results[key]+ "<br>";
							}
						  
						  }
						}
						
						var email = {
											"ToAddress" : toAddress,
											"FromAddress" : results.email_address,
											"MessageSubject" : emailSubject,
											"MessageBody" : emailBody,
											"IsHTML" : "true"
											 };
						*/			
						sp = false;
						 if(sp === true){
						 
						 		var yesmeet_option = results.yesmeet || "";
								var nomeet_option = results.nomeet || '';
								
								var yeseatlunch_option = results.yeseatlunch || '';
								var noeatlunch_option = results.noeatlunch || '';
								
								
								var sp_results =  {
								  //"listUrl" : "http://departments.aflacworkplace.com/sites/marketing/directory/dm/_vti_bin/lists.asmx",
								  "fields" : {
									"First_x0020_Name" : results.first_name,
									"Middle_x0020_Initial" : results.middle_name,
									"Last_x0020_Name" : results.last_name,
									"Firm" : results.firm,
									"Firm_x0020_Address" : results.firm_address,
									"Address_x0020_2" : results.firm_address2,
									"Country" : results.country,
									"City" : results.city,
									"State" : results.states,
									"Zip_x0020_Code" : results.zipcode,
									"Phone" : results.phone,
									"Fax" : results.fax,
									/* This field was double checked in the SP list as name="Title" displayName="Email" */
									"Title" : results.email,
									"Contact_x0020_Name" : results.contact_name,
									"Contact_x0020_Phone" : results.contact_phone,
									"Contact_x0020_Email" : results.contact_email,
									"Name_x0020_On_x0020_Badge" : results.name_badge,
									"Special_x0020_Meal_x0020_Request" : results.meal_request,
									"Attend_x0020_Wednesday_x0020_Mor" : yesmeet_option + nomeet_option,
									"Attend_x0020_Wednesday_x0020_Lun" : yeseatlunch_option + noeatlunch_option,
									"Special_Interest" : results.additional_topics
								  }
								}

						$.ajax({
                        type: 'POST',
                        dataType: 'json',
                        contentType: 'application/json; charset=utf-8',
                        //url: '/api/genericservice/Lists/{0B0C1098-2FE1-4A9D-A347-9138E98CB52A}/Items',
                        data: JSON.stringify(sp_results),
                        dataFilter: function (resp) {
                            var msg = eval('(' + resp + ')');
                            if (msg.d && msg.d != null)
                                return JSON.stringify(msg.d);
                            else
                                return resp;
                        },
                        success: function (response) {
                            if (!response.HasError) {}
                            else {
								if (window.utag) {
									//utag.link({_ga_category: 'site diagnostics',_ga_action: 'broker sharepoint submission error: api',_ga_label: 'status code: ' + response.Status }); 
								}
                            }
                        },
                        error: function (xhr, textStatus, errorThrown) {	
							if (window.utag) {	
								//utag.link({_ga_category: 'site diagnostics',_ga_action: 'broker sharepoint submission error: web server',_ga_label: 'status code: ' + xhr.status }); 
							}
                        }
                    });
							 
							 
						 }
					 
					 
					   $.ajax({
                        type: 'POST',
                        dataType: 'json',
                        contentType: 'application/json; charset=utf-8',
                        //url: '/api/genericservice/SendEmail',
                        data: JSON.stringify(email),
                        dataFilter: function (resp) {
                            var msg = eval('(' + resp + ')');
                            if (msg.d && msg.d != null)
                                return JSON.stringify(msg.d);
                            else
                                return resp;
                        },
                        success: function (response) {
                            if (!response.HasError) {
								if (window.utag) {
									//utag.link({
										//_ga_category: 'lead form',
										//_ga_action: 'completion',
										//_ga_label: utag.data.form_type
									//});
									//utag.link({
										//_ga_category: 'lead form',
										//_ga_action: 'form detail: '+results.state_abbreviation,
										//_ga_label: utag.data.form_type
									//});
									//utag.link({
										//_dc_link_cat: "2015b009",
										//_dc_link_type: "broke0"
									//});
								}
                                _this.$formPanel.css("display", "none");
                                _this.$completePanel.css("display", "block");
                                $(".submit").removeClass('is_loading');
								if(sp === true){
									$(".complete-panel").find(".thanks").append('<p>Your copy of the PDF is now available for download.</p><p><a href="/docs/brokers/381887-a.pdf" class="textbutton is-orange download">Download</a></p>')
								}
                            }
                            else {
                                                _this.$formPanel.css("display", "none");
                                                _this.$completePanel.css("display", "block");
                                                $(".submit").removeClass('is_loading');
								$(".complete-panel").find(".thanks").html('<div class="title">Error</div><p>We\'re sorry there was a problem with your request. </p><p>Please report your problem to <a href="mailto:webmaster@aflac.com" class="textlink">webmaster@aflac.com</a></p></div>');
								if (window.utag) {
									//utag.link({_ga_category: 'site diagnostics',_ga_action: 'broker form submission error: api',_ga_label: 'status code: ' + response.Status }); 
								}
                            }
                        },
                        error: function (xhr, textStatus, errorThrown) {
                      
                                                 _this.$formPanel.css("display", "none");
                                                _this.$completePanel.css("display", "block");
                                                $(".submit").removeClass('is_loading');
							 $(".complete-panel").find(".thanks").html('<div class="title">Error</div><p>We\'re sorry there was a problem with your request. </p><p>Please report your problem to <a href="mailto:webmaster@aflac.com" class="textlink">webmaster@aflac.com</a></p></div>');
							 if (window.utag) {
								//utag.link({_ga_category: 'site diagnostics',_ga_action: 'broker form submission error: web server',_ga_label: 'status code: ' + xhr.status }); 
							 }
                        }
                    });
                    }
					
                });
//End ziplookup
			}
		}
	});
	return FabForm;
});