define([
	"lib/Env",
    "lib/Util",
	"lib/MediaHelper",
	"lib/MediaQueries",
	"lib/common_components/InfoboxPopup",
	"lib/common_components/FormInputText",
	"lib/WidgetView",
	"./contact/FormHelper"
],
function(
    Env,
    Util,
	MediaHelper,
	MediaQueries,
	InfoboxPopup,
	FormInputText,
	WidgetView,
	FormHelper
) {
	var AccountLogin = WidgetView.extend({
		initialize: function(options) {
			this.registerMediaHelper(DefaultMediaHelper);
		}
	},
	{
    selector: ".w_account-login"
	});
	var DefaultMediaHelper = MediaHelper.extend({
		mediaQuery: MediaQueries.HEADER_DEFAULT,
		initialize: function(options) {
			_.bindAll(this,
				"onClickLoginButton"
			);
			this.model = new Backbone.Model({
				username: false,
				password: false
			});
			this.model.validate = function(attr, options) {
				//console.log(attr);
				var counter = 0;
				_.each(attr, function(value, key, list) {
					if(value) {
						counter++;
					}
				});
				if(counter<2) {
					return {
						message: "Please provide a user ID and password"
					};
				}
			}

			this._loginButton = this.$(".login");
			this.formHelper = new FormHelper({
				el: this.$("form"),
				model: this.model
			});
            this.$formFields = this.$("#txtOLSLoginUserName");
		},
		onSetUp: function() {
			this._loginButton.on("click", this.onClickLoginButton);
			this.model.on("invalid", this.onInvalidModel, this);
		},
		onTearDown: function() {
			this._loginButton.off("click", this.onClickLoginButton);
			this.model.off("invalid", this.onInvalidModel, this);
		},
		onInvalidModel: function(model, error, options) {
		//	console.log(error);
			for(var i = 0; i < this.formHelper.inputs.length; i++) {
				var input = this.formHelper.inputs[i];
				if(!input.getValue()) input.setError(true);
			}
			var listBoundingRect = this._loginButton[0].getBoundingClientRect();
			var infoboxPopup = new InfoboxPopup({
				title: "Error",
				message: error.message,
				origin: {
					top: (listBoundingRect.top + listBoundingRect.bottom) / 2 + $(window).scrollTop(),
					left: listBoundingRect.left + $(window).scrollLeft()
				},
				error: true
			});
			infoboxPopup.show();
		},
        onInvalidLogin: function(model, error, options) {
            this.formHelper.setError($('#txtOLSLoginUserName, #txtOLSLoginPassword'));
            //			console.log(error);
		
            if(!Env.IE8 && matchMedia(MediaQueries.HEADER_HAMBURGER).matches) {
                var errorLightbox = new ErrorLightbox({
                    data: {
                        title: "Error",
                        message: "Invalid User Name or Password. Please try again."
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
                    message: "Invalid User Name or Password. Please try again.",
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
		onClickLoginButton: function(event) {
            event.preventDefault();
            $(".login").addClass('is_loading');
            var _this = this;
            if(this.model.isValid()) {
               var userName = $('#txtOLSLoginUserName').val();
                var pwd = $('#txtOLSLoginPassword').val();
                var authServicePath = Util.webserviceURL('/api/genericservice/Businesses/Login');
                $.ajax({
                    type: 'POST',
                    contentType: 'application/json',
                    url: authServicePath,
                    data: "{ userName:" + JSON.stringify(userName) + ", password: " + JSON.stringify(pwd) + "}",
                    success: function (retData) {
                  //console.log("Authentication Data", retData);
                        if (!retData.HasError) {
                            var token = retData.Data.token;
                            var date = new Date();
                            var minutes = 20;
                             date.setTime(date.getTime() + (minutes * 60 * 1000));
                           $.cookie('ASopentoken', token, { expires: date, domain: '.aflac.com', path: '/'});
                           window.location.href = "https://my.aflac.com";
                        }
                       else
                       {
                          _this.onInvalidLogin();
						 $(".login").removeClass('is_loading');
                       }
                    },
                    error: function (err) {
                          _this.onInvalidLogin();
						 $(".login").removeClass('is_loading');                
                    },
                });
            } 
        }
},
	{
		IE8: true
	});
	return AccountLogin;
});









