define([
	"lib/BaseView",
	"./StepView",
	"./StepNavModel",
	"./EmployersStartStep",
	"./EmployersContactInformationStep",
	"./StepNav",
	"lib/Util"
],
function(
	BaseView,
	StepView,
	StepNavModel,
	StartStep,
	ContactInformationStep,
	StepNav,
	Util
) {
    var EmployersForm = BaseView.extend({
        stepViews: null,
        initialize: function(options) {
            this.stepNavModel = new StepNavModel();
            this.$formPanel = this.$(".form-panel");
            this.$completePanel = this.$(".complete-panel");
            this.$form = this.$("form");
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
        onChangeComplete: function(model, value, options) {
            if(value) {
                $(".submit").addClass('is_loading');
                var data = this.$form.serialize().split('+').join(' ');
                var viewState = this;
				
                function QueryStringToJSON() {
                    var pairs = data.split('&');
                    var result = {};
                    $.each(pairs, function (i, pair) {
                        paired = pair.split('=');
                        result[paired[0]] = decodeURIComponent(paired[1] || '');
                    });
                    return JSON.parse(JSON.stringify(result));
                }
                var results = QueryStringToJSON();
                //console.log(results);	
                var _this = this;
                $(this).zipLookUp({
                    //find city and state
                    zipcode: results.zipcode,
                    //add to form data and submit - callback to ajax success
                    submit: function (response) {
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
                        
                   //     console.log("Post Data (busLead):", postData);
						if (!Util.isSpanish()) {
							var busLeadViewModel = postLeadData(postData, '/api/genericservice/Businesses/Leads', true, '<h2><span>We\'re sorry. There was a problem with your request...</span></h2>', true);
						} else {
							var busLeadViewModel = postLeadData(postData, '/api/genericservice/Businesses/Leads', true, '<h2><span>Disculpe, hubo un problema con el proceso...</span></h2>', true);
						}
                        if(busLeadViewModel != null && !busLeadViewModel.HasError) {
                            var status = busLeadViewModel.status;
                            var conf = busLeadViewModel.confirmationNumber;
                            var jsonSent = $.parseJSON(postData);
                       //     console.dir(jsonSent);
                       //     console.log(jsonSent.CompanySize);
                      //      console.log(jsonSent.State);
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
						  //          console.log(jsonSent.Offerings[i].Name);
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
                        }
                        else {
                            $('.complete-panel').empty();
							if (!Util.isSpanish()) {
								$('.complete-panel').append($("<h2><span>We\'re sorry. There was a problem with your request...</span></h2>"));
							} else {
								$('.complete-panel').append($("<h2><span>Disculpe, hubo un problema con el proceso...</span></h2>"));
							}
                            viewState.$formPanel.css("display", "none");
                            viewState.$completePanel.css("display", "block");
                            $(".submit").removeClass('is_loading');
                        }  
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
function postLeadData(jsonData, serviceUrl, isPost, errorMessage, showError) {
    var method = (isPost) ? 'POST' : 'GET';
    var retVal = null;
	var ajaxStartTime = new Date();
	var ajaxStartTimeUTC = ajaxStartTime.toUTCString();
    $.ajax({
        async: false,
        type: method,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        url: serviceUrl,
        data: jsonData,
        dataFilter: function (resp) {
            var msg = eval('(' + resp + ')');
            if (msg.d && msg.d != null)
                return JSON.stringify(msg.d);
            else
                return resp;
        },
        success: function (response) {
			//Util.eventTiming(ajaxStartTime, "b2c submit", response.Status.toString(), ajaxStartTimeUTC );
            if (!response.HasError) {
                retVal = response.Data;
            }
            else {
                if (showError) {
                    $('.complete-panel').empty();
                    $('.complete-panel').append($(errorMessage));
                }
				if (window.utag) {
				utag.link({_ga_category: 'site diagnostics',_ga_action: 'b2b form submission error: api',_ga_label: 'status code: ' + response.Status }); 
				}
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            if (showError) {
                $('.complete-panel').empty();
                $('.complete-panel').append($(errorMessage));
            }
			if (window.utag) {
			utag.link({_ga_category: 'site diagnostics',_ga_action: 'b2b form submission error: web server',_ga_label: 'status code: ' + xhr.status }); 
			}
			//Util.eventTiming(ajaxStartTime, "b2c submit", xhr.status.toString(), ajaxStartTimeUTC );
        }
    });
    return retVal;
}
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