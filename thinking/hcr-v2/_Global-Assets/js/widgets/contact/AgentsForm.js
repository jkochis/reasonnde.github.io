define([
	"underscore",
	"vendor/jquery.maskedinput.min",
	"lib/Env",
	"lib/Util",
	"lib/MediaQueries",
	"lib/BaseView",
	"lib/common_components/InfoboxPopup",
	"widgets/ErrorLightbox",
	"./FormHelper",
	"./AgentsFormModel"
],
function(
	_,
	maskedinput,
	Env,
	Util,
	MediaQueries,
	BaseView,
	InfoboxPopup,
	ErrorLightbox,
	FormHelper,
	FormModel
) {
    var AgentsForm = BaseView.extend({
        initialize: function(options) {
            _.bindAll(this,
				"onClickSubmit"
			);
            var proPathSource = getUrlVars()["proPath_Source"];
            var ppSourceList = new ProPathSourceList();
          //  console.log("ProPathSourceList", ppSourceList);
      
            this.refererVal = ppSourceList.findMatch(proPathSource);
			if(!this.refererVal){
				             proPathSource = getUrlVars()["utm_source"];
							ppSourceList = new ProPathSourceList();
          //  console.log("ProPathSourceList", ppSourceList);
      
				this.refererVal = ppSourceList.findMatch(proPathSource);
			}
      
            this.model = new FormModel();
            this.formHelper = new FormHelper({
                el: this.el,
                model: this.model
            });
            _.each(this.formHelper.inputs, _.bind(function(input, index, list) {
                if(input.name == "over18") {
                    this.over18 = input;
                    this.over18.on("change", this.onChangeOver18, this);
                }
                else if(input.name == "notover18") {
                    this.notOver18 = input;
                    this.notOver18.on("change", this.onChangeNotOver18, this);
                }
                else if (input.name == "spanish") {
                    this.spanish = input;
                    this.spanish.on("change", this.onChangeSpanish, this);
                }
            }, this));
       
            this.$formPanel = this.$(".form-panel");
            this.$completePanel = this.$(".complete-panel");
            this.$form = this.$("form");
            this.$formFields = this.$(".form-fields");
            this.$submit = this.$(".submit");
            this.$("input[name=phone]").mask("999-999-9999", {placeholder: " "});
            this.$("input[name=zipcode]").mask("99999", {placeholder: " "});
			this.$("input[name=agentnumber]").mask("*****", {placeholder: " "});
            this.model.on("invalid", this.onInvalidModel, this);
            this.$submit.on("click", this.onClickSubmit);
            this.$refDropDownRow = this.$("select[name='referer']").parent(".dropdown-box").parent(".row");
            this.$refDropDown = this.$("select[name='referer']");
      
            this.reset();
			this.model.on("change", this.onModelChange, this);
            if(this.refererVal && this.refererVal != null && this.refererVal.length > 0)
            {
                $("#referer option[value=" + this.refererVal + "]").attr('selected', 'selected');
                this.$refDropDownRow.css("display", "none");
                this.model.referer = this.refererVal;
                this.model.set('referer', this.refererVal);
            }
            else
            {
                this.$refDropDownRow.css("display", "block");
            }
        },
		onModelChange: function() {
			if(!this.model.get('initiated')){
				this.model.set('initiated', true);
                if (window.utag) {
                    utag.link({_ga_category: 'lead form',_ga_action: 'initiate',_ga_label: utag.data.form_type});
                }
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
            //			console.log(error);
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
                // TODO Show infobox
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
		
		onInvalidZipcode: function(model, error, options) {
            this.formHelper.setError($('input[name="zipcode"]'));
            //			console.log(error);
            if (window.utag) {
                utag.link({_ga_category: 'lead form',_ga_action: 'error',_ga_label: 'form validation error'});
            }    
            if(!Env.IE8 && matchMedia(MediaQueries.HEADER_HAMBURGER).matches) {
				if (!Util.isSpanish()) {
					var errorLightbox = new ErrorLightbox({
						data: {
							title: "Invalid Zipcode",
							message: "Please enter a valid zipcode"
						}
					});
				} else {
					var errorLightbox = new ErrorLightbox({
						data: {
							title: "Código postal no válido",
							message: "Por favor ingrese un código postal válido"
						}
					});
				}
                errorLightbox.show();
            }
            else {
                // TODO Show infobox
                var isFixed = Util.isPositionFixed(this.$formFields[0]);
                var listBoundingRect = this.$formFields[0].getBoundingClientRect();
				if (!Util.isSpanish()) {
					var infoboxPopup = new InfoboxPopup({
						title: "Invalid Zipcode",
						message: "Please enter a valid zipcode",
						origin: {
							position: isFixed ? "fixed" : "absolute",
							top: (listBoundingRect.top + listBoundingRect.bottom) / 2 - 56 + (isFixed ? 0 : $(window).scrollTop()),
							left: listBoundingRect.left + (isFixed ? 0 : $(window).scrollLeft())
						},
						error: true
					});
				} else {
					var infoboxPopup = new InfoboxPopup({
							title: "Código postal no válido",
							message: "Por favor ingrese un código postal válido",
						origin: {
							position: isFixed ? "fixed" : "absolute",
							top: (listBoundingRect.top + listBoundingRect.bottom) / 2 - 56 + (isFixed ? 0 : $(window).scrollTop()),
							left: listBoundingRect.left + (isFixed ? 0 : $(window).scrollLeft())
						},
						error: true
					});
				}
                infoboxPopup.show();
            }
        },
        onClickSubmit: function (event) {
            event.preventDefault();		
            if (this.model.isValid()) {
				$(".submit").addClass('is_loading');
				
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
                        //console.log(results);
                        /*
                        addressline1: "test"
                        addressline2: ""
                        agentnumber: ""
                        city: "Irvine"
                        email: "test@gemail.com"
                        firstname: "test"
                        lastname: "test"
                        over18: "on"
                        phone: "123-213-1231"
                        referer: "C"
                        spanish: "on"
                        state: "California"
                        state_abbreviation: "CA"
                        subscriberIdList: "*=15584|NY=16082"
                        zipcode: "92606"
                        */
						var agentLead = new AgentLead();
							agentLead.AddressLine1 = results.addressline1;
							agentLead.AddressLine2 = results.addressline2 || "";
							agentLead.WritingNumber = results.agentnumber;
							agentLead.City = results.city;
							agentLead.Email = results.email;
							agentLead.FirstName = results.firstname;
							agentLead.LastName = results.lastname;
							agentLead.AgeVerified = (results.over18 == "on");
							agentLead.Phone = results.phone.split("-").join("");
							agentLead.Source = $("#referer option[selected='selected']").val() || _this.model.referer;
							if(results.spanish == "on")
								agentLead.Languages.push("Spanish");
							agentLead.State = results.state_abbreviation;
							var subIds = results.subscriberIdList.split("|"); 
							var selectedState = results.state_abbreviation;
							var stateAb = selectedState +"=";
							if(results.subscriberIdList.indexOf(stateAb) < 0) 
								selectedState = "*";
							if(subIds != null && subIds.length > 0)
							{
								var c = subIds.length;
								for(i=0; i<c; i++)
								{
									var subId = subIds[i];
									if(subId.indexOf(selectedState) >= 0)
									{
										agentLead.SubscriberID = subId.split('=')[1];
										break;
									}
								}
							}
							agentLead.Zip = results.zipcode;
						if( agentLead.State !== "NA" ){
							//Ajax Post to the service and read the response and update Thank you or Error Fields 
							var agentLeadExt = new AgentLeadApiExtension();
							agentLeadExt.POSTAgentLead(agentLead, Util);
						} 
						else if (agentLead.Zip === "99999" && agentLead.Phone === "9999999999" && agentLead.FirstName === "test" ){
							agentLead.State = "GA";
							var agentLeadExt = new AgentLeadApiExtension();
							agentLeadExt.POSTAgentLead(agentLead, Util);
						}
						else {
						 _this.onInvalidZipcode();
						 $(".submit").removeClass('is_loading');
						}
                    }
                });
                //End ziplookup
            }
        },
        onChangeOver18: function(checkbox) {
            if(checkbox.getValue()) {
                this.notOver18.setValue(false);
            }
        },
        onChangeNotOver18: function(checkbox) {
            if(checkbox.getValue()) {
                this.over18.setValue(false);
            }
        },
        onChangeSpanish: function(checkbox) {
           /* if(checkbox.getValue()) {
                this.spanish.setValue(true);
            }*/
			if($(checkbox).hasClass("is-checked")){
				$(checkbox).removeClass("is-checked");
			}
			else{
				$(checkbox).addClass("is-checked");
			}
			
        }
    });
    return AgentsForm;
});
function AgentLead() {
    this.Prefix = "";
    this.FirstName = "";
    this.LastName = "";
    this.AddressLine1 = "";
    this.AddressLine2 = "";
    this.City = "";
    this.State = "";
    this.Zip = "";
    this.Phone = "";
    this.Email = "";
    //Source dropdown "How did you hear about us?"
    this.Source = "";
    //Referring Agent Number
    this.WritingNumber = "";
    this.AgeVerified = false;
    this.AdditionalSource = '';
    this.EnableInternetSource = true;
    this.InternetSource = "";
    this.ExternalResult = '';
    //PartnerID is always empty
    this.PartnerID = '';
    //New York Subscriber id = 16082. All other states id = 15584
    this.SubscriberID = "";
    this.Languages = ["English"];
}
function AgentLeadApiExtension (){
 
    /*
         var prefix = $('#').val();
         var firstName = $('#firstname').val();
         var lastName = $('#lastname').val();
         var address1 = $('#addressline1').val();
         var address2 = $('#addressline2').val();
         var city = $('#').val();
         var state = $('#lstState').val();
         var zip = $('#zipcode').val();
         var phone = $('#phone').val();
         var email = $('#email').val();
    
         var source = $('#').val();
         var writingNumber = $('#').val();
         var ageVerified = $('#checkbox').val();
         var additionalSource = $('#').val();
         var enableInternetSource = $('#').val();
         var internetSource = $('#').val();
         var externalResult = $('#').val();
         var partnetID = $('#').val();
         var subscriberID = $('#').val();
         $('spanish')
         var languages = $('#').val();
        */
    this.POSTAgentLead = function(postData, Util) {
		var ajaxStartTime = new Date();
		var ajaxStartTimeUTC = ajaxStartTime.toUTCString();
		
		
        $.ajax({
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            //url: Util.webserviceURL('/api/genericservice/agents/leads'),
            data: JSON.stringify(postData),
            dataFilter: function (resp) {
                var msg = eval('(' + resp + ')');
                if (msg.d && msg.d != null)
                    return JSON.stringify(msg.d);
                else
                    return resp;
            },
			success: function (response) {
				Util.eventTiming(ajaxStartTime, "agent submit", response.Status.toString(), ajaxStartTimeUTC );
				if (!response.HasError) {
					//Display "thank you" message
                    if (window.utag) {
                        utag.link({_ga_category: 'lead form',_ga_action: 'step 1:  submit',_ga_label: utag.data.form_type});
						utag.link({_ga_category: 'lead form',_ga_action: 'completion',_ga_label: utag.data.form_type});
                  
						if(postData.State.toLowerCase() !== "na" || postData.State.toLowerCase() !== "er"){
							utag.link({
								_ga_category: 'lead form',
								_ga_action: 'form detail: state',
								_ga_label: postData.State.toLowerCase()
							});
						}
						utag.link({
							_ga_category: 'lead form',
							_ga_action: 'form detail: source',
							_ga_label: postData.Source.toLowerCase()
						});
                        if(postData.Languages[1]){
                            utag.link({
                                _ga_category: 'lead form',
                                _ga_action: 'form detail:proficiency in spanish',
                                _ga_label: 'selected'
                            });
                        } 
						
						// if page is not spanish - else fire spanish floodlight
						if (!Util.isSpanish()) {
							utag.link({
								_dc_link_cat: "2015a004",
								_dc_link_type: "agent0"
							});
						}
						else {
							utag.link({
								_dc_link_cat: "2015a00",
								_dc_link_type: "agent0"
							});
						}

                    }    
					$(".form-panel").css("display", "none");
					$('.complete-panel').css("display", "block");
				}
				else {
					$('.complete-panel').empty();
					if (!Util.isSpanish()) {
						$('.complete-panel').append($('<h2 style="font-size: 30px;line-height: 100%;"><span >We\'re sorry. There was a problem with your request...</span></h2>'));
					} else {
						$('.complete-panel').append($('<h2 style="font-size: 30px;line-height: 100%;"><span >Disculpe, hubo un problema con el proceso...</span></h2>'));
					}
					$(".form-panel").css("display", "none");
					$('.complete-panel').css("display", "block");
                    if (window.utag) {
                        utag.link({_ga_category: 'site diagnostics',_ga_action: 'agent form submission error: api',_ga_label: 'status code: ' + response.Status });
                    }
				}
				$(".submit").removeClass('is_loading');
			},
			error: function (xhr, textStatus, errorThrown) {
				$('.complete-panel').empty();
					if (!Util.isSpanish()) {
						$('.complete-panel').append($('<h2 style="font-size: 30px;line-height: 100%;"><span >We\'re sorry. There was a problem with your request...</span></h2>'));
					} else {
						$('.complete-panel').append($('<h2 style="font-size: 30px;line-height: 100%;"><span >Disculpe, hubo un problema con el proceso...</span></h2>'));
					}
					$(".form-panel").css("display", "none");
					$('.complete-panel').css("display", "block");
				$(".submit").removeClass('is_loading');
                if (window.utag) {
                    utag.link({_ga_category: 'site diagnostics',_ga_action: 'agent form submission error: web server',_ga_label: 'status code: ' + xhr.status });
					Util.eventTiming(ajaxStartTime, "agent submit", xhr.status.toString(), ajaxStartTimeUTC );
                }
			}
        });
    }
}
function ProPathSource(sk, sv) {
    this.sourceKey = sk;
    this.sourceVal = sv;
    this.isMatch = function(key) {
        if(key == null)
        {
            return false;
        }
        return (this.sourceKey.toLowerCase() == key.toLowerCase());
    
    }
}
function ProPathSourceList(){
 this.sources = [
    new ProPathSource("employmentnetworks", "1")
, new ProPathSource("employment-networks", "1")
, new ProPathSource("careerco", "1")
, new ProPathSource("career-co", "1")
, new ProPathSource("careerco-bilingual", "JF")
, new ProPathSource("career-co-bilingual", "JF")
, new ProPathSource("sales-career", "R")
, new ProPathSource("careerbuilder", "M")
, new ProPathSource("monster", "5")
, new ProPathSource("indeed", "X")
, new ProPathSource("simplyhired", "2")
, new ProPathSource("google", "K")
, new ProPathSource("tv-ad", "C")
, new ProPathSource("career-fair", "F")
, new ProPathSource("college-campus-recruiting", "G")
, new ProPathSource("social-media", "8")
, new ProPathSource("direct-mail", "6")
, new ProPathSource("email", "U")
, new ProPathSource("simplyhired-esp", "L")
, new ProPathSource("careerbuilder-esp", "H")
, new ProPathSource("monster-esp", "S")
, new ProPathSource("indeed-esp", "J")
, new ProPathSource("google-esp", "B")
, new ProPathSource("linkedin", "T")
, new ProPathSource("licensed-agent-list", "W")
, new ProPathSource("marketingbuy", "Y")
, new ProPathSource("marketingbuy2", "4")
, new ProPathSource("ncsc", "3")
, new ProPathSource("marketing-dm", "O")
, new ProPathSource("licensedagent", "6")
, new ProPathSource("salescareer", "R")
, new ProPathSource("beyond", "JA")
, new ProPathSource("glassdoor", "JB")
, new ProPathSource("ziprecruiter", "JC")
    ];
    this.addSource = function(sourceKey, sourceVal){
        this.sources.push(new ProPathSource(sourceKey, sourceVal));
    };
    this.findMatch = function(key){
        var match = null;
        $.each(this.sources, function (index, element) {
            if(element.isMatch(key))
            {
                match = element.sourceVal;
                return false;
            }
      
        });
        return match;
    };
}
// Read a page's GET URL variables and return them as an associative array.
function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}