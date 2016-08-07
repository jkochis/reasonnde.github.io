

/* globals define */

define([
	'underscore',
	'lib/Env',
	'lib/Util',
	'lib/MediaQueries',
	'lib/BaseView',
	'lib/common_components/InfoboxPopup',
	'widgets/ErrorLightbox',
	'../../../widgets/contact/FormHelper',
	'./SubmitSuccessModel'
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

	var SubmitSuccessForm = BaseView.extend({

		initialize: function() {
			_.bindAll(this, 'onClickSubmit');

			this.model = new FormModel();

			this.formHelper = new FormHelper({
				el: this.el,
				model: this.model
			});

			this.$formPanel = this.$('.form-panel');
			this.$completePanel = this.$('.complete-panel');
			this.$form = this.$('form');
			this.$submit = this.$('.submit');
			this.$formFields = this.$('.fieldset');

			this.model.on('invalid', this.onInvalidModel, this);
			this.$submit.on('click', this.onClickSubmit);

			this.reset();
		},

		sizeFakeInputs: function() {
			var inputs = this.$form.find('.faux-placeholder');
			if(inputs.length > 0) {
				for (var i = 0; i < inputs.length; i++) {
					var input = inputs.eq(i);
					var sibling = input.siblings('input');
					input.css(sibling.css(["width", "height"]));
				}				
			}
		},

		reset: function() {
			this.formHelper.reset();
			this.$formPanel.css('display', 'block');
			this.$completePanel.css('display', 'none');
		},

		removeErrors: function() {
			this.formHelper.removeErrors();
		},

		onInvalidModel: function(model, error) {
			this.formHelper.setError(error.fields);

			if(!Env.IE8 && matchMedia(MediaQueries.HEADER_HAMBURGER).matches) {
				var errorLightbox = new ErrorLightbox({
					data: {
						title: 'Error',
						message: error.message
					}
				});
				errorLightbox.show();
			}
			else {
				var isFixed = Util.isPositionFixed(this.$formFields[0]);
				var listBoundingRect = this.$formFields[0].getBoundingClientRect();
				var infoboxPopup = new InfoboxPopup({
					title: 'Error',
					message: error.message,
					origin: {
						position: isFixed ? 'fixed' : 'absolute',
						top: (listBoundingRect.top + listBoundingRect.bottom) / 2 + (isFixed ? 0 : $(window).scrollTop()),
						left: listBoundingRect.left + (isFixed ? 0 : $(window).scrollLeft())
					},
					error: true
				});
				infoboxPopup.show();
			}
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

		onClickSubmit: function(event) {
			// event.preventDefault();
			// if(this.model.isValid()) {
			// 	var data = this.$form.serialize();
			// 	$.ajax(this.$form.attr('action'), {
			// 		data: data,
			// 		type: this.$form.attr('method')
			// 	});
			// 	this.$formPanel.css('display', 'none');
			// 	this.$completePanel.css('display', 'block');
			// }
			this.onSelect();

      if(this.model.isValid()) {

        event.preventDefault();  
		$('.submit').addClass('is_loading is-white-tq');		
        var data = this.$form.serialize().split('+').join(' ');  

        var QueryStringToJSON = function() {
          var pairs = data.split('&');
          var result = {};
           
					$.each(pairs, function (i, pair) {
						var paired = pair.split('=');
						result[paired[0]] = decodeURIComponent(paired[1] || '');
					});

          return JSON.parse(JSON.stringify(result));        	
        }

        var results = QueryStringToJSON();

        var decode = function(a) {
          // ROT13 : a Caesar cipher
          // letter -> letter' such that code(letter') = (code(letter) + 13) modulo 26
          return a.replace(/[a-zA-Z]/g, function(c){
            return String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
          });
        };
          
        var _this = this;
        var emailSender = $("input[name='email']").val();
        var emailSubject = $(".ev_lightbox-submit-ctn").find("h4").text();
        var emailBody = '';
        var toAddress = '';
        for (var key in results) {
          if (results.hasOwnProperty(key)) {
            if(key == "WcoFormId"){}
            else if (key == "ToAddress") {
              toAddress = decode(results[key]);
            }
            else {
              emailBody = emailBody  + key +" : "+results[key]+ "<br>";
            }         
          }
        }
         
        var email = {
          "ToAddress" : toAddress,
          "FromAddress" : emailSender,
          "MessageSubject" : "Everwell Hub "+emailSubject+" Submission",
          "MessageBody" : emailBody,
          "IsHTML" : "true"
        };

				$.ajax({
					type: 'POST',
					dataType: 'json',
					contentType: 'application/json; charset=utf-8',
					url: '/api/genericservice/SendEmail',
					data: JSON.stringify(email),
					success: function (response) {
						if (!response.HasError) {
							$(".form-panel").hide();
							$(".complete-panel").show();
							//$(".form-section .fieldset").html('<div class="contact-us-thank-you"><h2>Thank you.</h2><h3>Your request has been successfully submitted.</h3></div>');
							if (window.utag) {
								utag.link({_ga_category: 'everwell testimonial',_ga_action: 'submit',_ga_label: 'submit story'});
							}
						}
						else {
							$(".form-panel").hide();
							$(".complete-panel").html('<div class="contact-us-thank-you"><h2>Error</h2><h3>We\'re sorry there was a problem with your request. </h3><p>Please email your problem to <a href="mailto:webmaster@aflac.com" class="textlink">webmaster@aflac.com</a></p></div>').show();
							
							if (window.utag) {
								utag.link({_ga_category: 'site diagnostics',_ga_action: 'email submission error: api',_ga_label: 'status code: ' + response.Status });
								utag.link({_ga_category: 'everwell testimonial',_ga_action: 'error',_ga_label: 'submit story'});
							}
						}
						$('.submit').removeClass('is_loading is-white-tq');
					},
					error: function (xhr, textStatus, errorThrown) {
						$('.submit').removeClass('is_loading is-white-tq');
						$(".form-panel").hide();
						$(".complete-panel").html('<div class="contact-us-thank-you"><h2>Error</h2><h3>We\'re sorry there was a problem with your request. </h3><p>Please email your problem to <a href="mailto:webmaster@aflac.com" class="textlink">webmaster@aflac.com</a></p></div>').show();
						if (window.utag) {
							utag.link({_ga_category: 'site diagnostics',_ga_action: 'email submission error: web server',_ga_label: 'status code: ' + xhr.status });
							utag.link({_ga_category: 'everwell testimonial',_ga_action: 'error',_ga_label: 'submit story'});
						}
					}
				});
      }
      else {
        event.preventDefault();
      }
		}
	});

	return SubmitSuccessForm;

});