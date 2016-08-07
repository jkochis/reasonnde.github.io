/**
 * Created by roel.kok on 6/23/14.
 */
define([
	"underscore",
	"backbone",
	"lib/BaseView",
	"lib/WidgetView",
	"lib/Env",
	"lib/Util",
	"./IndividualsInterestsStep",
	"./IndividualsContactInfoStep",
	"./IndividualsCallTimeStep",
	"./StepNavModel",
	"./StepNav"
],
function(
	_,
	Backbone,
	BaseView,
	WidgetView,
	Env,
	Util,
	InterestsStep,
	ContactInfoStep,
	CallTimeStep,
	StepNavModel,
	StepNav
) {
    var RequestAQuoteForm = BaseView.extend({
        initialize: function(options) {
        				_.bindAll(this,
				"onClickNext"
			);
            options = _.extend({}, options);
            this.stepNavModel = new StepNavModel();
            this.$formPanel = this.$(".raq-form-panel");
            this.$completePanel = this.$(".raq-complete-panel");
            this.$form = this.$("form");
			this.$next = this.$(".next");
            this.stepViews = [];
            this.registerStep(new InterestsStep({
                el: this.$(".form-step.interests"),
                data: options.interestsData
            }));
            this.registerStep(new ContactInfoStep({el: this.$(".form-step.contact-info")}));
            this.registerStep(new CallTimeStep({el: this.$(".form-step.call-time")}));
            this.stepNav = new StepNav({
                el: this.$(".progress-nav")[0],
                model: this.stepNavModel
            });
			this.$next.on("click", this, this.onClickNext);
            this.stepNavModel.on("change:index", this.onChangeIndex, this);
            this.stepNavModel.on("change:complete", this.onChangeComplete, this);
            // TODO Using a hardcoded index here is not ideal
            this.stepViews[0].setErrorFeedback(false);
            if(this.stepNavModel.get("steps")[0].isValid()) {
                this.stepNavModel.set("index", 1);
				//console.log('hit continue');
				if (window.utag) {
					utag.link({_ga_category: 'lead form',_ga_action: 'step 1:  continue',_ga_label: utag.data.form_type});
				}
            }
            else {
                this.stepNavModel.set("index", 0);
            }
            this.stepViews[0].setErrorFeedback(true);
        },
        registerStep: function(stepView) {
			
            this.stepViews.push(stepView);
            this.stepNavModel.get("steps").push(stepView.model);
        },
        reset: function() {
            this.stepNavModel.set({
                index: 0,
                complete: false
            });
            for(var i = 0; i < this.stepViews.length; i++) {
                this.stepViews[i].reset();
            }
        },
		onClickNext: function(){
			//console.log(this);

            
				var index = this.stepNavModel.get("index");
				var currentModel = this.stepNavModel.get("steps")[index];
            if (this.stepNavModel.get("index") == 1 && currentModel.isValid()){
				var showError = true;
						window.aflac = window.aflac || {};
						window.aflac.ajax = window.aflac.ajax || {};
						$(".next").addClass('is_loading');
						
						var data = this.$form.serialize().split('+').join(' ');
						var _this = this;
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

						$(this).zipLookUp({
						//find city and state
						zipcode: results.zipcode,
						//add to form data and submit - callback to ajax success
						submit: function (response) {
							results = $.extend({}, results, response);
							//demo results / submission
                                        function guam() {
                                             //Show special last screen if guam zip code was entered - default if c2c errors out
                                            var callCenterSchedule;
                                            callCenterSchedule = ["Morning","Evening"];
                                                
                                            _this.stepViews[2].setupData(null, callCenterSchedule);
                                            $(".next").removeClass('is_loading');
                                            _this.stepNav.model.next();
                                            _this.stepViews[2].show();
                                        }
                            
                            
							window.aflac.ajax.idvForm = results;
                            window.aflac.ajax.callCenterAvailibility = false;
							var ajaxStartTime = new Date();
							var ajaxStartTimeUTC = ajaxStartTime.toUTCString();
                                $.ajax({
                                async: true,
                                type: 'GET',
                                dataType: 'json',
                                tryCount : 0,
                                retryLimit : 2,
                                contentType: 'application/json; charset=utf-8',
                                //url: '/api/genericservice/ClickToCall/Availability?State='+window.aflac.ajax.idvForm.state_abbreviation+'&ZipCode='+window.aflac.ajax.idvForm.zipcode,
								//url: Util.webserviceURL('/api/genericservice/ClickToCall/Availability?State='+window.aflac.ajax.idvForm.state_abbreviation+'&ZipCode='+window.aflac.ajax.idvForm.zipcode),
                                timeout:10000,
                                /*dataFilter: function (resp) {
                                    var msg = eval('(' + resp + ')');
                                    if (msg.d)
                                        return JSON.stringify(msg.d);
                                    else
                                        return resp;
                                },*/
                                success: function (response) {
									Util.eventTiming(ajaxStartTime, "c2c availability", response.Status.toString(), ajaxStartTimeUTC );
                                    if (!response.HasError) {
                                        window.aflac.ajax.callCenterAvailibility = response.Data.availability;
                                	//	window.aflac.ajax.callCenterAvailibility = false;
                                      // console.log((!Util.isSpanish()));
									  //uncomment for spanish
									   if(response.Data.availability && window.aflac.ajax.callCenterSchedule && !Util.isSpanish()){	
									   
                                	//	if(window.aflac.ajax.callCenterAvailibility){
                                            if(window.aflac.ajax.callCenterStatus && window.aflac.ajax.callCenterSchedule)
                                            {
                                               // Get Call Center Status
                                                // var isAvailable = getApiData('', '/api/genericservice/GetCallCenterStatus', false, '', false);
                                                var callCenterSchedule;
                                            //	console.log(window.aflac.ajax.callCenterSchedule);
                                                // Get Call Center Schedule 
                                                // API response object is the schedule
                                                //var apiSchedule = getApiData('', '/api/genericservice/GetCallCenterSchedule', false, '<h2><span>We\'re sorry. There was a problem with your request...</span></h2>', true);
                                                callCenterSchedule = convertScheduleObject(window.aflac.ajax.callCenterSchedule);
                                                _this.stepViews[2].setupData(window.aflac.ajax.callCenterStatus, callCenterSchedule);
                                            //	console.log("NextStepView Value: "", setupData with schedule data");
                                                $(".next").removeClass('is_loading');
                                                _this.stepNav.model.next();
                                                _this.stepViews[2].show();
                                            }
                                            else
                                            {
                                                    var i = 0, loop_length = 50, loop_speed = 100;
                                                    
                                                    function loop(){
                                                        i+= 1; 
                                                    //	$('.call-time').empty();
                                                    //	$('.call-time').append('<h2><span>Loading pleaase wait...</span></h2>');
                                                        
                                                            if(window.aflac.ajax.callCenterStatus && window.aflac.ajax.callCenterSchedule)
                                                            {
                                                                var callCenterSchedule;
                                                                callCenterSchedule = convertScheduleObject(window.aflac.ajax.callCenterSchedule);
                                                                _this.stepViews[2].setupData(window.aflac.ajax.callCenterStatus, callCenterSchedule);
                                                                //console.log("NextStepView Value: "", setupData with schedule data");
                                                                $(".next").removeClass('is_loading');
                                                                _this.stepViews[2].show();
                                                            }
                                                        if (i===loop_length) clearInterval(handler);
                                                    }
                                                    var handler = setInterval(loop, loop_speed);		
                                                    _this.stepNav.model.next();
                                            }
                                        }
                                        else {
                                            window.aflac.ajax.callCenterAvailibility = false;
                                            guam();
											if (window.utag && !Util.isSpanish()) {
												utag.link({_ga_category: 'site diagnostics',_ga_action: 'click to call error: api',_ga_label: 'status code: ' + response.Status + ' timeout' }); 
											}
                                        }	
                                    }
                                    else {
                                        this.tryCount++;
                                        if (this.tryCount <= this.retryLimit) {
                                            //try again
                                            $.ajax(this);
                                            return;
                                        } 
                                        else {   
                                                guam();
												if (window.utag) {
													utag.link({_ga_category: 'site diagnostics',_ga_action: 'click to call availability error: api',_ga_label: 'status code: ' + response.Status }); 
												}
                                        }
                                    }   
                                },
                                error: function (xhr, textStatus, errorThrown) {
                                        this.tryCount++;
                                        if (this.tryCount <= this.retryLimit && textStatus != "timeout") {
                                            //try again
                                            $.ajax(this);
                                            return;
                                        } 
                                        else { 
                                            guam();
											if (window.utag) {
												utag.link({_ga_category: 'site diagnostics',_ga_action: 'click to call availability error: web server',_ga_label: 'status code: ' + xhr.status });
											}
                                        }
										Util.eventTiming(ajaxStartTime, "c2c availability", xhr.status.toString(), ajaxStartTimeUTC );
                                }
                            });
						},
						error: function(xhr, textStatus, errorThrown)
						{
						   $('.raq-complete-panel').empty();
							if (!Util.isSpanish()) {
								$('.raq-complete-panel').append($("<h2><span>We\'re sorry. There was a problem with your request...</span></h2>"));
							} else {
								$('.raq-complete-panel').append($("<h2><span>Disculpe, hubo un problema con el proceso...</span></h2>"));
							}
						}
					
					});
			}
			else
			{
			this.stepNav.model.next();
			
			}		
		
		},
        submit: function() {
			$(".submit").addClass('is_loading');
			
					var data = this.$form.serialize().split('+').join(' ');
					var _this = this;
					function QueryStringToJSON() {
						var pairs = data.split('&');
						var result = {};
						$.each(pairs, function (i, pair) {
							paired = pair.split('=');
							var pHolder = _this.$form.find("input[name='"+paired[0]+"']").attr('placeholder');
								//console.log(pHolder + " || "+ paired[1]);
							if(paired[1] === pHolder){
								result[paired[0]] = decodeURIComponent('');
							}else{
								result[paired[0]] = decodeURIComponent(paired[1] || '');
							}
						});
						return JSON.parse(JSON.stringify(result));
					}
					var results = QueryStringToJSON();

			        var indLead = new IndividualLead();
                    indLead.City = window.aflac.ajax.idvForm.city;
                    indLead.BillingType = "Direct";
                    indLead.State = window.aflac.ajax.idvForm.state_abbreviation;
                    indLead.MarketingProgramID = (results.language == "English") ? "WEB-001" : "WEB-028";
                    indLead.Zip = window.aflac.ajax.idvForm.zipcode;
                    indLead.Email = results.email;
                    indLead.FirstName = results.firstname;
                    indLead.LastName = results.lastname;
                    indLead.Phone = results.phone;
                  
                    if (results.offering_1)
                        indLead.addOffering("offering_1");
                    if (results.offering_2)
                        indLead.addOffering("offering_2");
                    if (results.offering_3)
                        indLead.addOffering("offering_3");
                    if (results.offering_4)
                        indLead.addOffering("offering_4");
                    if (results.offering_5)
                        indLead.addOffering("offering_5");
                    if(!results.contactMeType){
                    indLead.ContactMeType = $('input[name="contactMeType"]').val();
					}
					else{
					indLead.ContactMeType = results.contactMeType;
					}
		           // console.log(results.time);
                    if(results.time && results.date){
					//console.log(results.time);
					//var millisecs = parseInt(results.time) * 1000;
                    //var selDayResults = results.date.split("/");
                    //var selDay = new Date(parseInt(selDayResults[2]), (parseInt(selDayResults[0])-1), parseInt(selDayResults[1]), 0, 0, 0, 0);
                   // var selDayMSecs = selDay.valueOf();
                    //var contactMeDateTime = new Date(selDayMSecs + millisecs);
					var contactMeDateTime = new Date(parseInt(results.time));
                    //2013-03-04T12:20:59-0600
					//console.log(contactMeDateTime);
                    indLead.ContactMeDateTime = getISO8601DateTimeString(contactMeDateTime);
					}
					else{
					indLead.ContactMeDateTime = getISO8601DateTimeString(new Date());
					}
                 // console.dir(indLead);
                    var postData = JSON.stringify(indLead);
					var _this = this;
					var ajaxStartTime = new Date();
					var ajaxStartTimeUTC = ajaxStartTime.toUTCString();
					$.ajax({
						async: true, 
						type: 'POST',
						dataType: 'json',
						contentType: 'application/json; charset=utf-8',
						//url: '/api/genericservice/Individuals/Leads',
						//url: Util.webserviceURL('/api/genericservice/Individuals/Leads'),
						data:postData,
						/*dataFilter: function (resp) {
							var msg = eval('(' + resp + ')');
							if (msg.d)
								return JSON.stringify(msg.d);
							else
								return resp;
						},*/
						success: function (response) {
							Util.eventTiming(ajaxStartTime, "b2c submit", response.Status.toString(), ajaxStartTimeUTC );
							if (!response.HasError) {
										var indLeadViewModel = response.Data;
										var status = indLeadViewModel.status;
										var conf = indLeadViewModel.confirmationNumber;
										$("span.number").html(conf);
									  // $("span.number").append(conf);
										var trackingTime;
										 if(window.aflac.ajax.callCenterAvailibility && indLead.ContactMeType != "now")
										{
										  var iDh = new IndivDateHelper();
										  var phoneTime =  iDh.getDateString(contactMeDateTime, "on {DDDD}, {MMM} {dd} at {hh}:{mm} {tt}");
											trackingTime =  iDh.getDateString(contactMeDateTime, "{hh}:{mm} {tt}");
										  $("span.eta").html(phoneTime);
										}
										else if (!window.aflac.ajax.callCenterAvailibility && indLead.ContactMeType != "now"){
											trackingTime =  "";
										if (!Util.isSpanish()) {
											$("span.eta").html("at your requested time, in the "+indLead.ContactMeType+".");	
										} else {
											$("span.eta").html("a la hora solicitada, en el "+indLead.ContactMeType+".");	
										}
										}
										else
										{
										  var iDh = new IndivDateHelper();
										  trackingTime =  iDh.getDateString(contactMeDateTime, "{hh}:{mm} {tt}");
										//  console.dir(trackingTime);
											if (!Util.isSpanish()) {
												$("span.eta").html("within 15 minutes");
											} else {
												$("span.eta").html("dentro de los 15 minutos");
											}
										}
										if (!Util.isSpanish()) {
											if (status === "duplicate"){
												$('.raq-complete-panel > div.info').html('<p>We already have your information on file. If you feel this is incorrect, contact us at <a class="textlink" href="mailto:salesinquiry@aflac.com">salesinquiry@aflac.com</a></p>');
												$('.raq-complete-panel > div.thanks').html('<div class="title">Thank You!</div>');
											}
										} else {
											if (status === "duplicate"){
												$('.raq-complete-panel > div.info').html('<p>Su información ya había sido archivada anteriormente. Si piensa que esto es incorrecto, contáctenos al <a class="textlink" href="mailto:salesinquiry@aflac.com">salesinquiry@aflac.com</a></p>');
												$('.raq-complete-panel > div.thanks').html('<div class="title">¡Gracias!</div>');
											}
										}
										$(".submit").removeClass('is_loading');
										_this.$formPanel.css("display", "none");
										_this.$completePanel.css("display", "block");
										var jsonSent = $.parseJSON(postData);
										if (window.utag) {
											utag.link({
												_ga_category: 'lead form',
												_ga_action: 'completion',
												_ga_label: utag.data.form_type
											});
											// User Selected Call Type now or later
											utag.link({
												_ga_category: 'lead form',
												_ga_action: 'form detail: call options',
												_ga_label: jsonSent.ContactMeType.toLowerCase()
											});
											//User Selected Call Time Tracking
											if(trackingTime){
												utag.link({
													_ga_category: 'lead form',
													_ga_action: 'form detail: call time',
													_ga_label: trackingTime.toLowerCase()
												});
											}
											for (var i = 0; i < jsonSent.Offerings.length; i++) {
												//console.log(jsonSent.Offerings[i].Name);
												//product selection tracking
												utag.link({
													_ga_category: 'lead form',
													_ga_action: 'form detail: products',
													_ga_label: jsonSent.Offerings[i].Name.toLowerCase()
												});
											}
											// state tracking
											if(jsonSent.State.toLowerCase() !== "na" || jsonSent.State.toLowerCase() !== "er"){
												utag.link({
													_ga_category: 'lead form',
													_ga_action: 'form detail: state',
													_ga_label: jsonSent.State.toLowerCase()
												});
											}

											// if page is not spanish - else fire spanish floodlight
											if (!Util.isSpanish()) {
												utag.link({
													_dc_link_cat: "2015i000",
													_dc_link_type: "indiv0"
												});
											}
											else {
												utag.link({
													_dc_link_cat: "2015i002",
													_dc_link_type: "indiv0"
												});
											}
											
											
										}
							}
							else {
									  $('.raq-complete-panel').empty();
										if (!Util.isSpanish()) {
											$('.raq-complete-panel').append($("<h2><span>We\'re sorry. There was a problem with your request...</span></h2>"));
										} else {
											$('.raq-complete-panel').append($("<h2><span>We\'re sorry. Disculpe, hubo un problema con el proceso...</span></h2>"));
										}
									  if (window.utag) {
										utag.link({_ga_category: 'site diagnostics',_ga_action: 'b2c lead submission error: api',_ga_label: 'status code: ' + response.Status }); 
									  }
							}
	
						},
						error: function (xhr, textStatus, errorThrown ) {
									  $('.raq-complete-panel').empty();
										if (!Util.isSpanish()) {
											$('.raq-complete-panel').append($("<h2><span>We\'re sorry. There was a problem with your request...</span></h2>"));
										} else {
											$('.raq-complete-panel').append($("<h2><span>We\'re sorry. Disculpe, hubo un problema con el proceso...</span></h2>"));
										}
									Util.eventTiming(ajaxStartTime, "b2c submit", xhr.status.toString(), ajaxStartTimeUTC );
									if (window.utag) {  
										utag.link({_ga_category: 'site diagnostics',_ga_action: 'b2c lead submission error: web server',_ga_label: 'status code: ' + xhr.status }); 
									}
									
						}
					});
        },
        onChangeIndex: function(model, value, options) {
		
            var prevStepView = this.stepViews[this.stepNavModel.previous("index")];
            if(prevStepView) {
                prevStepView.hide();
            }
			var showError = true;
			var _this = this;
            var nextStepView = this.stepViews[value];
            if (nextStepView) {
              //  console.log("Next Step View Value: "+ value);
				if (value == 0)
				{
				nextStepView.show();
				}
				if (value == 1)
				{
				window.aflac = window.aflac || {};
				window.aflac.ajax = window.aflac.ajax || {};
                window.aflac.ajax.callCenterStatus = false;
                window.aflac.ajax.callCenterSchedule = false;
				var ajaxStartTime = new Date();
				var ajaxStartTimeUTC = ajaxStartTime.toUTCString();
				$.ajax({
					async: true,
					type: 'GET',
					dataType: 'json',
					contentType: 'application/json; charset=utf-8',
					//url: '/api/genericservice/ClickToCall/CallCenterStatus',
					//url: Util.webserviceURL('/api/genericservice/ClickToCall/CallCenterStatus'),
                    tryCount : 0,
                    retryLimit : 2,
					timeout:30000,
					/*dataFilter: function (resp) {
						var msg = eval('(' + resp + ')');
						if (msg.d)
							return JSON.stringify(msg.d);
						else
							return resp;
					},*/
					success: function (response) {
						Util.eventTiming(ajaxStartTime, "c2c status", response.Status.toString(), ajaxStartTimeUTC );
						if (!response.HasError) {
							window.aflac.ajax.callCenterStatus = response.Data;
						}
						else {
                            if (this.tryCount <= this.retryLimit) {
                                        //try again
                                        $.ajax(this);
                                        return;
                            } 
                            else {
								if (window.utag) {
									utag.link({_ga_category: 'site diagnostics',_ga_action: 'click to call status error: api',_ga_label: 'status code: ' + response.Status }); 
								}
                            }   
						}
					},
					error: function (xhr, textStatus, errorThrown) {
						Util.eventTiming(ajaxStartTime, "c2c status", xhr.status.toString(), ajaxStartTimeUTC );
                        if (this.tryCount <= this.retryLimit) {
                                    //try again
                                    $.ajax(this);
                                    return;
                        } 
                        else {
							if (window.utag) {
								utag.link({_ga_category: 'site diagnostics',_ga_action: 'click to call status error: web server',_ga_label: 'status code: ' + xhr.status }); 
							}
                        }   
					}
				});
				    $.ajax({
					async: true,
					type: 'GET',
					dataType: 'json',
					contentType: 'application/json; charset=utf-8',
					//url: '/api/genericservice/ClickToCall/TimeIntervals',
					//url: Util.webserviceURL('/api/genericservice/ClickToCall/TimeIntervals'),
					timeout:30000,
                    tryCount : 0,
                    retryLimit : 2,
					/*dataFilter: function (resp) {
						var msg = eval('(' + resp + ')');
						if (msg.d)
							return JSON.stringify(msg.d);
						else
							return resp;
					},*/
					success: function (response) {
						Util.eventTiming(ajaxStartTime, "c2c time intervals", response.Status.toString(), ajaxStartTimeUTC );
						if (!response.HasError) {
							window.aflac.ajax.callCenterSchedule = response.Data;
						}
						else {
                             if (this.tryCount <= this.retryLimit) {
                                        //try again
                                        $.ajax(this);
                                        return;
                            } 
                            else {
								if (window.utag) {
									utag.link({_ga_category: 'site diagnostics',_ga_action: 'click to call times error: api',_ga_label: 'status code: ' + response.Status }); 
								}
                            }
						}
					},
					error: function (xhr, textStatus, errorThrown) {
						Util.eventTiming(ajaxStartTime, "c2c time intervals", xhr.status.toString(), ajaxStartTimeUTC );
                        if (this.tryCount <= this.retryLimit) {
                                    //try again
                                    $.ajax(this);
                                    return;
                        } 
                        else {
							if (window.utag) {
								utag.link({_ga_category: 'site diagnostics',_ga_action: 'click to call times error: web server',_ga_label: 'status code: ' + xhr.status }); 
							}
                        }
					}
				});
				nextStepView.show();
				}
                // Get the nextStepView value
                if (value == 2)
                {
                }
                //else
                //nextStepView.show();
            }
        },
        onChangeComplete: function(model, value, options) {
            if(value) {
                this.submit();
		//		if(this.submitPanel === true){
		//		}
            }
            else {
                this.$formPanel.css("display", "block");
                this.$completePanel.css("display", "none");
            }
        }
    });
    return RequestAQuoteForm;
});
function convertScheduleObject(apiCallCenterData)
{
    var now = new Date();
    var nowMSecs = now.valueOf();
    // var timezoneOffset = now.getTimezoneOffset();
    var utcDate =new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(),now.getUTCMilliseconds());
    
    var timezoneOffset = utcDate.valueOf() - nowMSecs;
    
    var schedule = [];
    if(apiCallCenterData)
    {
	//console.log("data in conversion");
        var ccDays = apiCallCenterData.callCenterDates;
        $.each(ccDays, function (index, element) {
         //TODO - remove if statement when api timeinterval last day is fixed
         if (index < ccDays.length - 1){
                var day = new CallCenterTime();
                day.tzOffset = timezoneOffset;
                day.dayOfWeek = element.dayOfWeek;
                var startTime = ConvertToLocalDate(element.startTime.utcTime);
                day.startTime = startTime;
                day.endTime = ConvertToLocalDate(element.endTime.utcTime);
                var startTimeMSecs = startTime.valueOf();
                var endTimeMSecs = day.endTime.valueOf();
    //console.log(nowMSecs < startTimeMSecs, nowMSecs < endTimeMSecs);
                if (element.isOpen && (nowMSecs < startTimeMSecs || nowMSecs < endTimeMSecs))
                {
                    day.date = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate(), 0, 0, 0, 0);
                    var ccTimeIntervals = element.timeIntervals;
                    day.timeIntervals = new Array();
                     //console.log("element open");
                    if (ccTimeIntervals && element.isOpen) {
                        $.each(ccTimeIntervals, function (index, ccTimeInterval) {
                            var intervalStartTime = ConvertToLocalDate(ccTimeInterval.startTime.utcTime);
                            var intervalEndTime = ConvertToLocalDate(ccTimeInterval.endTime.utcTime);
                            var intStartTimeMSecs = intervalStartTime.valueOf();
                            var intEndTimeMSecs = intervalEndTime.valueOf();
                            var timeDifferenceInMins = parseInt(((intStartTimeMSecs - nowMSecs)/(1000*60)));
                            
                            if (ccTimeInterval && ccTimeInterval.isAvailableForCalls && (timeDifferenceInMins >= 15)) {
                                var interval = new CallCenterTime();
                                interval.tzOffset = timezoneOffset;
                                interval.dayOfWeek = element.dayOfWeek;
                                interval.startTime = intervalStartTime;
                                interval.endTime = intervalEndTime;
                                day.timeIntervals.push(interval);
                            }
                        });
                    }
                  
                    if(day && day.timeIntervals && day.timeIntervals.length > 0){
                      schedule.push(day);
                     // console.log(day);
                      }
                }
            
            }
        });
    }
    //console.log("schedule: " + JSON.stringify(schedule));
    return schedule;
    
}
function TimesOfDay()
{
    var MORNING  = "Morning";
    var AFTERNOON = "Afternoon";
    var EVENING = "Evening";
}
function CallCenterTime()
{
    this.tzOffset;
    this.dayOfWeek;
    this.date;
    this.startTime;
    this.endTime;
    this.startTimeSeconds = function () { return (this.startTime.getHours() * 60 * 60) + (this.startTime.getMinutes() * 60) + this.startTime.getSeconds(); };
    this.endTimeSeconds = function () { return (this.endTime.getHours() * 60 * 60) + (this.endTime.getMinutes() * 60) + this.endTime.getSeconds(); };
    this.timeIntervals = [];
    this.getDropDownValue = function () {
        sMonth = this.date.getMonth() + 1;
        sDate = this.date.getDate();
        sYear = this.date.getFullYear();
        return sMonth + "/" + sDate + "/" + sYear;
    }
    this.isSelected = function (dateValue) {
        return (this.getDropDownValue() == dateValue);
    };
}
function ConvertToDate(rawApiDate)
{
    var re = /-?\d+/;
    var m = re.exec(rawApiDate);
    var d = new Date(parseInt(m[0]));
    return d;
}
function ConvertToLocalDate(rawApiDate)
{
    var now = new Date();
    var timeZoneOffset = now.getTimezoneOffset();
    var d = new Date(rawApiDate);
    if (isNaN(d)) {
	      //workaround for IE8 Date creation bug 
	      s = rawApiDate.split(/\D/);
      d = new Date(Date.UTC(s[0], --s[1]||'', s[2]||'', s[3]||'', s[4]||'', s[5]||'', s[6]||''))
	    }
    var rawTimeZoneOffset = d.getTimezoneOffset();
    if (rawTimeZoneOffset != timeZoneOffset)
    {
        var diff = timeZoneOffset - rawTimeZoneOffset;
        var diffInMSecs = diff * 6000;
        var localDateMSecs = d.valueOf() - diffInMSecs;
        d = new Date(localDateMSecs);
    }
    return d;
}
function IndividualLead()
{
    this.Prefix = "";
    this.FirstName ="";
    this.LastName ="";
    this.Email ="";
    this.Phone ="";
    this.City ="";
    this.State="";
    this.Zip="";
    // "direct"
    this.BillingType = "Direct";
        
    // For English: WEB-001, For Spanish: WEB-028
    this.MarketingProgramID ="WEB-001";
    this.Offerings = [];
    // "now", "later", "morning", "evening"
    this.ContactMeType ="now";
    this.ContactMeDateTime = getISO8601DateTimeString(new Date());
    this.addOffering = function(offering)
    {
        var thisOffering = $("input[name='" + offering + "']")[0].value;
        var offer = new Offering();
        offer.Name = thisOffering;
        this.Offerings.push(offer);
    };
}
function getISO8601DateTimeString(date)
{
    //2013-03-04T12:20:59-0600
			var ETOffset = 18000000;
		//2016 Sunday, March 13, 2:00 AM
		if(date.valueOf() > 1457852399){
		//ETOffset = 4;
		ETOffset = 14400000;
		}
		//2016 Sunday, November 6, 2:00 AM
		if(date.valueOf() > 1478411999){
		//ETOffset = 5;
		ETOffset = 18000000;
		}
		//2017	Sunday, March 12, 2:00 AM
		if(date.valueOf() > 1489301999){
		//ETOffset = 4;
		ETOffset = 14400000;
		}
		//2017	Sunday, November 5, 2:00 AM
		if(date.valueOf() > 1509861599){
		//ETOffset = 5;
		ETOffset = 18000000;
		}
		//2018	Sunday, March 11, 2:00 AM
		if(date.valueOf() > 1520751599){
		//ETOffset = 4;
		ETOffset = 14400000;
		}
		//2018	Sunday, November 4, 2:00 AM
		if(date.valueOf() > 1541311199){
		//ETOffset = 5;
		ETOffset = 18000000;
		}

   /* var month = date.getUTCMonth()+1;
    var hours = date.getUTCHours() - ETOffset;
	var day = date.getUTCDate();
	if(day <= 9){
		day = "0"+ day.toString();	
	}
	
    if(date.getDate() != date.getUTCDate()){
		hours = hours + 24;
    }
    hours = (hours < 10 && hours > -10)? "0"+hours : hours+"";
    var mins = date.getUTCMinutes();
    mins = (mins < 10 && mins > -10)? "0"+mins : mins+"";
    var secs = date.getUTCSeconds();
    secs = (secs < 10 && secs > -10)? "0"+secs : secs+"";
    
    var serverDateString = date.getFullYear()+"-"+month+"-"+day+"T"+hours+":"+mins+":"+secs+"Z";*/
	if(!Date.prototype.toISOString){
		var UTCDate = date.toUTCString();	
	}else{
		var UTCDate = date.toISOString();		
	}	
	
//console.log("1:"+UTCDate);
	var UTCEpoch = new Date(UTCDate).valueOf();
//console.log("2:"+UTCEpoch);
	var ETDATE = UTCEpoch - ETOffset;
	
	
	
	
if (!Date.prototype.toISOString) {
 
    (function () {
 
        'use strict';
 
        // Function which takes a 1 or 2-digit number and returns
        // it as a two-character string, padded with
        // an extra leading zero, if necessary.
        function pad(number) {
            var r = String(number);
            if (r.length === 1) {
                r = '0' + r;
            }
			//console.log(r);
            return r;
        }
 
        Date.prototype.toAflacISOString = function () {
            return this.getUTCFullYear()
                + '-' + pad(this.getUTCMonth() + 1)
                + '-' + pad(this.getUTCDate())
                + 'T' + pad(this.getUTCHours())
                + ':' + pad(this.getUTCMinutes())
                + ':' + pad(this.getUTCSeconds())
                + '.000Z';
         };
 
    }());
}
	
	
	
	if(!Date.prototype.toISOString){
		var ETDATESTRING = new Date(ETDATE).toAflacISOString();
	}else{
		var ETDATESTRING = new Date(ETDATE).toISOString();		
	}
	
	
	
//console.log("3:"+ETDATESTRING);
	var serverDateString = ETDATESTRING;

    return serverDateString;
}
function Offering()
{
    this.Name="";
}
function IndivDateHelper()
{
    this.MonthShortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    this.MonthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    this.WeekDayShortNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    this.WeekDayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    this.getServerDateString = function (date)
    {
        sMonth = date.getMonth() + 1;
        sDate = date.getDate();
        sYear = date.getFullYear();
        return sMonth + "/" + sDate + "/" + sYear;
    };
    this.getDateString = function(date, format)
    {
        var newDate = format;
        sMonth = date.getMonth();
		//console.log(sMonth);
        sMonthRank = sMonth+1;
        sDay = date.getDay();
        sDate = date.getDate();
        s0Date = (sDate < 10) ? "0" + sDate : "" + sDate;
        sFullYear = date.getFullYear();
        sYear = date.getYear() - 100;
        sHours24 = date.getHours();
        s0Hours24 = (sHours24 < 10 && sHours24 != 00)? "0"+sHours24 : ""+sHours24;
        sMins = date.getMinutes();
        s0Mins = (sMins < 10)? "0"+sMins : ""+sMins;
        sSecs = date.getSeconds();
        s0Secs = (sSecs < 10) ? "0" + sSecs : "" + sSecs;
        sHours = (sHours24 > 12) ? sHours24 - 12 : sHours24;
        sHours = (sHours24 == 0) ? 12 : sHours;
        s0Hours = (sHours < 10) ? "0" + sHours : "" + sHours;
        sAMPM = (sHours24 >= 12) ? "PM" : "AM";
        newDate = newDate.replace("{DDDD}", this.WeekDayNames[sDay]);
        newDate = newDate.replace("{DDD}", this.WeekDayShortNames[sDay]);
        newDate = newDate.replace("{DD}", this.WeekDayShortNames[sDay].substr(0, 2));
        newDate = newDate.replace("{D}", this.WeekDayShortNames[sDay][0]);
        newDate = newDate.replace("{MMMM}", this.MonthNames[sMonth]);
        newDate = newDate.replace("{MMM}", this.MonthShortNames[sMonth]);
        newDate = newDate.replace("{MM}", sMonthRank);
        newDate = newDate.replace("{M}", sMonthRank);
        newDate = newDate.replace("{yyyy}", sFullYear);
        newDate = newDate.replace("{yy}", sYear);
        newDate = newDate.replace("{dd}", s0Date);
        newDate = newDate.replace("{d}", sDate);
        newDate = newDate.replace("{HH}", s0Hours24);
        newDate = newDate.replace("{H}", sHours24);
        newDate = newDate.replace("{hh}", s0Hours);
        newDate = newDate.replace("{h}", sHours);
        newDate = newDate.replace("{mm}", s0Mins);
        newDate = newDate.replace("{m}", sMins);
        newDate = newDate.replace("{ss}", s0Secs);
        newDate = newDate.replace("{s}", sSecs);
        newDate = newDate.replace("{tt}", sAMPM);
        newDate = newDate.replace("{t}", sAMPM);
//console.log(newDate);
        return newDate;
    }
}
