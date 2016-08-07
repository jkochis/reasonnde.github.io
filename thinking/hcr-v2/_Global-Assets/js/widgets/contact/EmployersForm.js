define([
	"lib/BaseView",
	"./StepView",
	"./StepNavModel",
	"./EmployersStartStep",
	"./EmployersContactInformationStep",
	"./StepNav",
	"lib/MediaQueries",
	"lib/common_components/InfoboxPopup",
	"widgets/ErrorLightbox",
	"./FormHelper",
	"lib/Env",
	"lib/Util"
],
function(
	BaseView,
	StepView,
	StepNavModel,
	StartStep,
	ContactInformationStep,
	StepNav,
	MediaQueries,
	InfoboxPopup,
	ErrorLightbox,
	FormHelper,
	Env,
	Util
) {
    var EmployersForm = BaseView.extend({
        stepViews: null,
        initialize: function(options) {
            this.stepNavModel = new StepNavModel();
            this.$formPanel = this.$(".form-panel");
            this.$completePanel = this.$(".complete-panel");
            this.$form = this.$("form");
			this.formHelper = new FormHelper({
				el: this.el,
				model: this.stepNavModel
			});
            this.stepViews = [];
            var startStep = new StartStep({
                el: this.$(".form-step.getting-started")
            })
            this.registerStep(startStep);
            this.registerStep(new ContactInformationStep({
                el: this.$(".form-step.contact-info")
            }));
            this.stepNav = new StepNav({
                el: this.$formPanel.find(".progress-nav"),
                model: this.stepNavModel
            });
            this.stepNavModel.on("change:index", this.onChangeIndex, this);
            this.stepNavModel.on("change:complete", this.onChangeComplete, this);
            this.reset();
            if(options.startStepData) {
                startStep.setData(options.startStepData);
                startStep.setErrorFeedback(false);
                if(startStep.model.isValid()) {
                    this.stepNavModel.set({index: 1});
					if (window.utag) {
						utag.link({_ga_category: 'lead form',_ga_action: 'step 1:  continue',_ga_label: utag.data.form_type});
					}
                }
                startStep.setErrorFeedback(true);
            }
        },
        reset: function() {
            this.stepNavModel.set({
                index: 0,
                complete: false
            });
            this.stepNavModel.trigger("change:complete");
           // for(var i = 0; i < this.stepViews.length; i++) {
           //     this.stepViews[i].reset();
           // }
        },
		submitErrorReset: function() {
            this.stepNavModel.set({
                index: 1,
                complete: false
            });
            this.stepNavModel.trigger("change:complete");
           // for(var i = 0; i < this.stepViews.length; i++) {
           //     this.stepViews[i].reset();
           // }
        },
        registerStep: function(stepView) {
            this.stepViews.push(stepView);
            this.stepNavModel.get("steps").push(stepView.model);
        },
        onChangeIndex: function(model, value, options) {
            var prevStepView = this.stepViews[model.previous("index")];
            if(prevStepView) {
                prevStepView.hide();
            }
            var nextStepView = this.stepViews[value];
            if(nextStepView) {
                nextStepView.show();
            }
        },
		onInvalidModel: function(model, error) {
			this.formHelper.setError(error.fields);
			if (window.utag) {
				utag.link({_ga_category: 'lead form',_ga_action: 'error',_ga_label: 'form validation error step 2'});
			}
			if(!Env.IE8 && matchMedia(MediaQueries.HEADER_HAMBURGER).matches) {
				var lightbox = new ErrorLightbox({
					data: {
						title: "Error",
						message: "Invalid Email"
					}
				});
				lightbox.show();
			}
			else {
				var isFixed = Util.isPositionFixed(this.$('.contact-info .form-fields'));
				var listBoundingRect = this.$('.form-fields')[1].getBoundingClientRect();
				var infoboxPopup = new InfoboxPopup({
					title: "Error",
					message: "Invalid Email",
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
        onChangeComplete: function(model, value, options) {
            if(value) {
                $(".submit").addClass('is_loading');
                var data = this.$form.serialize().split('+').join(' ');
                var viewState = this;
				var _this = this;
				var tempModel = model;
				//console.log(tempModel);
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
                //console.log(results);	
                
                $(this).zipLookUp({
                    //find city and state
                    zipcode: results.zipcode,
                    //add to form data and submit - callback to ajax success
                    submit: function (response) {
						$(".submit").removeClass('is_loading');
                        results = $.extend({}, results, response);
                        //demo results / submission
                       // console.log(results);
                        //Business lead submission
                        var busLead = new BusinessLeadModel();
                        busLead.City = results.city;
                        busLead.CompanyName = results.business;
					/*	if(results.employeecount == "2"){
							busLead.CompanySize = "<2";
						}
						else if (results.employeecount == "24"){
							busLead.CompanySize = "3-24";
						}
						else if (results.employeecount == "99"){
							busLead.CompanySize = "25-99";
						}
						else if (results.employeecount == "499"){
							busLead.CompanySize = "100-499";
						}
						else if (results.employeecount == "999"){
							busLead.CompanySize = "500-999";
						}
						else if (results.employeecount == "1000"){
							busLead.CompanySize = "1000+";
						}
						else{
							busLead.CompanySize = results.employeecount;
						}*/
						
						busLead.CompanySize = results.employeecount;
                        
                        busLead.CurrentlyOfferProducts = (results.add == "on");
                        busLead.Email = results.email;
                        busLead.EmailOptOut = results.news != "on";
                        busLead.FirstName = results.firstname;
                        busLead.LastName = results.lastname;
                        var language = results.language.toLowerCase() || "en";
                        if(!results.marketing_program_id){
                            busLead.MarketingProgramID = "WEB-029";
                         //  console.log(language);
                            if(language == "en" || language == "english"){
                               busLead.MarketingProgramID = "WEB-003";
                            }
                        }
                        else {
                            busLead.MarketingProgramID = results.marketing_program_id;
                        }
                        busLead.Offerings = new Array();
                        if (results.individual && results.individual != null && results.individual.length > 0){
                            busLead.addOffering("individual");
							}
                        if (results.group && results.group != null && results.group.length > 0){
                            busLead.addOffering("group");
							}
                        if (results.findout && results.findout != null && results.findout.length > 0){
                            busLead.addOffering("findout");
							}
                        busLead.Phone = results.phone;
                        
                        if(results.ext && results.ext.trim() != "" && results.ext.trim().length > 0) { 
                            busLead.PhoneExt = results.ext.trim();
                        }
                        busLead.State = results.state_abbreviation;
                        busLead.Zip = results.zipcode;                        
						
						var postData = JSON.stringify(busLead);
						var ajaxStartTime = new Date();
						var ajaxStartTimeUTC = ajaxStartTime.toUTCString();
						
						Util.validateBusinessEmail({
							email: results.email, 
							submit: function (value){
								if(value){
									$(".submit").addClass('is_loading');
									$.ajax({
											type: 'POST',
											dataType: 'json',
											contentType: 'application/json; charset=utf-8',
											//url: Util.webserviceURL('/api/genericservice/Businesses/Leads'),
											data: postData,
											success: function (response) {
												Util.eventTiming(ajaxStartTime, "b2b submit", response.Status.toString(), ajaxStartTimeUTC );
												if (!response.HasError) {
														var status = response.Data.status;
														var conf = response.Data.confirmationNumber;
														var jsonSent = $.parseJSON(postData);
														$("span.number").empty();
														$("span.number").append(conf);
														viewState.$formPanel.css("display", "none");
														viewState.$completePanel.css("display", "block");
														if (!Util.isSpanish()) {
															if (status === "duplicate"){
																$('.complete-panel > div.info').html('<p>Thank you for your interest in Aflac.  At this time, we already have your information on file.  if you feel this is incorrect contact us at <a class="textlink" href="mailto:addbenefits@aflac.com?subject=Ref: Request Inquiry">addbenefits@aflac.com</a>.</p>');
																$('.complete-panel > div.thanks').html('<div class="title">Thank You!</div><p></p>');
															}
														} else {
															if (status === "duplicate"){
																$('.complete-panel > div.info').html('<p>Gracias por tu interés en Aflac usted. En este momento, ya tenemos su información en archivo. si cree que esto es incorrecto contacte con nosotros en <a class="textlink" href="mailto:addbenefits@aflac.com?subject=Ref: Request Inquiry">addbenefits@aflac.com</a>.</p>');
																$('.complete-panel > div.thanks').html('<div class="title">¡Gracias!</div><p></p>');
															}
														}
														if (window.utag) {
															utag.link({
																_ga_category: 'lead form',
																_ga_action: 'completion',
																_ga_label: utag.data.form_type
															});
															for (var i = 0; i < jsonSent.Offerings.length; i++) {
																//product selection tracking
																utag.link({
																	_ga_category: 'lead form',
																	_ga_action: 'form detail: products',
																	_ga_label: jsonSent.Offerings[i].Name.toLowerCase()
																});
															}
															utag.link({
																_ga_category: 'lead form',
																_ga_action: 'form detail: state',
																_ga_label: jsonSent.State
															});
															utag.link({
																_ga_category: 'lead form',
																_ga_action: 'form detail: employee count',
																_ga_label: jsonSent.CompanySize
															});
															// if page is not spanish - else fire spanish floodlight
															if (!Util.isSpanish()) {
																utag.link({
																	_dc_link_cat: "2015b00-",
																	_dc_link_type: "busin0"
																});
															}
															else {
																utag.link({
																	_dc_link_cat: "2015b000",
																	_dc_link_type: "busin0"
																});
															}

														}
														$(".submit").removeClass('is_loading');
													//END AJAX
												}
												else {
													viewState.$formPanel.css("display", "none");
													viewState.$completePanel.css("display", "block");
													$(".submit").removeClass('is_loading');
													if (window.utag) {
													utag.link({_ga_category: 'site diagnostics',_ga_action: 'b2b form submission error: api',_ga_label: 'status code: ' + response.Status }); 
													}
												}
											},
											error: function (xhr, textStatus, errorThrown) {
												$('.complete-panel').empty();
												if (!Util.isSpanish()) {
													$('.complete-panel').append($("<h2><span>We\'re sorry. There was a problem with your request...</span></h2>"));
												} else {
													$('.complete-panel').append($("<h2><span>Disculpe, hubo un problema con el proceso...</span></h2>"));
												}
												if (window.utag) {
												utag.link({_ga_category: 'site diagnostics',_ga_action: 'b2b form submission error: web server',_ga_label: 'status code: ' + xhr.status }); 
												}
												Util.eventTiming(ajaxStartTime, "b2b submit", xhr.status.toString(), ajaxStartTimeUTC );
											}
										});
								}
								else{
									var error = {fields: ["email"]};
									_this.onInvalidModel(_this.stepNavModel,error);
									_this.submitErrorReset();
								}
							}	
						});
						//AJAX REWORK
                    }
                });
            }
            else {
                this.$formPanel.css("display", "block");
                this.$completePanel.css("display", "none");
            }
        }
    });
    return EmployersForm;
});
function BusinessLeadModel()
{
    this.CompanyName = "";
    this.CompanySize;
    this.Offerings = [];
    this.Prefix = "";
    this.FirstName = "";
    this.LastName = "";
    this.Email = "";
    this.City = "";
    this.State = "";
    this.Zip = "";
    this.Phone = "";
    this.PhoneExt = null;
    this.CurrentlyOfferProducts = false;
    this.EmailOptOut = true;
    this.BillingType = "Payroll";
    // For English: WEB-003, For Spanish: WEB-029
    this.MarketingProgramID = "";
    this.addOffering = function (name) {
        var thisOffering = $("input[name='" + name + "']")[0].value;
        var offer = new BusinessOffering();
        offer.Name = thisOffering;
        this.Offerings.push(offer);
    };
}
function BusinessOffering(name)
{
    this.Name = name;
}