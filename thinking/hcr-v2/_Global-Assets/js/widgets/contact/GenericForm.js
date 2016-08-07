
define([
	"underscore",
	"lib/Env",
	"lib/Util",
	"lib/MediaQueries",
	"lib/BaseView",
	"lib/common_components/InfoboxPopup",
	"widgets/ErrorLightbox",
	"./FormHelper",
	"./GenericFormModel"
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
	var GenericForm = BaseView.extend({
		el: 'form.contact',
		initialize: function(options) {
			
			_.bindAll(this,
				"onClickSubmit"
			);
			
			this.model = new FormModel();
			this.$input = this.$(".input-text input, .input-text textarea, select");
			this.$form = this.$("input[name='form']");
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

			this.$("input[name=day_phone]").mask("999-999-9999", {placeholder: " "});
			this.$("input[name=evening_phone]").mask("999-999-9999", {placeholder: " "});
			this.$("input[name=phone_us]").mask("999-999-9999", {placeholder: " "});
			this.$("input[name=phone_number]").mask("999-999-9999", {placeholder: " "});
			this.$("input[name=zipcode]").mask("99999", {placeholder: " "});
			this.$("input[name=date_of_birth]").mask("99/99/9999", {placeholder: " "});

			this.model.on("invalid", this.onInvalidModel, this);
			this.$submit.on("submit", this.onClickSubmit);
            $(document).ready(function(){
			if (window.utag) {
                utag_data.contact_form = $(".side_container").find("h3").text().toLowerCase();
			}
                if($("form.contact").length > 0){
					if (window.utag) {
						utag.link({_ga_category: 'contact aflac section',_ga_action: 'form view',_ga_label: utag.data.contact_form});
					}
                }
            });
			this.reset();			
			this.model.on("change", this.onModelChange, this);
			//console.dir(this);
		},
		onSelect: function (){
			var m = {};
			this.$el.find(".dropdown-box").each(function(){				
				var value = $(this).find("select").attr("name");
				m[value] = $(this).find("option[selected='selected']").text();
			});
			this.$el.find("textarea").each(function(){				
				var value = $(this).attr("name");
				m[value] = $(this).val();
			});
			this.model.set(m);
		},
		onModelChange: function() {
			if(!this.model.get('initiated')){
				this.model.set('initiated', true);
				if (window.utag) {
					utag.link({_ga_category: 'contact aflac section',_ga_action: 'form initiate',_ga_label: utag.data.contact_form});
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
			//utag.link({_ga_category: 'lead form',_ga_action: 'error',_ga_label: 'form validation error'});
			if (window.utag) {
				utag.link({_ga_category: 'contact aflac section',_ga_action: 'form error',_ga_label: 'form validation error'});
			}

			//if(!Env.IE8 && matchMedia(MediaQueries.HEADER_HAMBURGER).matches) {
				var errorLightbox = new ErrorLightbox({
					data: {
						title: "Error",
						message: error.message
					}
				});
				errorLightbox.show();
			//}
			/*else {
				var isFixed = Util.isPositionFixed(this.$formFields[0]);
				var listBoundingRect = this.$formFields[0].getBoundingClientRect();
				var infoboxPopup = new InfoboxPopup({
					title: "Error",
					message: error.message,
					origin: {
						position: isFixed ? "fixed" : "absolute",
						top: (listBoundingRect.top + listBoundingRect.bottom) / 2 + (isFixed ? 0 : $(window).scrollTop()),
						left: listBoundingRect.right + (isFixed ? 0 : $(window).scrollLeft())
					},
					error: true
				});
				infoboxPopup.show();
			}*/
		},
		onClickSubmit: function(event) {

			this.onSelect();
			
			if(this.model.isValid()) {
				
				event.preventDefault();
				$(".submit").addClass('is_loading');				
				var data = this.$submit.serialize().split('+').join(' ');
				var _this = this;
				function QueryStringToJSON() {
					var pairs = data.split('&');
					var result = {};
					$.each(pairs, function (i, pair) {
						paired = pair.split('=');
						var pHolder = _this.$submit.find("input[name='"+paired[0]+"']").attr('placeholder');
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
				//console.dir(results);
				
				function decode(a) {
					// ROT13 : a Caesar cipher 
					// letter -> letter' such that code(letter') = (code(letter) + 13) modulo 26
					return a.replace(/[a-zA-Z]/g, function(c){
					  return String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
					})
				  }; 
				var emailSender = $("input[name='email_address']").val();
				var emailSubject = $(".side_container").find("h3").text();
				var emailBody = '';
                var toAddress = '';
                for (var key in results) {
                  if (results.hasOwnProperty(key)) {
                  //  alert(key + " -> " + p[key]);
                    if(key == "WcoFormId"){} 
					else if (key == "ToAddress"){
						toAddress = decode(results[key]);
					} 
                    else{
                    	 emailBody = emailBody  + key +" : "+results[key]+ "<br>";
                    }       
                  }
                }    

                var email = {
							"ToAddress" : toAddress,
							"FromAddress" : emailSender,
							"MessageSubject" : ""+emailSubject+" Inquiry",
							"MessageBody" : emailBody,
							"IsHTML" : "true"
							};
                        $.ajax({
                        type: 'POST',
                        dataType: 'json',
                        contentType: 'application/json; charset=utf-8',
                        url: Util.webserviceURL('/api/genericservice/SendEmail'),
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
								if(!Util.isSpanish()){
									$(".container_2_33").html('<div class="contact-us-thank-you"><h2>Thank you.</h2><h3>Your request has been successfully submitted.</h3></div>');
								}
								else{
									$(".container_2_33").html('<div class="contact-us-thank-you"><h2>Thank you.</h2><h3>Your request has been successfully submitted.</h3></div>');
								}
                                if (window.utag) {
									utag.link({_ga_category: 'contact aflac section',_ga_action: 'form submit',_ga_label: utag.data.contact_form});
								}
                            }
                            else {
								if(!Util.isSpanish()){
									$(".container_2_33").html('<div class="contact-us-thank-you"><h2>Error</h2><h3>We\'re sorry there was a problem with your request. </h3><p>Please email your problem to <a href="mailto:webmaster@aflac.com" class="textlink">webmaster@aflac.com</a></p></div>');
								}
								else{
									$(".container_2_33").html('<div class="contact-us-thank-you"><h2>Error</h2><h3>We\'re sorry there was a problem with your request. </h3><p>Please email your problem to <a href="mailto:webmaster@aflac.com" class="textlink">webmaster@aflac.com</a></p></div>');
								}	
                                if (window.utag) {
									utag.link({_ga_category: 'site diagnostics',_ga_action: 'email submission error: api',_ga_label: 'status code: ' + response.Status }); 
									utag.link({_ga_category: 'contact aflac section',_ga_action: 'form error',_ga_label: 'email submission error'});
								}
                            }
                            $(".submit").removeClass('is_loading');
                        },
                        error: function (xhr, textStatus, errorThrown) {
                            $(".submit").removeClass('is_loading');
							if(!Util.isSpanish()){
								$(".container_2_33").html('<div class="contact-us-thank-you"><h2>Error</h2><h3>We\'re sorry there was a problem with your request. </h3><p>Please email your problem to <a href="mailto:webmaster@aflac.com" class="textlink">webmaster@aflac.com</a></p></div>');
							}
							else{
								$(".container_2_33").html('<div class="contact-us-thank-you"><h2>Error</h2><h3>We\'re sorry there was a problem with your request. </h3><p>Please email your problem to <a href="mailto:webmaster@aflac.com" class="textlink">webmaster@aflac.com</a></p></div>');
							}	
							if (window.utag){
								utag.link({_ga_category: 'site diagnostics',_ga_action: 'email submission error: web server',_ga_label: 'status code: ' + xhr.status }); 
								utag.link({_ga_category: 'contact aflac section',_ga_action: 'form error',_ga_label: 'email submission error'});
							}
                        }
                    });
			}
			else {
				event.preventDefault();
			}
		}
	});
	return GenericForm;
});



