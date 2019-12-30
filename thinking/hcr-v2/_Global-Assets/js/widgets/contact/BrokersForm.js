/**
 * Created by roel.kok on 7/11/14.
 */
define([
	"underscore",
	"lib/Env",
	"lib/Util",
	"lib/MediaQueries",
	"lib/BaseView",
	"lib/common_components/InfoboxPopup",
	"widgets/ErrorLightbox",
	"./FormHelper",
	"./BrokersFormModel"
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
	var BrokersForm = BaseView.extend({
		initialize: function(options) {
			_.bindAll(this,
				"onClickSubmit"
			);
			this.model = new FormModel();
			this.formHelper = new FormHelper({
				el: this.el,
				model: this.model
			});
			this.$formPanel = this.$(".form-panel");
			this.$completePanel = this.$(".complete-panel");
			this.$form = this.$("form");
			this.$submit = this.$(".submit");
			this.$formFields = this.$(".form-fields");
			this.$("input[name=phone_number]").mask("999-999-9999", {placeholder: " "});
			this.$("input[name=zipcode]").mask("99999", {placeholder: " "});
			//this.$formPanel.find("input[name='w_option_3']").parent().unbind('click').click(this.wingmanInfo);
			this.$formPanel.find(".checkbox.on-desktop, .checkbox.on-lightbox, .checkbox.on-mobile").on('click', this.wingmanInfo);
			
			this.model.on("invalid", this.onInvalidModel, this);
			this.$submit.on("click", this.onClickSubmit);
			this.reset();
            this.model.on("change", this.onModelChange, this);
		},
        onModelChange: function() {
			if(!this.model.get('initiated')){
				this.model.set('initiated', true);
				if (window.utag) {
					utag.link({_ga_category: 'lead form',_ga_action: 'initiate',_ga_label: utag.data.form_type});
				}
			}
		},
		wingmanInfo: function(event) {
		
			event.stopImmediatePropagation();
			
			if(!Env.IE8 && matchMedia(MediaQueries.HEADER_HAMBURGER).matches) {
				var errorLightbox = new ErrorLightbox({
					data: {
					title: "What is a Wingman?",
					message: "An experienced voluntary expert right in your office &mdash; at no cost to you.",
					}
				});
				errorLightbox.show();
			}
			else {
				var isFixed = Util.isPositionFixed(this);
				var listBoundingRect = this.getBoundingClientRect();
				var infoboxPopup = new InfoboxPopup({
				title: "What is a Wingman?",
				message: "An experienced voluntary expert right in your office &mdash; at no cost to you.",
					origin: {
						position: isFixed ? "fixed" : "absolute",
						top: (listBoundingRect.top + listBoundingRect.bottom) / 2 + (isFixed ? 0 : $(window).scrollTop()),
						left: listBoundingRect.left + (isFixed ? 0 : $(window).scrollLeft())
					},
					error: false
				});
				infoboxPopup.show();
			}
			/*$('.w_infobox-popup,.w_error-lightbox').each(function() {
				var txt = $(this).text();
				if (seen[txt])
				$(this).remove();
				else
				seen[txt] = true;
				});*/
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
				utag.link({_ga_category: 'lead form',_ga_action: 'error',_ga_label: 'form validation error'});
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
				var _this = this;
				//Ziplookup
			if (window.utag) {	
				utag.link({_ga_category: 'lead form',_ga_action: 'step 1:  continue',_ga_label: utag.data.form_type});
			}
					
					function QueryStringToJSON() {
						var pairs = data.split('&');
						var result = {};
						$.each(pairs, function (i, pair) {
							paired = pair.split('=');
							var pHolder = _this.$form.find("input[name='"+paired[0]+"']").attr('placeholder');
							//	console.log(pHolder + " || "+ paired[1]);
							if(paired[1] === pHolder){
								result[paired[0]] = decodeURIComponent('');
							}else{
								result[paired[0]] = decodeURIComponent(paired[1] || '');
							}
						});
						return JSON.parse(JSON.stringify(result));
					}
					var results = QueryStringToJSON();
				
				
				
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
				var emailSubject = 'New Broker Lead'
				var emailBody = '';
                var toAddress = decode('');
				var sp = false;
			//	console.dir(email)
				
				
				
				
				
				
                $(this).zipLookUp({
                    //find city and state
                    zipcode: results.zipcode,
                    //add to form data and submit - callback to ajax success
                    submit: function (response) {
                        results = $.extend({}, results, response);
                        //demo results / submission
                     //  console.log(results);
					 
					    for (var key in results) {
						  if (results.hasOwnProperty(key)) {
						  //  alert(key + " -> " + p[key]);

							if(key == "WcoFormId"){} 
							else if (key == "print"){
								emailSubject = 'New Broker Print Lead';
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
						 if(sp === true){
								var sp_ajaxStartTime = new Date();
								var sp_ajaxStartTimeUTC = ajaxStartTime.toUTCString();
								var sp_name = results.full_name.split(" ");
								var sp_first = sp_name[0];
								var sp_last = sp_name[1] || '';	
								
								var opt_in_list = results.w_option_3 || "";
								var opt_in_list2 = results.w_option_2 || '';
								var opt_in_list3 = results.w_option_1 || '';
								
							
								var sp_results =  {
								  //"listUrl" : "http://departments.aflacworkplace.com/sites/marketing/directory/dm/_vti_bin/lists.asmx",
								  "fields" : {
									   "Title" : sp_first,
									   "LastName" : sp_last, 
									   "Email" : results.email_address,
									   "PhoneNumber" : results.phone_number,
									   "City" : results.city,
									   "State" : results.state_abbreviation,
									   "Zip" : results.zipcode,
									   "BusinessName" : results.company_name,
									   "Opt_x0020_In_x0020_Aflac_x0020_R" : opt_in_list + "\n" + opt_in_list2 + "\n" +opt_in_list3
								  }
								}

								$.ajax({
									type: 'POST',
									dataType: 'json',
									contentType: 'application/json; charset=utf-8',
									//url: Util.webserviceURL('/api/genericservice/Lists/{0B0C1098-2FE1-4A9D-A347-9138E98CB52A}/Items'),
									data: JSON.stringify(sp_results),
									dataFilter: function (resp) {
										var msg = eval('(' + resp + ')');
										if (msg.d && msg.d != null)
											return JSON.stringify(msg.d);
										else
											return resp;
									},
									success: function (response) {
										Util.eventTiming(sp_ajaxStartTime, "broker sharepoint submit", response.Status.toString(), sp_ajaxStartTimeUTC );
										if (!response.HasError) {}
										else {
											if (window.utag) {
												utag.link({_ga_category: 'site diagnostics',_ga_action: 'broker sharepoint submission error: api',_ga_label: 'status code: ' + response.Status }); 
											}
										}
									},
									error: function (xhr, textStatus, errorThrown) {	
										if (window.utag) {	
											utag.link({_ga_category: 'site diagnostics',_ga_action: 'broker sharepoint submission error: web server',_ga_label: 'status code: ' + xhr.status }); 
										}
										Util.eventTiming(sp_ajaxStartTime, "broker sharepoint submit", xhr.status.toString(), sp_ajaxStartTimeUTC );
									}
								});		 
								
						 }
					 
						var ajaxStartTime = new Date();
						var ajaxStartTimeUTC = ajaxStartTime.toUTCString();
					   $.ajax({
                        type: 'POST',
                        dataType: 'json',
                        contentType: 'application/json; charset=utf-8',
                        //url: Util.webserviceURL('/api/genericservice/SendEmail'),
                        data: JSON.stringify(email),
                        dataFilter: function (resp) {
                            var msg = eval('(' + resp + ')');
                            if (msg.d && msg.d != null)
                                return JSON.stringify(msg.d);
                            else
                                return resp;
                        },
                        success: function (response) {
							Util.eventTiming(ajaxStartTime, "broker email submit", response.Status.toString(), ajaxStartTimeUTC );
                            if (!response.HasError) {
								if (window.utag) {
									utag.link({
										_ga_category: 'lead form',
										_ga_action: 'completion',
										_ga_label: utag.data.form_type
									});
									utag.link({
										_ga_category: 'lead form',
										_ga_action: 'form detail: '+results.state_abbreviation,
										_ga_label: utag.data.form_type
									});
									utag.link({
										_dc_link_cat: "2015b009",
										_dc_link_type: "broke0"
									});
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
									utag.link({_ga_category: 'site diagnostics',_ga_action: 'broker form submission error: api',_ga_label: 'status code: ' + response.Status }); 
								}
                            }
                        },
                        error: function (xhr, textStatus, errorThrown) {
							 Util.eventTiming(ajaxStartTime, "broker email submit", xhr.status.toString(), ajaxStartTimeUTC );
                                                 _this.$formPanel.css("display", "none");
                                                _this.$completePanel.css("display", "block");
                                                $(".submit").removeClass('is_loading');
							 $(".complete-panel").find(".thanks").html('<div class="title">Error</div><p>We\'re sorry there was a problem with your request. </p><p>Please report your problem to <a href="mailto:webmaster@aflac.com" class="textlink">webmaster@aflac.com</a></p></div>');
							 if (window.utag) {
								utag.link({_ga_category: 'site diagnostics',_ga_action: 'broker form submission error: web server',_ga_label: 'status code: ' + xhr.status }); 
							 }
                        }
                    });

                    }
                });
//End ziplookup
			}
		}
	});
	return BrokersForm;
});